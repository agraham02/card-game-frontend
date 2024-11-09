import React from "react";
import { Player } from "../types";
import { Socket } from "socket.io-client";

interface PartyLeaderControlsProps {
    partyLeaderId: string | null;
    startGame: () => void;
    players: Player[];
    transferLeadership: (playerId: string) => void;
    playerOrder: string[];
    setPlayerOrder: (playOrder: string[]) => void;
    setOrder: () => void;
}

function PartyLeaderControls({
    partyLeaderId,
    startGame,
    players,
    transferLeadership,
    playerOrder,
    setPlayerOrder,
    setOrder,
}: PartyLeaderControlsProps) {
    

    return (
        <div>
            <button
                onClick={startGame}
                className={`mt-4 px-4 py-2 rounded ${
                    players.length === 4
                        ? "bg-blue-500 text-white"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                disabled={players.length !== 4}
            >
                Start Game
            </button>
            <div>
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
            <div>
                <h3 className="font-semibold">Set Player Order:</h3>
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
                                </span>
                                <button
                                    disabled={index === 0}
                                    onClick={() => {
                                        // Move player up in the order
                                        const newOrder = [...playerOrder];
                                        [newOrder[index - 1], newOrder[index]] =
                                            [
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
                                    disabled={index === playerOrder.length - 1}
                                    onClick={() => {
                                        // Move player down in the order
                                        const newOrder = [...playerOrder];
                                        [newOrder[index], newOrder[index + 1]] =
                                            [
                                                newOrder[index + 1],
                                                newOrder[index],
                                            ];
                                        setPlayerOrder(newOrder);
                                    }}
                                    className="ml-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                >
                                    ▼
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <button
                    onClick={setOrder}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Set Player Order
                </button>
            </div>
        </div>
    );
}

export default PartyLeaderControls;
