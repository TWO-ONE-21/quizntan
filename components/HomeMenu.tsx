"use client";

import { motion } from "framer-motion";
import { Home as HomeIcon, Play, RefreshCcw, Trophy, ListTree } from "lucide-react";

interface Props {
    onContinue: () => void;
    onChangeCategory: () => void;
    onRestart: () => void;
}

export default function HomeMenu({ onContinue, onChangeCategory, onRestart }: Props) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 w-full h-full relative z-10">
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.35, duration: 0.7 }}
                className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center"
                style={{
                    boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
            >
                {/* Icon */}
                <motion.div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(236,72,153,0.3))",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 8px 32px rgba(99,102,241,0.2)",
                    }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                    <HomeIcon className="w-9 h-9 text-white/80" />
                </motion.div>

                <h2
                    className="text-3xl font-black mb-2 tracking-tight"
                    style={{
                        background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    Menu Utama
                </h2>
                <p className="text-slate-500 text-sm mb-8">Mau ngapain nih?</p>

                {/* Continue button */}
                <motion.button
                    onClick={onContinue}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 px-6 text-base font-bold text-white rounded-2xl flex items-center justify-center gap-3 mb-3 relative overflow-hidden group"
                    style={{
                        background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                        boxShadow: "0 4px 24px rgba(16,185,129,0.3), 0 0 0 1px rgba(16,185,129,0.2)",
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                    />
                    <Play fill="currentColor" className="w-5 h-5" />
                    <span className="tracking-wide">Lanjutkan Permainan</span>
                </motion.button>

                {/* Change Category button */}
                <motion.button
                    onClick={onChangeCategory}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 px-6 text-base font-bold text-indigo-300 rounded-2xl flex items-center justify-center gap-3 mb-3 relative overflow-hidden group"
                    style={{
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(99,102,241,0.15)" }}
                    />
                    <ListTree className="w-5 h-5" />
                    <span className="tracking-wide">Ganti Topik (Skor Aman)</span>
                </motion.button>

                {/* Restart button */}
                <motion.button
                    onClick={onRestart}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 px-6 text-base font-bold text-rose-400 rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden group"
                    style={{
                        background: "rgba(244,63,94,0.05)",
                        border: "1px solid rgba(244,63,94,0.15)",
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(244,63,94,0.1)" }}
                    />
                    <RefreshCcw className="w-5 h-5" />
                    <span className="tracking-wide">Reset Semua (Mulai dari Nol)</span>
                </motion.button>

                <div className="flex items-center gap-2 mt-6 justify-center text-slate-600">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="text-xs">Semangat mainnya!</span>
                </div>
            </motion.div>
        </div>
    );
}
