"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Landmark,
    FlaskConical,
    Globe,
    Palette,
    Trophy,
    UtensilsCrossed,
    HeartPulse,
    BookOpen,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Sparkles,
    Check,
    Users,
    Brain,
    Telescope,
    Eye,
} from "lucide-react";
import { GameState, PlayerType } from "@/hooks/useGameState";

interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    glow: string;
    subs: string[];
}

const CATEGORIES: Category[] = [
    {
        id: "sejarah",
        name: "Sejarah",
        icon: <Landmark className="w-7 h-7" />,
        color: "linear-gradient(135deg, #b45309, #d97706)",
        glow: "rgba(217, 119, 6, 0.35)",
        subs: [
            "Sejarah Indonesia",
            "Sejarah Dunia",
            "Sejarah Islam",
            "Perang Dunia & Militer",
            "Tokoh Berpengaruh",
        ],
    },
    {
        id: "sains",
        name: "Sains & Teknologi",
        icon: <FlaskConical className="w-7 h-7" />,
        color: "linear-gradient(135deg, #0e7490, #06b6d4)",
        glow: "rgba(6, 182, 212, 0.35)",
        subs: [
            "Penemuan Mengubah Dunia",
            "Fisika & Matematika",
            "Kecerdasan Buatan (AI)",
            "Teknologi Digital & Komputer",
        ],
    },
    {
        id: "geografi",
        name: "Geografi",
        icon: <Globe className="w-7 h-7" />,
        color: "linear-gradient(135deg, #15803d, #22c55e)",
        glow: "rgba(34, 197, 94, 0.35)",
        subs: [
            "Negara & Ibu Kota",
            "Alam & Lingkungan",
            "Peta & Benua",
            "Rekor Geografis",
        ],
    },
    {
        id: "budaya",
        name: "Budaya & Seni",
        icon: <Palette className="w-7 h-7" />,
        color: "linear-gradient(135deg, #7e22ce, #a855f7)",
        glow: "rgba(168, 85, 247, 0.35)",
        subs: [
            "Budaya & Tradisi Indonesia",
            "Film & Sinema Dunia",
            "Seni Rupa & Arsitektur",
            "Urban Legend & Mitos Lokal",
        ],
    },

    {
        id: "kuliner",
        name: "Kuliner",
        icon: <UtensilsCrossed className="w-7 h-7" />,
        color: "linear-gradient(135deg, #c2410c, #f97316)",
        glow: "rgba(249, 115, 22, 0.35)",
        subs: [
            "Makanan Tradisional Indonesia",
            "Masakan Dunia",
            "Fakta Unik Makanan",
            "Minuman & Kopi",
        ],
    },
    {
        id: "kesehatan",
        name: "Kesehatan & Tubuh",
        icon: <HeartPulse className="w-7 h-7" />,
        color: "linear-gradient(135deg, #0f766e, #14b8a6)",
        glow: "rgba(20, 184, 166, 0.35)",
        subs: [
            "Anatomi Tubuh",
            "Fakta Medis & Biologi Tubuh",
        ],
    },
    {
        id: "agama",
        name: "Agama & Kepercayaan",
        icon: <BookOpen className="w-7 h-7" />,
        color: "linear-gradient(135deg, #1d4ed8, #6366f1)",
        glow: "rgba(99, 102, 241, 0.35)",
        subs: [
            "Islam & Sejarahnya",
            "Agama-Agama Dunia",
            "Kepercayaan Tradisional",
        ],
    },
    {
        id: "literatur",
        name: "Buku & Sastra",
        icon: <BookOpen className="w-7 h-7" />,
        color: "linear-gradient(135deg, #be185d, #e11d48)",
        glow: "rgba(225, 29, 72, 0.35)",
        subs: [
            "Fiksi & Novel Populer",
            "Sastra Indonesia Klasik",
            "Puisi, Pantun & Kutipan",
            "Karya Non-Fiksi Terlaris",
        ],
    },
    {
        id: "kosmos",
        name: "Evolusi & Alam Semesta",
        icon: <Telescope className="w-7 h-7" />,
        color: "linear-gradient(135deg, #1e1b4b, #4338ca)",
        glow: "rgba(67, 56, 202, 0.35)",
        subs: [
            "Sejarah Umat Manusia (Sapiens)",
            "Kosmos & Astronomi",
            "Masa Depan & AI (Homo Deus)",
            "Evolusi Biologi",
            "Fisika Populer",
        ],
    },
    {
        id: "psikologi",
        name: "Psikologi & Filsafat",
        icon: <Brain className="w-7 h-7" />,
        color: "linear-gradient(135deg, #831843, #be185d)",
        glow: "rgba(190, 24, 93, 0.35)",
        subs: [
            "Psikologi Kognitif & Perilaku",
            "Geopolitik & Ideologi",
            "Tokoh Politik Sejarah",
            "Filsafat & Stoikisme",
            "Psikologi Gelap (Dark Psych)",
        ],
    },
    {
        id: "misteri",
        name: "Kuno & Misteri",
        icon: <Eye className="w-7 h-7" />,
        color: "linear-gradient(135deg, #14532d, #15803d)",
        glow: "rgba(21, 128, 61, 0.35)",
        subs: [
            "Mitologi & Sumeria (Anunnaki)",
            "Kekaisaran Romawi & Yunani",
            "Peradaban yang Hilang",
            "Teori Konspirasi Populer",
            "Sejarah Gelap (Dark History)",
        ],
    },
];

