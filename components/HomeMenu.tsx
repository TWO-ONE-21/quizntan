"use client";

import { motion } from "framer-motion";

interface Props {
    onContinue: () => void;
    onRestart: () => void;
}

export default function HomeMenu({ onContinue, onRestart }: Props) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 w-full h-full relative z-10">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="bg-slate-50 border-4 border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-[10px_10px_0_0_rgba(30,41,59,1)]"
            >
                <div className="text-6xl mb-4">🏠</div>
                <h2 className="text-4xl font-black text-slate-800 mb-8 tracking-tight leading-none uppercase">
                    Menu Utama
                </h2>

                <button
                    onClick={onContinue}
                    className="w-full py-4 text-xl font-black text-white bg-game-green border-b-8 border-game-green-dark rounded-2xl hover:-translate-y-1 hover:border-b-[10px] active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wider mb-4 shadow-md"
                >
                    Lanjutkan Game ▶️
                </button>

                <button
                    onClick={onRestart}
                    className="w-full py-4 text-xl font-black text-white bg-game-red border-b-8 border-red-800 rounded-2xl hover:-translate-y-1 hover:border-b-[10px] active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wider shadow-md"
                >
                    Mulai Yang Baru 🔄
                </button>
            </motion.div>
        </div>
    );
}
