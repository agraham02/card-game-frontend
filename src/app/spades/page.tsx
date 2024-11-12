// app/spades/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/app/context/SocketContext";
import { Card as CardType } from "@/app/types/Card";
import CardHand from "@/app/components/CardHand";
import LoadingScreen from "../components/LoadingScreen";
import GameInfo from "./components/GameInfo";
import Card from "../components/Card";
import { SpadesGameState, SpadesStaticGameState } from "../types/spades";
import { useError } from "../context/ErrorContext";
import RoundStatsOverlay from "./components/RoundStatsOverlay";

function BidInput({
    onSubmitBid,
}: Readonly<{ onSubmitBid: (bid: number) => void }>) {
    const [bid, setBid] = useState<number>(0);

    function changeBid(value: 1 | -1) {
        setBid((prevValue) => prevValue + value);
    }

    return (
        <div>
            <div className="flex items-center space-x-2">
                <button onClick={() => changeBid(-1)}>-</button>
                <p>{bid}</p>
                <button onClick={() => changeBid(1)}>+</button>
            </div>
            <button onClick={() => onSubmitBid(bid)}>Submit</button>
        </div>
    );
}

function Trick({
    currentTrick,
    winningPlayer,
}: Readonly<{
    currentTrick: { playerId: string; card: CardType }[];
    winningPlayer: { name: string; id: string };
}>) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex space-x-5">
                {currentTrick.map(({ playerId, card }) => (
                    <div
                        key={`${card.suit}-${card.value}`}
                        className="flex flex-col items-center"
                    >
                        <Card suit={card.suit} value={card.value} />
                        <p>{playerId === winningPlayer.id ? "Winner!" : ""}</p>
                    </div>
                ))}
            </div>
            {winningPlayer.id && (
                <p className="mt-4 text-green-600 font-semibold">
                    {winningPlayer.name} won this trick!
                </p>
            )}
        </div>
    );
}

const SpadesGamePage = () => {
    const { socket } = useSocket();
    const { setError } = useError();
    const searchParams = useSearchParams();
    // const playerName = searchParams.get("playerName") ?? "";
    const roomId = searchParams.get("roomId") ?? "";
    const [staticGameState, setStaticGameState] =
        useState<SpadesStaticGameState>({
            players: [],
            teams: {},
        });
    const [gameState, setGameState] = useState<SpadesGameState>({
        hand: [],
        currentTurnPlayerId: "",
        phase: "",
        bids: {},
        scores: {},
        currentTurnIndex: null,
        tricksWon: {},
        currentTrick: [],
    });
    const [winningPlayer, setWinningPlayer] = useState({ name: "", id: "" });
    const [isGameLoaded, setIsGameLoaded] = useState(false);
    const [roundStats, setRoundStats] = useState(null);
    const [showRoundStats, setShowRoundStats] = useState(false);

    useEffect(() => {
        if (showRoundStats) {
            const timer = setTimeout(() => {
                setShowRoundStats(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showRoundStats]);

    useEffect(() => {
        if (socket) {
            socket.emit("LOADED_GAME_PAGE", { roomId, playerId: socket.id });

            socket.on("GAME_STATE_UPDATE", ({ staticGameState, gameState }) => {
                console.log("Game state updated:");
                console.log(staticGameState);
                console.log(gameState);

                if (staticGameState) {
                    setStaticGameState((prevState) => ({
                        ...prevState,
                        ...staticGameState,
                    }));
                }
                setGameState((prevState) => ({
                    ...prevState,
                    ...gameState,
                }));
                setIsGameLoaded(true);
            });

            socket.on(
                "TRICK_COMPLETED",
                ({ winningPlayerId, winningPlayerName, currentTurnIndex }) => {
                    // Show the winning player of the trick
                    setGameState((prevState) => ({
                        ...prevState,
                        currentTurnIndex,
                    }));
                    setWinningPlayer({
                        name: winningPlayerName,
                        id: winningPlayerId,
                    });
                }
            );

            socket.on("NEXT_TRICK", ({ currentTurnIndex }) => {
                // Clear the winning player display when the next trick starts
                setGameState((prevState) => ({
                    ...prevState,
                    winningPlayerId: null,
                    currentTurnIndex,
                    // Set to the next player's turn
                }));
                setWinningPlayer({ name: "", id: "" });
            });

            socket.on("GAME_OVER", ({ scores }) => {
                alert("Game Over! Final scores: " + JSON.stringify(scores));
            });

            socket.on("NEW_ROUND_STARTED", ({ currentTurnIndex }) => {
                setGameState((prevState) => ({
                    ...prevState,
                    currentTurnIndex,
                    phase: "bidding",
                    currentTrick: [],
                    bids: {}, // Reset bids
                    tricksWon: {}, // Reset tricks won
                }));
                setWinningPlayer({ name: "", id: "" });
            });

            socket.on("ERROR", (error) => {
                setError(error);
            });

            socket.on("ROUND_ENDED", ({ roundStats }) => {
                setRoundStats(roundStats);
                setShowRoundStats(true);
            });

            return () => {
                socket.off("GAME_STATE_UPDATE");
                socket.off("TRICK_COMPLETED");
                socket.off("NEXT_TRICK");
                socket.off("GAME_OVER");
                socket.off("NEW_ROUND_STARTED");
                socket.off("ERROR");
                socket.on("ROUND_ENDED", ({ roundStats }) => {
                    setRoundStats(roundStats);
                    setShowRoundStats(true);
                });
            };
        }
    }, [socket]);

    const handleCardClick = (card: CardType) => {
        socket?.emit("PLAYER_ACTION", {
            roomId,
            playerId: socket.id,
            action: {
                type: "PLAY_CARD",
                card,
            },
        });
    };

    const handleBidSubmit = (bid: number) => {
        socket?.emit("PLAYER_ACTION", {
            roomId,
            playerId: socket.id,
            action: {
                type: "PLACE_BID",
                bid,
            },
        });
    };

    if (!isGameLoaded) {
        return <LoadingScreen message="Waiting for game data..." />;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Spades Game</h1>
            <GameInfo staticGameState={staticGameState} gameState={gameState} />

            <CardHand cards={gameState.hand} onCardClick={handleCardClick} />

            {gameState.phase === "bidding" &&
                gameState.currentTurnPlayerId === socket?.id && (
                    <BidInput onSubmitBid={handleBidSubmit} />
                )}

            <Trick
                currentTrick={gameState.currentTrick}
                winningPlayer={winningPlayer}
            />

            {showRoundStats && roundStats && (
                <RoundStatsOverlay
                    roundStats={roundStats}
                    onClose={() => setShowRoundStats(false)}
                />
            )}
        </div>
    );
};

export default SpadesGamePage;
