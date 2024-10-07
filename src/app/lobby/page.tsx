// app/lobby/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "../utils/socket";
import { Player } from "../types";

const LobbyPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const playerName = searchParams.get("playerName") || "";
    const roomId = searchParams.get("roomId") || "";
    const [socket, setSocket] = useState<Socket | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [partyLeaderId, setPartyLeaderId] = useState<string | null>(null);
    const [playerOrder, setPlayerOrder] = useState<string[]>([]);
    const [isPartyLeader, setIsPartyLeader] = useState<boolean>(false);
    const [selectedGame, setSelectedGame] = useState<string>("spades"); // Default game is "spades"
    const [gameOptions] = useState(["spades", "dominoes"]); // Add more game types here

    useEffect(() => {
        // Initialize Socket.IO connection
        const gameSocket = connectSocket({
            playerName: String(playerName),
            roomId: String(roomId),
        });

        setSocket(gameSocket);

        gameSocket.emit("join_room", {
            roomId,
            playerName,
            gameType: selectedGame,
        });

        // Handle incoming events
        gameSocket.on("player_list", ({ players, partyLeaderId, gameType }) => {
            setPlayers(players);
            setPartyLeaderId(partyLeaderId);
            if (gameType) {
                setSelectedGame(gameType);
            }
        });

        gameSocket.on("player_order_updated", ({ playerOrder }) => {
            setPlayerOrder(playerOrder);
        });

        gameSocket.on("party_leader_changed", ({ partyLeaderId }) => {
            setPartyLeaderId(partyLeaderId);
        });

        gameSocket.on("game_started", ({ currentPlayerId }) => {
            // Navigate to the game page
            router.push(
                `/game?playerName=${encodeURIComponent(
                    playerName
                )}&roomId=${encodeURIComponent(roomId)}`
            );
        });

        gameSocket.on("game_type_updated", ({ gameType }) => {
            console.log("Game type updated:", gameType);
            setSelectedGame(gameType);
        });

        // Cleanup on unmount
        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        if (socket && partyLeaderId) {
            setIsPartyLeader(socket.id === partyLeaderId);
        }
    }, [socket, partyLeaderId]);

    // Initialize player order when players change
    useEffect(() => {
        setPlayerOrder(players.map((p) => p.id));
    }, [players]);

    const setOrder = () => {
        if (socket) {
            socket.emit("set_player_order", { roomId, playerOrder });
        }
    };

    const startGame = () => {
        if (socket) {
            socket.emit("start_game", { roomId });
        }
    };

    const randomizeOrder = () => {
        const shuffledOrder = [...playerOrder];
        for (let i = shuffledOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOrder[i], shuffledOrder[j]] = [
                shuffledOrder[j],
                shuffledOrder[i],
            ];
        }
        setPlayerOrder(shuffledOrder);
    };

    const handleGameSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setSelectedGame(selected);
        if (socket) {
            socket.emit("set_game_type", { roomId, gameType: selected });
        }
    };

    const transferLeadership = (newLeaderId: string) => {
        if (socket) {
            socket.emit("transfer_leadership", {
                roomId: roomId,
                newLeaderId,
            });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Game Lobby</h1>
            <h2 className="text-lg font-semibold">Players:</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name} {player.id === socket?.id && "(you)"}
                        {player.id === partyLeaderId && (
                            <span className="ml-2 text-xs text-yellow-500">
                                (Leader)
                            </span>
                        )}
                    </li>
                ))}
            </ul>

            {/* Display the selected game to all players */}
            <div className="mt-4">
                <h3 className="font-semibold">Selected Game: {selectedGame}</h3>
            </div>

            {/* Display the player order to all players */}
            <div className="mt-4">
                <h3 className="font-semibold">Order of Play:</h3>
                <ul>
                    {playerOrder.map((playerId, index) => {
                        const player = players.find((p) => p.id === playerId);
                        return (
                            <li
                                key={playerId}
                                className="flex items-center my-2"
                            >
                                <span className="mr-2">
                                    {index + 1}. {player?.name}
                                    {player?.id === socket?.id && " (you)"}
                                </span>
                                {/* Only show reorder buttons to the party leader */}
                                {isPartyLeader && (
                                    <>
                                        <button
                                            disabled={index === 0}
                                            onClick={() => {
                                                const newOrder = [
                                                    ...playerOrder,
                                                ];
                                                [
                                                    newOrder[index - 1],
                                                    newOrder[index],
                                                ] = [
                                                    newOrder[index],
                                                    newOrder[index - 1],
                                                ];
                                                setPlayerOrder(newOrder);
                                            }}
                                            className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                        >
                                            ▲
                                        </button>
                                        <button
                                            disabled={
                                                index === playerOrder.length - 1
                                            }
                                            onClick={() => {
                                                const newOrder = [
                                                    ...playerOrder,
                                                ];
                                                [
                                                    newOrder[index],
                                                    newOrder[index + 1],
                                                ] = [
                                                    newOrder[index + 1],
                                                    newOrder[index],
                                                ];
                                                setPlayerOrder(newOrder);
                                            }}
                                            className="ml-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                        >
                                            ▼
                                        </button>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Party Leader Controls */}
            {isPartyLeader && (
                <div className="mt-4">
                    <h3 className="font-semibold">Set Game Type:</h3>
                    <select
                        value={selectedGame}
                        onChange={handleGameSelection}
                        className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-[var(--background)] text-[var(--foreground)]"
                    >
                        {gameOptions.map((game) => (
                            <option key={game} value={game}>
                                {game.charAt(0).toUpperCase() + game.slice(1)}
                            </option>
                        ))}
                    </select>

                    <div className="mt-4">
                        {/* First three buttons in a row */}
                        <div className="flex space-x-4">
                            <button
                                onClick={setOrder}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Set Player Order
                            </button>
                            <button
                                onClick={randomizeOrder}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-300 hover:text-gray-800"
                            >
                                Randomize Player Order
                            </button>
                        </div>

                        {/* Randomize Player Order button on a new row */}
                        <div className="mt-4">
                            <button
                                onClick={startGame}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Start Game
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3>Transfer Leadership:</h3>
                        <select
                            onChange={(e) => transferLeadership(e.target.value)}
                            className="text-[var(--foreground)] bg-[var(--card-background)]"
                        >
                            <option value="">Select Player</option>
                            {players
                                .filter((player) => player.id !== partyLeaderId)
                                .map((player) => (
                                    <option key={player.id} value={player.id}>
                                        {player.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            )}

            {!isPartyLeader && (
                <div className="mt-4">
                    <p>Waiting for the party leader to start the game...</p>
                </div>
            )}
        </div>
    );
};

export default LobbyPage;
