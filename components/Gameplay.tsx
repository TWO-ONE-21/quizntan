"use client";

import { motion } from "framer-motion";
import { Hourglass, Brain, CheckCircle2, XCircle } from "lucide-react";
import { GameState, PlayerType } from "@/hooks/useGameState";

interface Props {
    gameState: GameState;
    currentPlayer: PlayerType;
    onSubmitAnswer: (answer: boolean) => void;
}

export default function Gameplay({ gameState, currentPlayer, onSubmitAnswer }: Props) {
    const currentAnswer = currentPlayer ? gameState.players[currentPlayer]?.answer : null;
    const question = gameState.currentQuestion;

    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 w-full">
            <div className="max-w-md w-full space-y-5">
                {/* Question Card */}
                <motion.div
                    initial={{ scale: 0.85, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
                    className="glass-strong rounded-3xl p-7 text-center relative overflow-hidden"
                    style={{
                        boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Subtle glow accent */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-b-full"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)" }}
                    />

                    {/* Badge */}
                    <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
                        <div
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                            style={{
                                background: "rgba(245,158,11,0.15)",
                                border: "1px solid rgba(245,158,11,0.25)",
                                color: "#fbbf24",
                            }}
                        >
                            <Brain className="w-3.5 h-3.5" />
                            Fakta atau Karangan?
                        </div>
                        {question?.kategori && (
                            <div
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                style={{
                                    background: "rgba(99,102,241,0.15)",
                                    border: "1px solid rgba(99,102,241,0.25)",
                                    color: "#a5b4fc",
                                }}
                            >
                                {question.kategori.split(" — ")[1] || question.kategori}
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white leading-snug">
                        {question?.pernyataan || "Memuat..."}
                    </h2>
                </motion.div>

                {/* Buttons */}
                {currentAnswer === null ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        {/* FAKTA */}
                        <motion.button
                            whileHover={{ scale: 1.04, y: -3 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onSubmitAnswer(true)}
                            className="py-7 px-4 rounded-2xl font-extrabold text-lg text-white relative overflow-hidden group flex flex-col items-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                                boxShadow: "0 8px 32px rgba(16,185,129,0.35), 0 0 0 1px rgba(16,185,129,0.2)",
                            }}
                        >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                            <CheckCircle2 className="w-9 h-9 relative z-10 stroke-[1.5]" />
                            <span className="tracking-widest relative z-10">FAKTA</span>
                        </motion.button>

                        {/* KARANGAN */}
                        <motion.button
                            whileHover={{ scale: 1.04, y: -3 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onSubmitAnswer(false)}
                            className="py-7 px-4 rounded-2xl font-extrabold text-lg text-white relative overflow-hidden group flex flex-col items-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, #be123c 0%, #f43f5e 100%)",
                                boxShadow: "0 8px 32px rgba(244,63,94,0.35), 0 0 0 1px rgba(244,63,94,0.2)",
                            }}
                        >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                            <XCircle className="w-9 h-9 relative z-10 stroke-[1.5]" />
                            <span className="tracking-widest relative z-10">KARANGAN</span>
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-strong rounded-2xl p-6 text-center"
                        style={{
                            boxShadow: "0 16px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
                        }}
                    >
                        <div className="flex justify-center mb-3">
                            {currentAnswer
                                ? <CheckCircle2 className="w-10 h-10 text-emerald-400 stroke-[1.5]" />
                                : <XCircle className="w-10 h-10 text-rose-400 stroke-[1.5]" />
                            }
                        </div>
                        <div className="text-sm font-semibold text-white/70 mb-1">
                            Kamu menjawab: <span className="text-white font-bold">{currentAnswer ? "FAKTA" : "KARANGAN"}</span>
                        </div>
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            className="flex items-center justify-center gap-2 mt-3 text-slate-400 text-sm"
                        >
                            <Hourglass className="w-4 h-4" />
                            <span>Menunggu ayang jawab...</span>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
