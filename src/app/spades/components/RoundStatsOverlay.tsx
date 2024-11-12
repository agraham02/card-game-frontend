// app/spades/components/RoundStatsOverlay.tsx

import React from "react";

interface RoundStatsOverlayProps {
    roundStats: any;
    onClose: () => void;
}

const RoundStatsOverlay: React.FC<RoundStatsOverlayProps> = ({
    roundStats,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[var(--card-background)] text-[var(--foreground)] p-6 rounded shadow-lg w-3/4 max-w-3xl">
                <h2 className="text-xl font-bold mb-4 text-center">
                    End of Round Stats
                </h2>
                <div className="flex justify-around">
                    {roundStats.teams.map((team: any) => (
                        <div key={team.teamId} className="w-1/2 px-4">
                            <h3 className="text-lg font-semibold mb-2">
                                Team {team.teamId}
                            </h3>
                            <table className="w-full text-left table-auto">
                                <thead>
                                    <tr>
                                        <th className="border px-2 py-1">
                                            Player
                                        </th>
                                        <th className="border px-2 py-1">
                                            Bid
                                        </th>
                                        <th className="border px-2 py-1">
                                            Tricks Won
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.players.map((player: any) => (
                                        <tr key={player.playerId}>
                                            <td className="border px-2 py-1">
                                                {player.name}
                                            </td>
                                            <td className="border px-2 py-1 text-center">
                                                {player.bid}
                                            </td>
                                            <td className="border px-2 py-1 text-center">
                                                {player.tricksWon}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4">
                                <p>
                                    Total Bid: <strong>{team.totalBid}</strong>
                                </p>
                                <p>
                                    Total Tricks Won:{" "}
                                    <strong>{team.totalTricksWon}</strong>
                                </p>
                                <p>
                                    Round Score:{" "}
                                    <strong>{team.roundScore}</strong>
                                </p>
                                <p>
                                    Total Score:{" "}
                                    <strong>{team.totalScore}</strong>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoundStatsOverlay;
