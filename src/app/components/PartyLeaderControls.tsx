import React from "react";
import { Player } from "../types";

interface PartyLeaderControlsProps {
    partyLeaderId: string | null;
    startGame: () => void;
    players: Player[];
    transferLeadership: (playerId: string) => void;
}

function PartyLeaderControls({
    partyLeaderId,
    startGame,
    players,
    transferLeadership,
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
        </div>
    );
}

export default PartyLeaderControls;
