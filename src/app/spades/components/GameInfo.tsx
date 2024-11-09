import React from "react";
import { Player } from "@/app/types";

interface GameInfoProps {
    // turnOrder: string[];
    staticGameState: {
        players: Player[];
    };
    gameState: {
        currentTurnPlayerId: string;
        phase: string;
        bids: Record<string, number>;
        scores: Record<string, number>;
    };
}

const GameInfo: React.FC<GameInfoProps> = ({ staticGameState, gameState }) => {
    return (
        <div className="p-4 bg-[var(--card-background)] text-[var(--foreground)] rounded shadow-md mb-4">
            {/* <h2 className="text-xl font-bold mb-2">Game Information</h2> */}

            {/* Player Order */}
            <div className="mb-4">
                {/* <h3 className="font-semibold">Player Order:</h3> */}
                <ul className="list-disc list-inside">
                    {staticGameState.players.map((player) => (
                        <li key={player.id}>
                            {player.name}
                            {player.id === gameState.currentTurnPlayerId && (
                                <span className="text-green-600 font-bold">
                                    {" "}
                                    (Current Turn)
                                </span>
                            )}
                            {gameState.phase === "bidding" &&
                                player.id === gameState.currentTurnPlayerId && (
                                    <span className="text-blue-600 font-bold">
                                        {" "}
                                        (Currently Bidding)
                                    </span>
                                )}
                            {/* <span> - Team {player.teamId}</span> */}
                            <span> - Bid: {gameState.bids[player.id] !== null ? gameState.bids[player.id] : "???"}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Player Stats */}
            {/* <div className="mb-4">
                <h3 className="font-semibold">Player Stats:</h3>
                <table className="w-full text-left table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1">Player</th>
                            <th className="border px-2 py-1">Bid</th>
                            <th className="border px-2 py-1">Tricks Won</th>
                            <th className="border px-2 py-1">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.id}>
                                <td className="border px-2 py-1">
                                    {player.name}
                                </td>
                                <td className="border px-2 py-1">
                                    {player.bid !== null ? player.bid : "-"}
                                </td>
                                <td className="border px-2 py-1">
                                    {player.tricksWon}
                                </td>
                                <td className="border px-2 py-1">
                                    {player.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}

            {/* Team Scores */}
            {/* <div>
                <h3 className="font-semibold">Team Scores:</h3>
                <ul className="list-disc list-inside">
                    {teams.map((team) => (
                        <li key={team.teamId}>
                            Team {team.teamId}: {team.score} points
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
};

export default GameInfo;