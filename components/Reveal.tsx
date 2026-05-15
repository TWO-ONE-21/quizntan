"use client";

import { motion } from "framer-motion";
import { PartyPopper, Frown, FastForward, User } from "lucide-react";
import { GameState, PlayerType } from "@/hooks/useGameState";

interface Props {
    gameState: GameState;
    currentPlayer: PlayerType;
    onNextQuestion: () => void;
}

export default function Reveal({ gameState, currentPlayer, onNextQuestion }: Props) {
    const question = gameState.currentQuestion;
    const ardoAnswer = gameState.players.ardo.answer;
    const cintanAnswer = gameState.players.cintan.answer;
    const isFact = question?.is_fakta;

    const currentPlayerAnswer = currentPlayer === "ardo" ? ardoAnswer : cintanAnswer;
    const isBenar = currentPlayerAnswer === isFact;

    // Let only one person trigger the next question to avoid race conditions, e.g. Ardo, or whoever clicks first. Both buttons do the same.

    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 w-full">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="bg-white border-4 border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-[10px_10px_0_0_rgba(30,41,59,1)]"
            >
                <motion.div
                    animate={isBenar ? { rotate: [0, -10, 10, -10, 10, 0] } : { y: [0, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-6"
                >
                    {isBenar ? <PartyPopper className="w-24 h-24 text-green-500" /> : <Frown className="w-24 h-24 text-red-500" />}
                </motion.div>

                <h2 className="text-4xl font-black text-slate-800 mb-2">
                    {isBenar ? "BENAR!" : "SALAH!"}
                </h2>

                <div className={`inline-block px-4 py-1 rounded-full text-white font-bold text-sm mb-6 ${isFact ? 'bg-game-green' : 'bg-game-red'}`}>
                    Faktanya ini: {isFact ? 'FAKTA' : 'KARANGAN'}
                </div>

                <div className="bg-slate-100 rounded-2xl p-4 mb-6 text-slate-700 italic border-2 border-slate-200 text-left font-sans">
                    "{question?.penjelasan}"
                </div>

                <div className="flex justify-between items-center mb-8 px-4 w-full">
                    <div className="flex flex-col items-center flex-1 text-center truncate">
                        <div className="w-16 h-16 rounded-3xl mb-2 overflow-hidden bg-slate-200 border-2 border-slate-800 text-3xl flex items-center justify-center bg-game-blue shadow-inner">
                            {gameState.players.ardo.avatarUrl ? <img src={gameState.players.ardo.avatarUrl} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-white/80" />}
                        </div>
                        <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate mb-2 leading-tight min-h-[35px] flex items-center justify-center">{gameState.players.ardo.displayName || "Ardo"}</span>
                        <span className={`font-bold inline-block px-3 py-1 rounded-full text-white text-xs ${ardoAnswer === isFact ? 'bg-game-green' : 'bg-game-red'}`}>
                            {ardoAnswer ? "FAKTA" : "KARANGAN"}
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-300 mx-2">VS</div>
                    <div className="flex flex-col items-center flex-1 text-center truncate">
                        <div className="w-16 h-16 rounded-3xl mb-2 overflow-hidden bg-slate-200 border-2 border-slate-800 text-3xl flex items-center justify-center bg-game-pink shadow-inner">
                            {gameState.players.cintan.avatarUrl ? <img src={gameState.players.cintan.avatarUrl} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-white/80" />}
                        </div>
                        <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate mb-2 leading-tight min-h-[35px] flex items-center justify-center">{gameState.players.cintan.displayName || "Cintan"}</span>
                        <span className={`font-bold inline-block px-3 py-1 rounded-full text-white text-xs ${cintanAnswer === isFact ? 'bg-game-green' : 'bg-game-red'}`}>
                            {cintanAnswer ? "FAKTA" : "KARANGAN"}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onNextQuestion}
                    className="w-full py-4 text-xl font-black text-white bg-game-blue border-b-8 border-game-blue-dark rounded-2xl hover:-translate-y-1 hover:border-b-[10px] active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wider flex items-center justify-center gap-3"
                >
                    Lanjut Gas! <FastForward className="w-6 h-6" />
                </button>
            </motion.div>
        </div>
    );
}
