import { Socket } from "socket.io-client";
import { Player } from "../types"; // Assuming Player includes 'bid' and 'tricksWon'

interface PlayerListProps {
    players: Player[];
    currentPlayerId: string | null;
    socket: Socket | null;
    partyLeaderId: string | null;
}

const PlayerList = ({ players, currentPlayerId, socket, partyLeaderId }: PlayerListProps) => {
    return (
        <div>
            <h2 className="font-semibold">Players:</h2>
            <ul>
                {players.map((player) => (
                    <li
                        key={player.id}
                        className={`p-2 rounded mb-2 ${
                            currentPlayerId === player.id
                                ? "bg-blue-100 text-blue-600 font-bold"
                                : "bg-[var(--card-background)] text-[var(--foreground)]"
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <span>
                                {player.name}{" "}
                                {player.id === socket?.id && "(you)"}
                            </span>
                            {player.id === partyLeaderId && (
                                <span className="ml-2 text-xs text-yellow-500">
                                    (Leader)
                                </span>
                            )}
                            {currentPlayerId === player.id && (
                                <span className="text-xs text-blue-500">
                                    (Current turn)
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-[var(--foreground)] mt-1">
                            <div>Bid: {player.bid ?? "N/A"}</div>
                            <div>Tricks Won: {player.tricksWon ?? 0}</div>
                            <div>Total Score: {player.totalScore ?? 0}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
