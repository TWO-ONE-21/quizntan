"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, User, Brain, ChevronRight } from "lucide-react";

interface Props {
    onSelect: (player: "ardo" | "cintan") => void;
}

export default function SplashScreen({ onSelect }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
            {/* Background orbs */}
            <div
                className="absolute w-80 h-80 rounded-full opacity-20 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, #6366f1, transparent)",
                    top: "10%",
                    left: "-10%",
                    animation: "orb-drift 12s ease-in-out infinite",
                }}
            />
            <div
                className="absolute w-64 h-64 rounded-full opacity-15 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, #ec4899, transparent)",
                    bottom: "5%",
                    right: "-5%",
                    animation: "orb-drift 15s ease-in-out infinite reverse",
                }}
            />

            <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center relative"
                style={{
                    boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
            >
                {/* Top sparkle */}
                <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <Sparkles className="w-5 h-5 text-game-gold" />
                </motion.div>

                {/* Title */}
                <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="mb-2"
                >
                    <h1
                        className="text-5xl font-black leading-tight"
                        style={{
                            background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #38bdf8 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Quiz Ayang
                    </h1>
                </motion.div>

                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <Heart className="w-4 h-4 text-game-pink fill-game-pink" />
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                <p className="text-slate-400 text-sm font-medium mb-8 tracking-wide">
                    Siapa kamu?
                </p>

                <div className="space-y-3">
                    {/* Ardo button */}
                    <motion.button
                        onClick={() => onSelect("ardo")}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full relative group overflow-hidden rounded-2xl p-[1px]"
                        style={{
                            background: "linear-gradient(135deg, #6366f1, #818cf8)",
                        }}
                    >
                        <div
                            className="relative rounded-2xl px-6 py-5 flex items-center justify-between transition-all duration-200"
                            style={{
                                background: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white"
                                    style={{ background: "rgba(255,255,255,0.15)" }}
                                >
                                    <User className="w-6 h-6 text-white/90" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-indigo-300 font-semibold tracking-widest uppercase mb-0.5">Pemain 1</div>
                                    <div className="text-xl font-extrabold text-white tracking-wide">Ardo</div>
                                </div>
                            </div>
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all"
                                style={{ background: "rgba(255,255,255,0.1)" }}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                        />
                    </motion.button>

                    {/* Cintan button */}
                    <motion.button
                        onClick={() => onSelect("cintan")}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full relative group overflow-hidden rounded-2xl p-[1px]"
                        style={{
                            background: "linear-gradient(135deg, #ec4899, #f472b6)",
                        }}
                    >
                        <div
                            className="relative rounded-2xl px-6 py-5 flex items-center justify-between transition-all duration-200"
                            style={{
                                background: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white"
                                    style={{ background: "rgba(255,255,255,0.15)" }}
                                >
                                    <User className="w-6 h-6 text-white/90" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-pink-300 font-semibold tracking-widest uppercase mb-0.5">Pemain 2</div>
                                    <div className="text-xl font-extrabold text-white tracking-wide">Cintan</div>
                                </div>
                            </div>
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all"
                                style={{ background: "rgba(255,255,255,0.1)" }}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                        />
                    </motion.button>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-6">
                    <Brain className="w-3 h-3 text-slate-600" />
                    <p className="text-slate-600 text-xs">Fakta atau Karangan?</p>
                </div>
            </motion.div>
        </div>
    );
}
