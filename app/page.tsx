"use client";

import { useEffect, useState, useRef } from "react";
import { useGameState } from "@/hooks/useGameState";
import SplashScreen from "@/components/SplashScreen";
import Lobby from "@/components/Lobby";
import Gameplay from "@/components/Gameplay";
import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";
import { generateQuestion } from "@/actions/generateQuestion";
import { database } from "@/lib/firebase";
import { ref, update } from "firebase/database";

export default function Home() {
  const { gameState, currentPlayer, loginPlayer, updateGameStatus, submitAnswer, updateProfile, loading } = useGameState();
  const [isGenerating, setIsGenerating] = useState(false);
  const calculatedRef = useRef(false);

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
      {/* Scoreboard Header */}
      {gameState.status !== "lobby" && (
        <header className="w-full bg-slate-900 border-b-8 border-slate-950 text-white flex justify-between items-center px-6 py-4 rounded-b-[2.5rem] shadow-2xl z-20 sticky top-0 max-w-lg mx-auto mb-4">
          <div className="flex flex-col items-center relative flex-1">
            <div className="flex items-center gap-2 mb-1 justify-center">
              <div className={`relative ${currentPlayer === 'ardo' ? 'cursor-pointer group hover:scale-105 transition-transform' : ''}`} onClick={() => currentPlayer === 'ardo' && handleOpenEdit()}>
                <div className={`w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border-2 ${currentPlayer === 'ardo' ? 'group-hover:border-white transition-colors border-game-blue' : 'border-slate-700'} flex items-center justify-center text-xl shadow-inner bg-game-blue`}>
                  {gameState.players?.ardo?.avatarUrl ? <img src={gameState.players.ardo.avatarUrl} className="w-full h-full object-cover" /> : "👦"}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 tracking-widest break-words whitespace-normal text-center min-w-[50px]">{gameState.players?.ardo?.displayName || "Ardo"}</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-4xl font-black text-game-blue">{gameState.players?.ardo?.score || 0}</span>
            </div>
          </div>
          <div className="text-xl font-black text-slate-600 bg-slate-800 p-2 rounded-xl mx-2">VS</div>
          <div className="flex flex-col items-center relative flex-1">
            <div className="flex items-center gap-2 mb-1 justify-center flex-row-reverse">
              <div className={`relative ${currentPlayer === 'cintan' ? 'cursor-pointer group hover:scale-105 transition-transform' : ''}`} onClick={() => currentPlayer === 'cintan' && handleOpenEdit()}>
                <div className={`w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border-2 ${currentPlayer === 'cintan' ? 'group-hover:border-white transition-colors border-game-pink' : 'border-slate-700'} flex items-center justify-center text-xl shadow-inner bg-game-pink`}>
                  {gameState.players?.cintan?.avatarUrl ? <img src={gameState.players.cintan.avatarUrl} className="w-full h-full object-cover" /> : "👧"}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 tracking-widest break-words whitespace-normal text-center min-w-[50px]">{gameState.players?.cintan?.displayName || "Cintan"}</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-4xl font-black text-game-pink">{gameState.players?.cintan?.score || 0}</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto h-full flex flex-col justify-center">
        {gameState.status === "lobby" && (
          <Lobby
            gameState={gameState}
            currentPlayer={currentPlayer}
            onStartGame={handlenewRound}
          />
        )}

        {gameState.status === "playing" && (
          isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-xl font-bold text-slate-700 m-4">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border-4 border-slate-800 shadow-[8px_8px_0_0_rgba(30,41,59,1)] text-center animate-pulse">
                <div className="text-4xl mb-4">🤖</div>
                Minta soal ke Gemini...
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
            <h3 className="text-xl font-black mb-4">Edit Profil {currentPlayer === 'ardo' ? '👦' : '👧'}</h3>
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
