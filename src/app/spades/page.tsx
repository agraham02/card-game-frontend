// app/spades/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/app/context/SocketContext";
import { Card as CardType, Player } from "@/app/types";
import CardHand from "@/app/components/CardHand";
import LoadingScreen from "../components/LoadingScreen";
import GameInfo from "./components/GameInfo";
import Card from "../components/Card";

function BidInput({ onSubmitBid }: { onSubmitBid: (bid: number) => void }) {
    const [bid, setBid] = useState<number>(0);

    function changeBid(value: 1 | -1) {
        setBid((prevValue) => prevValue + value);
    }

    return (
        <div>
            <div className="flex items-center space-x-2">
                <div onClick={() => changeBid(-1)}>-</div>
                <p>{bid}</p>
                <div onClick={() => changeBid(1)}>+</div>
            </div>
            <div onClick={() => onSubmitBid(bid)}>Submit</div>
        </div>
    );
}

function Trick({currentTrick}: {currentTrick: {card: CardType}[]}) {
    return (
        <div className="flex space-x-5">
            {currentTrick.map(({card}, index) => (
                <Card key={index} suit={card.suit} value={card.value} />
            ))}
        </div>
    );
}

const SpadesGamePage = () => {
    const { socket } = useSocket();
    const searchParams = useSearchParams();
    const playerName = searchParams.get("playerName") || "";
    const roomId = searchParams.get("roomId") || "";
    const [staticGameState, setStaticGameState] = useState({
        turnOrder: [],
        players: [],
        teams: [],
    });
    const [gameState, setGameState] = useState({
        hand: [],
        players: [],
        teams: [],
        currentTurnPlayerId: "",
        phase: "",
        currentBidderId: null,
        isHandReceived: false,
    });
    const [isGameLoaded, setIsGameLoaded] = useState(false);

    useEffect(() => {
        if (socket) {
            socket.emit("LOADED_GAME_PAGE", { roomId, playerId: socket.id });

            socket.on("GAME_STATE_UPDATE", ({staticGameState, gameState}) => {
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

            socket.on("ERROR", (data) => {
                console.error("Error:", data.message);
            });

            return () => {
                socket.off("GAME_STATE_UPDATE");
                socket.off("ERROR");
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

            {gameState.phase === "bidding" && gameState.currentTurnPlayerId === socket?.id && (
                <BidInput onSubmitBid={handleBidSubmit} />
            )}

            <Trick currentTrick={gameState.currentTrick} />
            {/* Additional game UI and logic */}
        </div>
    );
};

export default SpadesGamePage;
