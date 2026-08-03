"use client";

import { motion } from "framer-motion";
import { FastForward, User, PartyPopper, Frown, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { GameState, PlayerType } from "@/hooks/useGameState";

interface Props {
    gameState: GameState;
    currentPlayer: PlayerType;
    onNextQuestion: () => void;
    isGenerating?: boolean;
}

export default function Reveal({ gameState, currentPlayer, onNextQuestion, isGenerating }: Props) {
    const question = gameState.currentQuestion;
    const ardoAnswer = gameState.players.ardo.answer;
    const cintanAnswer = gameState.players.cintan.answer;
    const isFact = question?.is_fakta;

    const currentPlayerAnswer = currentPlayer === "ardo" ? ardoAnswer : cintanAnswer;
    const isBenar = currentPlayerAnswer === isFact;

    const renderPlayerCard = (player: "ardo" | "cintan") => {
        const isArdo = player === "ardo";
        const pAnswer = isArdo ? ardoAnswer : cintanAnswer;
        const pCorrect = pAnswer === isFact;
        const pData = gameState.players[player];
        const gradient = isArdo
            ? "linear-gradient(135deg, #4338ca, #6366f1)"
            : "linear-gradient(135deg, #be185d, #ec4899)";
        const isMe = player === currentPlayer;

        return (
            <div
                className="flex flex-col items-center gap-2 flex-1 text-center p-3 rounded-2xl relative"
                style={{
                    background: pCorrect ? "rgba(16,185,129,0.08)" : "rgba(244,63,94,0.06)",
                    border: `1px solid ${pCorrect ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.15)"}`,
                }}
            >
                {isMe && (
                    <div
                        className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                    >
                        KAMU
                    </div>
                )}
                <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden mt-1"
                    style={{
                        background: gradient,
                        boxShadow: `0 4px 16px ${isArdo ? "rgba(99,102,241,0.3)" : "rgba(236,72,153,0.3)"}`,
                    }}
                >
                    {pData?.avatarUrl ? (
                        <img src={pData.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                        <User className="w-7 h-7 text-white/80" />
                    )}
                </div>
                <span className="text-xs font-bold text-white/80 max-w-[80px] truncate leading-tight">
                    {pData?.displayName || (isArdo ? "Ardo" : "Cintan")}
                </span>
                <div
                    className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                        background: pCorrect
                            ? "linear-gradient(135deg, #059669, #10b981)"
                            : "linear-gradient(135deg, #be123c, #f43f5e)",
                        boxShadow: pCorrect ? "0 2px 8px rgba(16,185,129,0.3)" : "0 2px 8px rgba(244,63,94,0.3)",
                    }}
                >
                    {pAnswer ? "FAKTA" : "KARANGAN"}
                </div>
                <div className="flex justify-center">
                    {pCorrect
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400 stroke-[1.5]" />
                        : <XCircle className="w-5 h-5 text-rose-400 stroke-[1.5]" />
                    }
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 w-full">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.45, duration: 0.7 }}
                className="glass-strong rounded-3xl p-6 max-w-md w-full text-center"
                style={{
                    boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
            >
                {/* Result hero */}
                <motion.div
                    animate={isBenar
                        ? { rotate: [0, -8, 8, -8, 8, 0], scale: [1, 1.1, 1] }
                        : { y: [0, -6, 0], scale: [1, 0.96, 1] }
                    }
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex justify-center mb-3"
                >
                    <div
                        className="w-24 h-24 rounded-2xl flex items-center justify-center relative"
                        style={{
                            background: isBenar
                                ? "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.1))"
                                : "linear-gradient(135deg, rgba(244,63,94,0.2), rgba(251,113,133,0.1))",
                            border: `1px solid ${isBenar ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
                            boxShadow: isBenar
                                ? "0 8px 32px rgba(16,185,129,0.25)"
                                : "0 8px 32px rgba(244,63,94,0.25)",
                        }}
                    >
                        {isBenar
                            ? <PartyPopper className="w-12 h-12 text-emerald-400 stroke-[1.5]" />
                            : <Frown className="w-12 h-12 text-rose-400 stroke-[1.5]" />
                        }
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-black mb-1"
                    style={{
                        backgroundImage: isBenar
                            ? "linear-gradient(135deg, #34d399, #10b981)"
                            : "linear-gradient(135deg, #fb7185, #f43f5e)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    {isBenar ? "BENAR!" : "SALAH!"}
                </motion.h2>

                {/* Fact badge */}
                <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide text-white"
                            style={{
                                background: isFact
                                    ? "linear-gradient(135deg, #059669, #10b981)"
                                    : "linear-gradient(135deg, #be123c, #f43f5e)",
                            }}
                        >
                            {isFact
                                ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                                : <XCircle className="w-3.5 h-3.5 stroke-[2]" />
                            }
                            Ini {isFact ? "FAKTA" : "KARANGAN"}
                        </div>
                </div>

                {/* Explanation */}
                <div
                    className="rounded-2xl p-4 mb-5 text-left"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Penjelasan</p>
                        </div>
                        {question?.kategori && (
                            <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                    background: "rgba(99,102,241,0.15)",
                                    border: "1px solid rgba(99,102,241,0.2)",
                                    color: "#a5b4fc",
                                }}
                            >
                                {question.kategori.split(" — ")[1] || question.kategori}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed italic mb-3">
                        "{question?.penjelasan}"
                    </p>
                    {question?.sumber && (
                        <div
                            className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg w-fit"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                color: "rgba(255,255,255,0.4)",
                            }}
                        >
                            <BookOpen className="w-3 h-3" />
                            Sumber: {question.sumber}
                        </div>
                    )}
                </div>

                {/* Player comparison */}
                <div className="flex gap-3 mb-5">
                    {currentPlayer === "cintan" ? (
                        <>
                            {renderPlayerCard("cintan")}
                            {renderPlayerCard("ardo")}
                        </>
                    ) : (
                        <>
                            {renderPlayerCard("ardo")}
                            {renderPlayerCard("cintan")}
                        </>
                    )}
                </div>

                {/* Next button */}
                <motion.button
                    onClick={onNextQuestion}
                    disabled={isGenerating}
                    whileHover={!isGenerating ? { scale: 1.02, y: -2 } : undefined}
                    whileTap={!isGenerating ? { scale: 0.97 } : undefined}
                    className={`w-full py-4 text-base font-bold text-white rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden group ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                    style={{
                        background: "linear-gradient(135deg, #4338ca 0%, #6366f1 60%, #818cf8 100%)",
                        boxShadow: "0 8px 32px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.2)",
                    }}
                >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    <span className="relative z-10 tracking-wide">{isGenerating ? "Menyiapkan AI..." : "Lanjut Gas!"}</span>
                    {isGenerating ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                    ) : (
                        <FastForward className="w-5 h-5 relative z-10" />
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}
