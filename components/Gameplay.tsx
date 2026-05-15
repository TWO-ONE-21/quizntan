"use client";

import { motion } from "framer-motion";
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
            <div className="max-w-md w-full">
                {/* Question Card */}
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="bg-orange-50 border-4 border-slate-800 rounded-3xl p-8 text-center shadow-[10px_10px_0_0_rgba(30,41,59,1)] transform -rotate-1 mb-10"
                >
                    <div className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest bg-slate-200 inline-block px-3 py-1 rounded-full">
                        Fakta atau Karangan?
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 leading-snug">
                        {question?.pernyataan || "Memuat..."}
                    </h2>
                </motion.div>

                {/* Buttons */}
                {currentAnswer === null ? (
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSubmitAnswer(true)}
                            className="py-8 px-4 text-2xl font-black text-white bg-game-green border-b-8 border-game-green-dark rounded-2xl hover:border-b-[10px] hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-lg"
                        >
                            FAKTA
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSubmitAnswer(false)}
                            className="py-8 px-4 text-2xl font-black text-white bg-game-red border-b-8 border-game-red-dark rounded-2xl hover:border-b-[10px] hover:-translate-y-1 active:border-b-0 active:translate-y-2 transition-all shadow-lg"
                        >
                            KARANGAN
                        </motion.button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm border-4 border-slate-800 rounded-2xl p-6 text-center shadow-[8px_8px_0_0_rgba(30,41,59,1)]"
                    >
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-xl font-bold text-slate-700 font-sans"
                        >
                            Menunggu ayang jawab... ⏳
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
