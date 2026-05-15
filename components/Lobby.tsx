"use client";

import { motion } from "framer-motion";
import { User, Loader2, Rocket } from "lucide-react";
import { GameState, PlayerType } from "@/hooks/useGameState";

interface Props {
    gameState: GameState;
    currentPlayer: PlayerType;
    onStartGame: () => void;
}

export default function Lobby({ gameState, currentPlayer, onStartGame }: Props) {
    const isArdoOnline = gameState.players?.ardo?.isOnline;
    const isCintanOnline = gameState.players?.cintan?.isOnline;
    const bothOnline = isArdoOnline && isCintanOnline;

    const partnerName = currentPlayer === "ardo" ? (gameState.players?.cintan?.displayName || "Cintan") : (gameState.players?.ardo?.displayName || "Ardo");

    const renderAvatar = (player: "ardo" | "cintan", bgClass: string, defaultEmoji: React.ReactNode) => {
        const p = gameState.players?.[player];
        const isOnline = p?.isOnline;
        return (
            <motion.div
                animate={isOnline ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`flex flex-col items-center relative gap-2 ${!isOnline ? 'opacity-50 grayscale' : ''}`}
            >
                <div className={`w-20 h-20 rounded-3xl border-4 border-slate-800 flex items-center justify-center text-4xl shadow-inner overflow-hidden object-cover bg-slate-200 ${bgClass}`}>
                    {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        defaultEmoji
                    )}
                </div>
                <span className="font-bold text-slate-700 text-sm max-w-[100px] text-center line-clamp-2 leading-none min-h-[30px] flex items-center justify-center">{p.displayName}</span>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 w-full">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="bg-slate-50 border-4 border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-[8px_8px_0_0_rgba(30,41,59,1)]"
            >
                <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-wide">
                    LOBBY
                </h2>

                <div className="flex justify-evenly gap-4 mb-8">
                    {renderAvatar("ardo", "bg-game-blue", <User className="w-10 h-10 text-white/80" />)}
                    {renderAvatar("cintan", "bg-game-pink", <User className="w-10 h-10 text-white/80" />)}
                </div>

                {!bothOnline ? (
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-lg font-bold text-slate-500 mb-4 px-2 flex items-center justify-center gap-2"
                    >
                        Menunggu {partnerName} login... <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.p>
                ) : (
                    <motion.div
                        animate={{ rotate: [-2, 2, -2] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="mt-6"
                    >
                        <button
                            onClick={onStartGame}
                            className="w-full py-4 text-2xl font-black text-white bg-game-green border-b-8 border-game-green-dark rounded-2xl hover:-translate-y-1 hover:border-b-[10px] active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wider shadow-lg flex items-center justify-center gap-3"
                        >
                            Mulai Game! <Rocket className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
