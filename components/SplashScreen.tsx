"use client";

import { motion } from "framer-motion";

interface Props {
    onSelect: (player: "ardo" | "cintan") => void;
}

export default function SplashScreen({ onSelect }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="bg-white/90 backdrop-blur-sm p-8 border-4 border-slate-800 rounded-[3rem] shadow-[8px_8px_0_0_rgba(30,41,59,1)] max-w-md w-full text-center"
            >
                <motion.h1
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-game-pink to-game-blue mb-8 drop-shadow-sm leading-tight"
                >
                    Quiz Ayang
                </motion.h1>

                <div className="space-y-6">
                    <button
                        onClick={() => onSelect("ardo")}
                        className="w-full py-4 text-2xl font-bold text-white bg-game-blue border-b-8 border-game-blue-dark rounded-2xl hover:-translate-y-1 hover:border-b-[10px] active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="text-4xl">👦</span> Saya Ardo
                    </button>

                    <button
                        onClick={() => onSelect("cintan")}
                        className="w-full py-4 text-2xl font-bold text-white bg-game-pink border-b-8 border-game-pink-dark rounded-2xl hover:-translate-y-1 hover:border-b-[10px] active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="text-4xl">👧</span> Saya Cintan
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
