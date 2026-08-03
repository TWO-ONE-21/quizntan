"use client";

import { motion } from "framer-motion";
import { User, Loader2, Rocket, Wifi, WifiOff, DoorOpen } from "lucide-react";
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

    const renderAvatar = (player: "ardo" | "cintan", gradient: string) => {
        const p = gameState.players?.[player];
        const isOnline = p?.isOnline;
        const isMe = player === currentPlayer;
        return (
            <motion.div
                animate={isOnline ? { y: [0, -4, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: player === "cintan" ? 0.4 : 0 }}
                className="flex flex-col items-center gap-3"
            >
                <div className="relative">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden relative"
                        style={{
                            background: isOnline ? gradient : "rgba(255,255,255,0.05)",
                            boxShadow: isOnline ? `0 8px 24px ${player === "ardo" ? "rgba(99,102,241,0.35)" : "rgba(236,72,153,0.35)"}` : "none",
                            border: `1px solid ${isOnline ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                            opacity: isOnline ? 1 : 0.4,
                            filter: isOnline ? "none" : "grayscale(1)",
                        }}
                    >
                        {p?.avatarUrl ? (
                            <img src={p.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-9 h-9 text-white/80" />
                        )}
                    </div>
                    {/* Online indicator */}
                    <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                            background: isOnline ? "#10b981" : "#475569",
                            border: "2px solid #0a0a1a",
                            boxShadow: isOnline ? "0 0 8px rgba(16,185,129,0.6)" : "none",
                        }}
                    >
                        {isOnline ? (
                            <Wifi className="w-2.5 h-2.5 text-white" />
                        ) : (
                            <WifiOff className="w-2.5 h-2.5 text-white/60" />
                        )}
                    </div>
                    {isMe && (
                        <div
                            className="absolute -top-1.5 -left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                        >
                            ME
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <div className="text-sm font-bold text-white/90 max-w-[90px] truncate">{p?.displayName || (player === "ardo" ? "Ardo" : "Cintan")}</div>
                    <div className={`text-xs mt-0.5 font-medium ${isOnline ? "text-emerald-400" : "text-slate-500"}`}>
                        {isOnline ? "Online" : "Offline"}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 w-full">
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
                className="glass-strong rounded-3xl p-8 max-w-md w-full text-center"
                style={{
                    boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="h-px flex-1 bg-white/5" />
                    <div
                        className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                        style={{
                            background: "rgba(99,102,241,0.2)",
                            border: "1px solid rgba(99,102,241,0.3)",
                            color: "#a5b4fc",
                        }}
                    >
                        <DoorOpen className="w-3.5 h-3.5" />
                        Lobby
                    </div>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Players */}
                <div className="flex justify-evenly gap-6 mb-8">
                    {currentPlayer === "cintan" ? (
                        <>
                            {renderAvatar("cintan", "linear-gradient(135deg, #be185d, #ec4899)")}
                            <div className="flex flex-col items-center justify-center">
                                <div
                                    className="text-base font-black px-3 py-1 rounded-lg"
                                    style={{ color: "rgba(255,255,255,0.2)" }}
                                >
                                    VS
                                </div>
                            </div>
                            {renderAvatar("ardo", "linear-gradient(135deg, #4338ca, #6366f1)")}
                        </>
                    ) : (
                        <>
                            {renderAvatar("ardo", "linear-gradient(135deg, #4338ca, #6366f1)")}
                            <div className="flex flex-col items-center justify-center">
                                <div
                                    className="text-base font-black px-3 py-1 rounded-lg"
                                    style={{ color: "rgba(255,255,255,0.2)" }}
                                >
                                    VS
                                </div>
                            </div>
                            {renderAvatar("cintan", "linear-gradient(135deg, #be185d, #ec4899)")}
                        </>
                    )}
                </div>

                {!bothOnline ? (
                    <motion.div
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="flex items-center justify-center gap-3 py-4 px-5 rounded-2xl"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                        <p className="text-sm font-medium text-slate-400">
                            Menunggu <span className="text-white font-bold">{partnerName}</span> join...
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        <motion.button
                            onClick={onStartGame}
                            whileHover={{ scale: 1.03, y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-4 text-base font-bold text-white rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden group"
                            style={{
                                background: "linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)",
                                boxShadow: "0 8px 32px rgba(16,185,129,0.4), 0 0 0 1px rgba(16,185,129,0.2)",
                            }}
                        >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                            <Rocket className="w-5 h-5 relative z-10" />
                            <span className="tracking-wide relative z-10">Mulai Game!</span>
                        </motion.button>
                        <p className="text-emerald-500 text-xs font-medium mt-3">✓ Semua pemain sudah online</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
