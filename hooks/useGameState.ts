"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";

export type PlayerType = "ardo" | "cintan" | null;

export interface PlayerState {
    isOnline: boolean;
    score: number;
    answer: boolean | null;
    displayName?: string;
    avatarUrl?: string;
}

export interface QuestionType {
    pernyataan: string;
    is_fakta: boolean;
    penjelasan: string;
    sumber?: string;
    kategori?: string;
}

export interface CategorySelection {
    main: string;
    sub: string;
    selectedBy: "ardo" | "cintan";
}

export interface GameState {
    players: {
        ardo: PlayerState;
        cintan: PlayerState;
    };
    currentQuestion: QuestionType | null;
    status: "home" | "lobby" | "category_select" | "playing" | "reveal";
    resetVotes?: { ardo?: boolean; cintan?: boolean };
    selectedCategory?: CategorySelection | null;
    questionQueue?: QuestionType[];
    askedQuestions?: string[];
    isFetchingBackground?: boolean;
}

const DEFAULT_STATE: GameState = {
    status: "home",
    currentQuestion: null,
    selectedCategory: null,
    questionQueue: [],
    askedQuestions: [],
    isFetchingBackground: false,
    players: {
        ardo: { isOnline: false, score: 0, answer: null, displayName: "Ardo", avatarUrl: "" },
        cintan: { isOnline: false, score: 0, answer: null, displayName: "Cintan", avatarUrl: "" },
    },
};

export function useGameState() {
    const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE);
    const [currentPlayer, setCurrentPlayer] = useState<PlayerType>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedPlayer = localStorage.getItem("game_player_id") as PlayerType;
        if (savedPlayer) {
            setCurrentPlayer(savedPlayer);
        }
    }, []);

    useEffect(() => {
        const gameRef = ref(database, "game/state");
        const unsub = onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setGameState({
                    status: data.status || "home",
                    currentQuestion: data.currentQuestion || null,
                    resetVotes: data.resetVotes || { ardo: false, cintan: false },
                    selectedCategory: data.selectedCategory || null,
                    questionQueue: data.questionQueue || [],
                    askedQuestions: data.askedQuestions || [],
                    isFetchingBackground: data.isFetchingBackground || false,
                    players: {
                        ardo: { ...DEFAULT_STATE.players.ardo, ...data.players?.ardo },
                        cintan: { ...DEFAULT_STATE.players.cintan, ...data.players?.cintan },
                    },
                });
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const loginPlayer = async (player: "ardo" | "cintan") => {
        localStorage.setItem("game_player_id", player);
        setCurrentPlayer(player);
        await update(ref(database, `game/state/players/${player}`), {
            isOnline: true,
        });
    };

    const updateGameStatus = async (status: GameState["status"]) => {
        await update(ref(database, "game/state"), { status });
    };

    const submitAnswer = async (player: "ardo" | "cintan", answer: boolean) => {
        await update(ref(database, `game/state/players/${player}`), {
            answer,
        });
    };

    const updateProfile = async (player: "ardo" | "cintan", displayName: string, avatarUrl: string) => {
        await update(ref(database, `game/state/players/${player}`), {
            displayName,
            avatarUrl,
        });
    };

    const setCategory = async (
        player: "ardo" | "cintan",
        main: string,
        sub: string
    ) => {
        await update(ref(database, "game/state"), {
            selectedCategory: { main, sub, selectedBy: player },
        });
    };

    const confirmCategoryAndPlay = async () => {
        await update(ref(database, "game/state"), { status: "playing" });
    };

    const voteResetScore = async (player: "ardo" | "cintan", cancel: boolean = false) => {
        await update(ref(database, `game/state/resetVotes`), {
            [player]: !cancel,
        });
    };

    useEffect(() => {
        if (gameState.resetVotes?.ardo && gameState.resetVotes?.cintan) {
            if (currentPlayer === "ardo") {
                update(ref(database, "game/state/players/ardo"), { score: 0 });
                update(ref(database, "game/state/players/cintan"), { score: 0 });
                update(ref(database, "game/state/resetVotes"), { ardo: false, cintan: false });
            }
        }
    }, [gameState.resetVotes?.ardo, gameState.resetVotes?.cintan, currentPlayer]);

    return {
        gameState,
        currentPlayer,
        loginPlayer,
        updateGameStatus,
        submitAnswer,
        updateProfile,
        setCategory,
        confirmCategoryAndPlay,
        voteResetScore,
        loading,
    };
}
