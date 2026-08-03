"use client";

import { useEffect, useState, useRef } from "react";
import { Home as HomeIcon, Pencil, Bot, User, X, Heart, FolderOpen } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import SplashScreen from "@/components/SplashScreen";
import HomeMenu from "@/components/HomeMenu";
import Lobby from "@/components/Lobby";
import CategorySelect from "@/components/CategorySelect";
import Gameplay from "@/components/Gameplay";
import Reveal from "@/components/Reveal";
import LockScreen from "@/components/LockScreen";
import { motion, AnimatePresence } from "framer-motion";
import { generateQuestion } from "@/actions/generateQuestion";
import { database } from "@/lib/firebase";
import { ref, update } from "firebase/database";

export default function Home() {
  const { gameState, currentPlayer, loginPlayer, updateGameStatus, submitAnswer, updateProfile, setCategory, voteResetScore, loading } = useGameState();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const calculatedRef = useRef(false);

  useEffect(() => {
    const expiry = localStorage.getItem("quiz_lock_expiry");
    if (expiry && Date.now() < parseInt(expiry)) {
      setIsLocked(false);
    }
  }, []);

  const mePlayer = currentPlayer || "ardo";
  const opponentPlayer = mePlayer === "ardo" ? "cintan" : "ardo";

  // Global Profile Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const handleOpenEdit = () => {
    if (!currentPlayer) return;
    const p = gameState.players[currentPlayer];
    setEditName(p.displayName || "");
    setEditUrl(p.avatarUrl || "");
    setIsEditing(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    if (!currentPlayer) return;
    updateProfile(currentPlayer, editName, editUrl);
    setIsEditing(false);
  };

  useEffect(() => {
    if (loading || gameState.status === "loading") {
      calculatedRef.current = false; // Reset for this round
      const p1Answer = gameState.players?.ardo?.answer;
      const p2Answer = gameState.players?.cintan?.answer;

      if (p1Answer !== null && p1Answer !== undefined && p2Answer !== null && p2Answer !== undefined) {
        if (currentPlayer === "ardo" && !calculatedRef.current) {
          calculatedRef.current = true;
          handleRoundEnd(p1Answer, p2Answer);
        }
      }
    }
  }, [gameState.players?.ardo?.answer, gameState.players?.cintan?.answer, gameState.status, currentPlayer]);

  const handleRoundEnd = async (ardoAnswer: boolean, cintanAnswer: boolean) => {
    const isFact = gameState.currentQuestion?.is_fakta;
    let ardoAdd = 0;
    let cintanAdd = 0;

    const ardoBenar = ardoAnswer === isFact;
    const cintanBenar = cintanAnswer === isFact;

    if (ardoBenar && cintanBenar) {
      ardoAdd = 10;
      cintanAdd = 10;
    } else if (ardoBenar && !cintanBenar) {
      ardoAdd = 15;
    } else if (!ardoBenar && cintanBenar) {
      cintanAdd = 15;
    }

    const newArdoScore = (gameState.players?.ardo?.score || 0) + ardoAdd;
    const newCintanScore = (gameState.players?.cintan?.score || 0) + cintanAdd;

    await update(ref(database, "game/state/players/ardo"), { score: newArdoScore });
    await update(ref(database, "game/state/players/cintan"), { score: newCintanScore });

    setTimeout(() => {
      updateGameStatus("reveal");
    }, 1000);
  };

  // Called when Lobby Start button is pressed — go to category selection
  const handleGoToCategorySelect = async () => {
    await update(ref(database, "game/state/players/ardo"), { answer: null });
    await update(ref(database, "game/state/players/cintan"), { answer: null });
    await update(ref(database, "game/state"), { selectedCategory: null });
    await updateGameStatus("category_select");
  };

  // Called when category is confirmed — generate question and start playing
  const handleStartWithCategory = async () => {
    if (gameState.isFetchingBackground) return; // Global lock
    const cat = gameState.selectedCategory;
    if (!cat) return;

    // Lock globally
    await update(ref(database, "game/state"), { isFetchingBackground: true, status: "playing", currentQuestion: null });
    setIsGenerating(true);

    const history = gameState.askedQuestions || [];
    const questions = await generateQuestion(cat ? { main: cat.main, sub: cat.sub } : undefined, history);
    const newHistory = [...history, ...questions.map(q => q.pernyataan)].slice(-30);

    await update(ref(database, "game/state"), {
      currentQuestion: questions[0] || null,
      questionQueue: questions.slice(1),
      askedQuestions: newHistory,
      isFetchingBackground: false,
    });
    setIsGenerating(false);
  };

  // Background Pre-fetching Hook (HANYA ARDO YANG FETCH DI LATAR BELAKANG)
  useEffect(() => {
    const queue = gameState.questionQueue || [];
    if (
      gameState.status === "playing" &&
      gameState.currentQuestion &&
      queue.length <= 2 &&
      !gameState.isFetchingBackground &&
      currentPlayer === "ardo"
    ) {
      const fetchMore = async () => {
        // Lock background
        await update(ref(database, "game/state"), { isFetchingBackground: true });
        const cat = gameState.selectedCategory;
        const history = gameState.askedQuestions || [];
        const newQuestions = await generateQuestion(cat ? { main: cat.main, sub: cat.sub } : undefined, history);
        
        // Re-fetch queue and history in case it changed
        const currentQueue = gameState.questionQueue || [];
        const currentHistory = gameState.askedQuestions || [];
        const updatedHistory = [...currentHistory, ...newQuestions.map(q => q.pernyataan)].slice(-30);

        await update(ref(database, "game/state"), {
          questionQueue: [...currentQueue, ...newQuestions],
          askedQuestions: updatedHistory,
          isFetchingBackground: false,
        });
      };
      fetchMore();
    }
  }, [gameState.questionQueue, gameState.status, gameState.isFetchingBackground, currentPlayer]);

  // Called from Reveal "Next question" — go back to lobby for re-selection
  const handleNextRound = async () => {
    if (isGenerating || gameState.isFetchingBackground) return; // Prevent spam

    await update(ref(database, "game/state/players/ardo"), { answer: null });
    await update(ref(database, "game/state/players/cintan"), { answer: null });
    
    const queue = gameState.questionQueue || [];
    if (queue.length > 0) {
        // Instan 0 detik loading
        const nextQ = queue[0];
        const remaining = queue.slice(1);
        await update(ref(database, "game/state"), {
            currentQuestion: nextQ,
            questionQueue: remaining,
            status: "playing"
        });
    } else {
        // Jika antrean kosong (jarang terjadi karena ada background fetch)
        await handleStartWithCategory();
    }
  };

  if (isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(236,72,153,0.3))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 32px rgba(99,102,241,0.3)",
            }}
          >
            <Heart className="w-7 h-7 text-indigo-400" fill="rgba(99,102,241,0.3)" />
          </div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Memuat...</p>
        </motion.div>
      </div>
    );
  }

  if (!currentPlayer) {
    return <SplashScreen onSelect={loginPlayer} />;
  }

  const meGradient = mePlayer === "ardo"
    ? "linear-gradient(135deg, #4338ca, #6366f1)"
    : "linear-gradient(135deg, #be185d, #ec4899)";
  const oppGradient = opponentPlayer === "ardo"
    ? "linear-gradient(135deg, #4338ca, #6366f1)"
    : "linear-gradient(135deg, #be185d, #ec4899)";
  const meGlow = mePlayer === "ardo" ? "rgba(99,102,241,0.4)" : "rgba(236,72,153,0.4)";
  const oppGlow = opponentPlayer === "ardo" ? "rgba(99,102,241,0.4)" : "rgba(236,72,153,0.4)";

  return (
    <div className="h-[100dvh] flex flex-col w-full relative overflow-hidden">

      {/* Scoreboard & Menu Bar (Unified Glass Panel) */}
      {gameState.status !== "lobby" && gameState.status !== "home" && (
        <div className="w-full max-w-lg mx-auto z-30 shrink-0 px-3 pt-3 relative">
          <div
            className="w-full flex flex-col gap-3 px-4 py-3 rounded-[32px]"
            style={{
              background: "rgba(15,15,30,0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Top Row: Scoreboard */}
            <header className="w-full text-white flex justify-between items-center">
              {/* Me side */}
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={handleOpenEdit}
                  className="relative shrink-0 group"
                  title="Edit profil"
                >
                  <div
                    className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center text-lg transition-all group-hover:scale-105"
                    style={{
                      background: meGradient,
                      boxShadow: `0 4px 16px ${meGlow}`,
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {gameState.players?.[mePlayer]?.avatarUrl
                      ? <img src={gameState.players[mePlayer].avatarUrl} className="w-full h-full object-cover" alt="me" />
                      : <User className="w-5 h-5 text-white/80" />
                    }
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center">
                    <Pencil className="w-2 h-2 text-slate-400" />
                  </div>
                </button>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest truncate max-w-[70px]">
                    {gameState.players?.[mePlayer]?.displayName || (mePlayer === "ardo" ? "Ardo" : "Cintan")}
                  </div>
                  <div
                    className="text-3xl font-black leading-none gradient-text-score"
                    style={{ backgroundImage: meGradient }}
                  >
                    {gameState.players?.[mePlayer]?.score || 0}
                  </div>
                </div>
              </div>

              {/* VS */}
              <div
                className="text-xs font-black tracking-widest px-3 py-1.5 rounded-lg shrink-0 mx-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                VS
              </div>

              {/* Opponent side */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest truncate max-w-[70px]">
                    {gameState.players?.[opponentPlayer]?.displayName || (opponentPlayer === "ardo" ? "Ardo" : "Cintan")}
                  </div>
                  <div
                    className="text-3xl font-black leading-none gradient-text-score"
                    style={{ backgroundImage: oppGradient }}
                  >
                    {gameState.players?.[opponentPlayer]?.score || 0}
                  </div>
                </div>
                <div
                  className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center text-lg shrink-0"
                  style={{
                    background: oppGradient,
                    boxShadow: `0 4px 16px ${oppGlow}`,
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {gameState.players?.[opponentPlayer]?.avatarUrl
                    ? <img src={gameState.players[opponentPlayer].avatarUrl} className="w-full h-full object-cover" alt="opp" />
                    : <User className="w-5 h-5 text-white/80" />
                  }
                </div>
              </div>
            </header>

            {/* Bottom Row: Buttons */}
            {currentPlayer && (
              <div className="flex items-center justify-center gap-2 flex-wrap pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  onClick={() => updateGameStatus("home")}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-4 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <HomeIcon className="w-3 h-3" />
                  Menu
                </button>
                {gameState.selectedCategory && (gameState.status === "playing" || gameState.status === "reveal") && (
                  <div
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-4 py-1.5 rounded-full max-w-[160px] truncate"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.25)",
                      color: "#a5b4fc",
                    }}
                  >
                    <span className="truncate">{gameState.selectedCategory.sub}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Subtle bottom gradient to hide scrolling text smoothly */}
          <div className="absolute inset-x-0 -bottom-6 h-6 bg-gradient-to-t from-transparent to-[#0a0a1a] pointer-events-none -z-10" />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full h-full overflow-y-auto pb-8">
        <div className="w-full max-w-md mx-auto min-h-full flex flex-col justify-center">
        {gameState.status === "home" && (
          <HomeMenu
            onContinue={() => {
              if (gameState.currentQuestion) {
                // Return to game
                const p1 = gameState.players?.ardo?.answer;
                const p2 = gameState.players?.cintan?.answer;
                if (p1 !== null && p1 !== undefined && p2 !== null && p2 !== undefined) {
                  updateGameStatus("reveal");
                } else {
                  updateGameStatus("playing");
                }
              } else if (gameState.selectedCategory) {
                updateGameStatus("category_select");
              } else {
                updateGameStatus("lobby");
              }
            }}
            onChangeCategory={async () => {
              await update(ref(database, "game/state/players/ardo"), { answer: null });
              await update(ref(database, "game/state/players/cintan"), { answer: null });
              await update(ref(database, "game/state"), { selectedCategory: null, currentQuestion: null });
              updateGameStatus("lobby");
            }}
            onRestart={async () => {
              await update(ref(database, "game/state/players/ardo"), { score: 0, answer: null });
              await update(ref(database, "game/state/players/cintan"), { score: 0, answer: null });
              await update(ref(database, "game/state/resetVotes"), { ardo: false, cintan: false });
              await update(ref(database, "game/state"), { selectedCategory: null, currentQuestion: null });
              await updateGameStatus("lobby");
            }}
          />
        )}

        {gameState.status === "lobby" && (
          <Lobby
            gameState={gameState}
            currentPlayer={currentPlayer}
            onStartGame={handleGoToCategorySelect}
          />
        )}

        {gameState.status === "category_select" && (
          <CategorySelect
            gameState={gameState}
            currentPlayer={currentPlayer}
            onSetCategory={(main, sub) => {
              if (currentPlayer) setCategory(currentPlayer, main, sub);
            }}
            onConfirm={handleStartWithCategory}
            isConfirming={isGenerating || gameState.isFetchingBackground}
          />
        )}

        {gameState.status === "playing" && (
          (isGenerating || gameState.isFetchingBackground && !gameState.currentQuestion) ? (
            <div className="flex-1 flex flex-col items-center justify-center m-4">
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="glass-strong rounded-3xl px-8 py-10 text-center flex flex-col items-center"
                style={{
                  boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))",
                    border: "1px solid rgba(99,102,241,0.2)",
                    boxShadow: "0 0 24px rgba(99,102,241,0.2)",
                  }}
                >
                  <Bot className="w-8 h-8 text-indigo-400" />
                </div>
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="text-sm font-semibold text-slate-300"
                >
                  Minta soal ke AI...
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <Gameplay
              gameState={gameState}
              currentPlayer={currentPlayer}
              onSubmitAnswer={(ans) => submitAnswer(currentPlayer, ans)}
            />
          )
        )}

        {gameState.status === "reveal" && (
          <Reveal
            gameState={gameState}
            currentPlayer={currentPlayer}
            onNextQuestion={handleNextRound}
            isGenerating={isGenerating || (gameState.isFetchingBackground && (gameState.questionQueue?.length || 0) === 0)}
          />
        )}
        </div>
      </main>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="glass-strong p-6 rounded-3xl max-w-sm w-full"
              style={{
                boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(99,102,241,0.2)",
                      border: "1px solid rgba(99,102,241,0.3)",
                    }}
                  >
                    <Pencil className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Edit Profil</h3>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Nama / Emoji
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium transition-all outline-none"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    placeholder="Nama kamu..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    URL Foto
                  </label>
                  <input
                    type="text"
                    value={editUrl}
                    onChange={e => setEditUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium transition-all outline-none mb-2"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                  <label className="block">
                    <div
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-center cursor-pointer transition-all flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(99,102,241,0.15)",
                        border: "1px dashed rgba(99,102,241,0.4)",
                        color: "#a5b4fc",
                      }}
                    >
                      <FolderOpen className="w-4 h-4" />
                      Atau upload gambar
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #4338ca, #6366f1)",
                      boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