interface Props {
    gameState: GameState;
    currentPlayer: PlayerType;
    onSetCategory: (main: string, sub: string) => void;
    onConfirm: () => void;
    isConfirming: boolean;
}

export default function CategorySelect({
    gameState,
    currentPlayer,
    onSetCategory,
    onConfirm,
    isConfirming,
}: Props) {
    const [step, setStep] = useState<"main" | "sub">("main");
    const [hoveredMain, setHoveredMain] = useState<string | null>(null);

    const selected = gameState.selectedCategory;
    const selectedBy = selected?.selectedBy;
    const isMySelection = selectedBy === currentPlayer;
    const partnerName = currentPlayer === "ardo"
        ? (gameState.players.cintan?.displayName || "Cintan")
        : (gameState.players.ardo?.displayName || "Ardo");
    const myName = currentPlayer === "ardo"
        ? (gameState.players.ardo?.displayName || "Ardo")
        : (gameState.players.cintan?.displayName || "Cintan");

    const selectedCategory = selected
        ? CATEGORIES.find((c) => c.name === selected.main)
        : null;

    const handleSelectMain = (cat: Category) => {
        setStep("sub");
        // Pre-select the main category so partner sees it immediately
        onSetCategory(cat.name, cat.subs[0]);
    };

    const handleSelectSub = (sub: string) => {
        if (!selectedCategory) return;
        onSetCategory(selectedCategory.name, sub);
    };

    const handleBack = () => {
        setStep("main");
    };

    const canConfirm = selected && selected.main && selected.sub;

    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 w-full">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="glass-strong rounded-3xl p-6 max-w-md w-full"
                style={{
                    boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
            >
                {/* Header */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            {step === "sub" && (
                                <button
                                    onClick={handleBack}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
                                    style={{ color: "rgba(255,255,255,0.5)" }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            )}
                            <div>
                                <h2 className="text-lg font-extrabold text-white leading-tight">
                                    {step === "main" ? "Pilih Kategori" : selectedCategory?.name}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {step === "main"
                                        ? "Topik apa yang ingin dipelajari?"
                                        : "Pilih sub-topik yang spesifik"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                color: "rgba(255,255,255,0.4)",
                            }}
                        >
                            <Sparkles className="w-3 h-3" />
                            Edukatif
                        </div>
                    </div>

                    {/* Live status bar */}
                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
                            style={{
                                background: selectedCategory
                                    ? `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2))`
                                    : "rgba(255,255,255,0.03)",
                                border: `1px solid ${selectedCategory ? selectedCategory.glow.replace("0.35", "0.2") : "rgba(255,255,255,0.06)"}`,
                            }}
                        >
                            <div
                                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-white"
                                style={{ background: selectedCategory?.color || "rgba(255,255,255,0.1)" }}
                            >
                                <span className="scale-[0.55] block">{selectedCategory?.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold text-white/80 truncate block">
                                    {selected.main}
                                    {selected.sub !== selected.main && (
                                        <span className="text-white/40"> / {selected.sub}</span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {isMySelection ? (
                                    <span className="text-[10px] font-bold text-emerald-400">Kamu</span>
                                ) : (
                                    <span className="text-[10px] font-bold text-indigo-400">{selectedBy === "ardo" ? (gameState.players.ardo?.displayName || "Ardo") : (gameState.players.cintan?.displayName || "Cintan")}</span>
                                )}
                                <Users className="w-3 h-3 text-white/30" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Main category grid */}
                <AnimatePresence mode="wait">
                    {step === "main" && (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 gap-2.5 mb-5"
                        >
                            {CATEGORIES.map((cat, i) => {
                                const isSelected = selected?.main === cat.name;
                                return (
                                    <motion.button
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleSelectMain(cat)}
                                        onMouseEnter={() => setHoveredMain(cat.id)}
                                        onMouseLeave={() => setHoveredMain(null)}
                                        className="relative rounded-2xl p-4 text-left group overflow-hidden"
                                        style={{
                                            background: isSelected
                                                ? cat.color
                                                : "rgba(255,255,255,0.04)",
                                            border: `1px solid ${isSelected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
                                            boxShadow: isSelected ? `0 8px 24px ${cat.glow}` : "none",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            style={{ background: isSelected ? "rgba(255,255,255,0.08)" : cat.color.replace("135deg", "135deg").replace(")", ", 0.08)").replace("linear-gradient(", "linear-gradient(") }}
                                        />
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 text-white relative z-10"
                                            style={{
                                                background: isSelected
                                                    ? "rgba(255,255,255,0.2)"
                                                    : "rgba(255,255,255,0.06)",
                                                boxShadow: isSelected ? `0 4px 12px ${cat.glow}` : "none",
                                            }}
                                        >
                                            {cat.icon}
                                        </div>
                                        <div className="relative z-10">
                                            <div className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-white/70"}`}>
                                                {cat.name}
                                            </div>
                                            <div className={`text-[10px] mt-0.5 ${isSelected ? "text-white/60" : "text-white/30"}`}>
                                                {cat.subs.length} sub-topik
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}

                    {step === "sub" && selectedCategory && (
                        <motion.div
                            key="sub"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2 mb-5"
                        >
                            {selectedCategory.subs.map((sub, i) => {
                                const isSelected = selected?.sub === sub;
                                return (
                                    <motion.button
                                        key={sub}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSelectSub(sub)}
                                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-left group relative overflow-hidden"
                                        style={{
                                            background: isSelected
                                                ? selectedCategory.color
                                                : "rgba(255,255,255,0.04)",
                                            border: `1px solid ${isSelected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
                                            boxShadow: isSelected ? `0 6px 20px ${selectedCategory.glow}` : "none",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ background: "rgba(255,255,255,0.04)" }}
                                        />
                                        <div className="flex items-center gap-3 relative z-10">
                                            <div
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                                                style={{
                                                    background: isSelected
                                                        ? "rgba(255,255,255,0.2)"
                                                        : "rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                <span className="scale-75 block">{selectedCategory.icon}</span>
                                            </div>
                                            <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-white/70"}`}>
                                                {sub}
                                            </span>
                                        </div>
                                        <div className="relative z-10">
                                            {isSelected ? (
                                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Partner watching indicator */}
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    <div className="flex -space-x-1.5">
                        <div
                            className="w-5 h-5 rounded-full border border-black/30 overflow-hidden flex items-center justify-center text-[9px] font-bold text-white"
                            style={{
                                background: currentPlayer === "ardo"
                                    ? "linear-gradient(135deg, #4338ca, #6366f1)"
                                    : "linear-gradient(135deg, #be185d, #ec4899)",
                            }}
                        >
                            {myName.charAt(0)}
                        </div>
                        <div
                            className="w-5 h-5 rounded-full border border-black/30 overflow-hidden flex items-center justify-center text-[9px] font-bold text-white"
                            style={{
                                background: currentPlayer === "ardo"
                                    ? "linear-gradient(135deg, #be185d, #ec4899)"
                                    : "linear-gradient(135deg, #4338ca, #6366f1)",
                            }}
                        >
                            {partnerName.charAt(0)}
                        </div>
                    </div>
                    <p className="text-[11px] text-white/40 flex-1">
                        {partnerName} melihat pilihanmu secara live
                    </p>
                    <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-1 rounded-full bg-indigo-400"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </div>

                {/* Confirm button */}
                <motion.button
                    onClick={onConfirm}
                    disabled={!canConfirm || isConfirming}
                    whileHover={canConfirm && !isConfirming ? { scale: 1.02, y: -2 } : {}}
                    whileTap={canConfirm && !isConfirming ? { scale: 0.97 } : {}}
                    className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 relative overflow-hidden group transition-all"
                    style={{
                        background: canConfirm && !isConfirming
                            ? (selectedCategory?.color || "linear-gradient(135deg, #4338ca, #6366f1)")
                            : "rgba(255,255,255,0.05)",
                        boxShadow: canConfirm && !isConfirming
                            ? `0 8px 32px ${selectedCategory?.glow || "rgba(99,102,241,0.4)"}`
                            : "none",
                        border: `1px solid ${canConfirm ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
                        cursor: canConfirm && !isConfirming ? "pointer" : "not-allowed",
                        opacity: canConfirm ? 1 : 0.4,
                    }}
                >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    {isConfirming ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                            <span className="relative z-10">Membuat soal...</span>
                        </>
                    ) : (
                        <>
                            {selectedCategory?.icon && (
                                <span className="relative z-10 scale-90">{selectedCategory.icon}</span>
                            )}
                            <span className="relative z-10">
                                {canConfirm
                                    ? `Mulai dengan "${selected?.sub}"`
                                    : "Pilih kategori dulu"}
                            </span>
                            {canConfirm && <ChevronRight className="w-4 h-4 relative z-10" />}
                        </>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}
