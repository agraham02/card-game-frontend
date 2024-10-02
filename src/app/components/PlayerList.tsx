import { Socket } from "socket.io-client";
import { Player } from "../types"; // Assuming Player includes 'bid' and 'tricksWon'

interface PlayerListProps {
    players: Player[];
    currentPlayerId: string | null;
    socket: Socket | null;
}

const PlayerList = ({ players, currentPlayerId, socket }: PlayerListProps) => {
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
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <span>
                                {player.name}{" "}
                                {player.id === socket?.id && "(you)"}
                            </span>
                            {currentPlayerId === player.id && (
                                <span className="text-xs text-blue-500">
                                    (Current turn)
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            <div>Bid: {player.bid ?? "N/A"}</div>
                            <div>Tricks Won: {player.tricksWon ?? 0}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
