"use client";

import { motion } from "framer-motion";
import { Home as HomeIcon, Play, RefreshCcw } from "lucide-react";

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
                <div className="flex justify-center mb-6 text-slate-800">
                    <HomeIcon className="w-20 h-20" />
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-8 tracking-tight leading-none uppercase">
                    Menu Utama
                </h2>

                <button
                    onClick={onContinue}
                    className="w-full py-4 text-xl flex items-center justify-center gap-3 font-black text-white bg-game-green border-b-8 border-game-green-dark rounded-2xl hover:-translate-y-1 hover:border-b-[10px] active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wider mb-4 shadow-md"
                >
                    Lanjutkan Game <Play fill="currentColor" className="w-5 h-5" />
                </button>

                <button
                    onClick={onRestart}
                    className="w-full py-4 text-xl flex items-center justify-center gap-3 font-black text-white bg-game-red border-b-8 border-red-800 rounded-2xl hover:-translate-y-1 hover:border-b-[10px] active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wider shadow-md"
                >
                    Mulai Yang Baru <RefreshCcw className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
}
