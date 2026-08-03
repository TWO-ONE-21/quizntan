"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Delete, X } from "lucide-react";

interface Props {
  onUnlock: () => void;
}

const CORRECT_PIN = "20032026";
const MAX_LENGTH = 8;

export default function LockScreen({ onUnlock }: Props) {
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (pin.length === MAX_LENGTH) {
      if (pin === CORRECT_PIN) {
        setIsSuccess(true);
        // Save to localStorage (24 hours)
        const expiry = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem("quiz_lock_expiry", expiry.toString());
        
        setTimeout(() => {
          onUnlock();
        }, 800);
      } else {
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
          setPin("");
        }, 500);
      }
    }
  }, [pin, onUnlock]);

  const handleKeyPress = (num: number) => {
    if (pin.length < MAX_LENGTH && !isError && !isSuccess) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isError && !isSuccess) {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05050f] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/20 blur-[120px] mix-blend-screen" />

      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-sm px-8"
        animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 flex flex-col items-center"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
            isSuccess ? "bg-emerald-500/20 text-emerald-400" : 
            isError ? "bg-rose-500/20 text-rose-400" : "bg-white/5 text-white/50"
          }`}>
            {isSuccess ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <h1 className="text-xl font-medium text-white/90">
            {isSuccess ? "Akses Diberikan" : "Masukkan PIN"}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {isSuccess ? "Memuat aplikasi..." : "Diperlukan untuk membuka aplikasi"}
          </p>
        </motion.div>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-12 h-4 justify-center items-center">
          {Array.from({ length: MAX_LENGTH }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                i < pin.length 
                  ? isSuccess ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" 
                    : isError ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                    : "bg-white" 
                  : "bg-white/10"
              }`}
              animate={i < pin.length ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-light text-white hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              {num}
            </button>
          ))}
          <div /> {/* Empty space bottom left */}
          <button
            onClick={() => handleKeyPress(0)}
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-light text-white hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-20 h-20 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <Delete className="w-7 h-7" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
