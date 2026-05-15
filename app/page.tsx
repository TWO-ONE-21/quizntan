"use client";

import { useEffect, useState, useRef } from "react";
import { Home as HomeIcon, Pencil, RefreshCcw, AlertTriangle, Bot, User } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import SplashScreen from "@/components/SplashScreen";
import HomeMenu from "@/components/HomeMenu";
import Lobby from "@/components/Lobby";
import Gameplay from "@/components/Gameplay";
import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";
import { generateQuestion } from "@/actions/generateQuestion";
import { database } from "@/lib/firebase";
import { ref, update } from "firebase/database";

export default function Home() {
  const { gameState, currentPlayer, loginPlayer, updateGameStatus, submitAnswer, updateProfile, voteResetScore, loading } = useGameState();
  const [isGenerating, setIsGenerating] = useState(false);
  const calculatedRef = useRef(false);

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
    if (gameState.status === "playing") {
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

  const handlenewRound = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    // Clear answers
    await update(ref(database, "game/state/players/ardo"), { answer: null });
    await update(ref(database, "game/state/players/cintan"), { answer: null });

    // Ensure status stays lobby or changes temporarily to wait
    await updateGameStatus("lobby");

    const question = await generateQuestion();

    await update(ref(database, "game/state"), {
      currentQuestion: question,
      status: "playing",
    });

    setIsGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-black text-white animate-pulse">
        Memuat...
      </div>
    );
  }

  if (!currentPlayer) {
    return <SplashScreen onSelect={loginPlayer} />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full relative overflow-hidden">
      {/* Global Home Switcher */}
      {gameState.status !== "home" && (
        <button
          onClick={() => updateGameStatus("home")}
          className="absolute top-4 left-4 z-40 bg-slate-800 text-white p-3 rounded-full hover:bg-slate-700 shadow border-2 border-slate-600 active:scale-95 transition-transform"
        >
          <HomeIcon className="w-5 h-5" />
        </button>
      )}

      {/* Scoreboard Header */}
      {gameState.status !== "lobby" && gameState.status !== "home" && (
        <div className="w-full max-w-lg mx-auto z-20 sticky top-0">
          <header className="w-full bg-slate-900 border-b-8 border-slate-950 text-white flex justify-between items-center px-4 py-4 rounded-b-[2.5rem] shadow-2xl mb-3">
            <div className="flex flex-col items-center relative flex-1">
              <div className="flex items-center gap-2 mb-1 justify-start w-full px-2">
                <div className={`relative ${currentPlayer === mePlayer ? 'cursor-pointer group hover:scale-105 transition-transform' : ''}`} onClick={() => currentPlayer === mePlayer && handleOpenEdit()}>
                  <div className={`w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border-2 ${currentPlayer === mePlayer ? `group-hover:border-white transition-colors border-game-${mePlayer === 'ardo' ? 'blue' : 'pink'}` : 'border-slate-700'} flex items-center justify-center text-xl shadow-inner bg-game-${mePlayer === 'ardo' ? 'blue' : 'pink'}`}>
                    {gameState.players?.[mePlayer]?.avatarUrl ? <img src={gameState.players[mePlayer].avatarUrl} className="w-full h-full object-cover" /> : <User className="w-7 h-7 text-white/80" />}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400 tracking-widest break-words whitespace-normal text-left px-3 min-w-[50px] w-full">{gameState.players?.[mePlayer]?.displayName || (mePlayer === "ardo" ? "Ardo" : "Cintan")}</span>
              <div className="flex items-center gap-3 mt-1 w-full justify-start px-3">
                <span className={`text-4xl font-black text-game-${mePlayer === 'ardo' ? 'blue' : 'pink'}`}>{gameState.players?.[mePlayer]?.score || 0}</span>
              </div>
            </div>

            <div className="text-xl font-black text-slate-600 bg-slate-800 p-2 rounded-xl mx-2 shrink-0">VS</div>

            <div className="flex flex-col items-center relative flex-1">
              <div className="flex items-center gap-2 mb-1 justify-end w-full px-2">
                <div className={`relative ${currentPlayer === opponentPlayer ? 'cursor-pointer group hover:scale-105 transition-transform' : ''}`} onClick={() => currentPlayer === opponentPlayer && handleOpenEdit()}>
                  <div className={`w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border-2 ${currentPlayer === opponentPlayer ? `group-hover:border-white transition-colors border-game-${opponentPlayer === 'ardo' ? 'blue' : 'pink'}` : 'border-slate-700'} flex items-center justify-center text-xl shadow-inner bg-game-${opponentPlayer === 'ardo' ? 'blue' : 'pink'}`}>
                    {gameState.players?.[opponentPlayer]?.avatarUrl ? <img src={gameState.players[opponentPlayer].avatarUrl} className="w-full h-full object-cover" /> : <User className="w-7 h-7 text-white/80" />}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400 tracking-widest break-words whitespace-normal text-right px-3 min-w-[50px] w-full">{gameState.players?.[opponentPlayer]?.displayName || (opponentPlayer === "ardo" ? "Ardo" : "Cintan")}</span>
              <div className="flex items-center gap-3 mt-1 w-full justify-end px-3">
                <span className={`text-4xl font-black text-game-${opponentPlayer === 'ardo' ? 'blue' : 'pink'}`}>{gameState.players?.[opponentPlayer]?.score || 0}</span>
              </div>
            </div>
          </header>
          {currentPlayer && (
            <div className="flex justify-center text-center w-full relative z-10 -mt-2 drop-shadow-md">
              {!gameState.resetVotes?.[currentPlayer] && !gameState.resetVotes?.[currentPlayer === "ardo" ? "cintan" : "ardo"] && (
                <button onClick={() => voteResetScore(currentPlayer, false)} className="text-[10px] bg-slate-100 text-slate-500 font-bold px-4 py-1.5 rounded-full hover:bg-slate-200 shadow border border-slate-300 transition-colors">🔄 Reset Skor Pertandingan</button>
              )}
              {gameState.resetVotes?.[currentPlayer] && !gameState.resetVotes?.[currentPlayer === "ardo" ? "cintan" : "ardo"] && (
                <button onClick={() => voteResetScore(currentPlayer, true)} className="text-[10px] animate-pulse bg-amber-100 border border-amber-300 text-amber-700 font-bold px-4 py-1.5 rounded-full hover:bg-amber-200 shadow">Menunggu persetujuan partner... (Batal)</button>
              )}
              {!gameState.resetVotes?.[currentPlayer] && gameState.resetVotes?.[currentPlayer === "ardo" ? "cintan" : "ardo"] && (
                <button onClick={() => voteResetScore(currentPlayer, false)} className="text-[10px] animate-pulse bg-game-red border border-red-500 text-white font-bold px-4 py-1.5 rounded-full hover:bg-red-600 shadow">⚠️ Partner ingin mereset skor! Klik untuk setuju.</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto h-full flex flex-col justify-center">
        {gameState.status === "home" && (
          <HomeMenu
            onContinue={() => updateGameStatus("lobby")}
            onRestart={async () => {
              await update(ref(database, "game/state/players/ardo"), { score: 0, answer: null });
              await update(ref(database, "game/state/players/cintan"), { score: 0, answer: null });
              await update(ref(database, "game/state/resetVotes"), { ardo: false, cintan: false });
              await update(ref(database, "game/state"), { currentQuestion: null });
              await updateGameStatus("lobby");
            }}
          />
        )}

        {gameState.status === "lobby" && (
          <Lobby
            gameState={gameState}
            currentPlayer={currentPlayer}
            onStartGame={handlenewRound}
          />
        )}

        {gameState.status === "playing" && (
          isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-bold m-4">
              <div className="bg-white/80 backdrop-blur-sm px-8 py-10 rounded-3xl border-4 border-slate-800 shadow-[8px_8px_0_0_rgba(30,41,59,1)] text-center animate-pulse flex flex-col items-center">
                <Bot className="w-16 h-16 text-slate-800 mb-4" />
                <span className="text-xl text-slate-700">Minta soal ke AI...</span>
              </div>
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
            onNextQuestion={handlenewRound}
          />
        )}
      </main>

      {/* Global Modal Edit Profile */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white border-4 border-slate-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Pencil className="w-6 h-6 text-slate-800" />
              <h3 className="text-xl font-black">Edit Profil</h3>
            </div>
            <div className="space-y-4 text-left font-bold text-sm text-slate-700">
              <div>
                <label className="block mb-1">Nama / Emoji</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-game-blue focus:outline-none" />
              </div>
              <div>
                <label className="block mb-1">URL Foto atau Upload</label>
                <input type="text" value={editUrl} onChange={e => setEditUrl(e.target.value)} placeholder="https://..." className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-game-blue focus:outline-none mb-2" />
                <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-game-blue file:text-white hover:file:bg-game-blue-dark focus:outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-slate-200 text-slate-800 rounded-xl font-black active:scale-95 transition-transform">Batal</button>
                <button onClick={handleSaveEdit} className="flex-1 py-3 bg-game-blue border-b-4 border-game-blue-dark text-white rounded-xl font-black active:border-b-0 active:translate-y-1 transition-all">Simpan</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
