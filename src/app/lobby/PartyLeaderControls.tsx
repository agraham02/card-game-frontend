import React, { ChangeEvent, MouseEvent } from "react";
import { Socket } from "socket.io-client";

interface PartyLeaderControlsProps {
    socket: Socket;
    roomId: string;
    playerId: string;
    roomState: any;
}

const PartyLeaderControls: React.FC<PartyLeaderControlsProps> = ({
    socket,
    roomId,
    playerId,
    roomState,
}) => {
    const handleGameTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const gameType = event.target.value;
        if (socket && gameType) {
            socket.emit("SET_GAME_TYPE", {
                roomId,
                playerId,
                gameType,
                gameRules: {},
            });
        }
    };

    const handleStartGame = (event: MouseEvent<HTMLButtonElement>) => {
        if (socket) {
            socket.emit("START_GAME", { roomId, playerId, gameType: "spades" });
        }
    };

    const emitTurnOrderChange = (turnOrder: string[]) => {
        if (socket) {
            socket.emit("SET_TURN_ORDER", {
                roomId,
                playerId,
                turnOrder,
            });
        }
    };

    return (
        <div>
            <h3>Party Leader Controls</h3>

            {/* Game Selection */}
            <div>
                <label htmlFor="gameType">Select Game:</label>
                <select
                    id="gameType"
                    onChange={handleGameTypeChange}
                    value={roomState?.gameType || ""}
                >
                    <option value="">Select Game</option>
                    <option value="spades">Spades</option>
                    <option value="dominoes">Dominoes</option>
                    {/* Add more games as needed */}
                </select>
            </div>

            {/* Turn Order Controls */}
            <div className="mt-4">
                <h3 className="font-semibold">Order of Play:</h3>
                <ul>
                    {roomState?.turnOrder.map((playerId, index) => {
                        const player = roomState?.players.find(
                            (p: any) => p.id === playerId
                        );
                        return (
                            <li
                                key={playerId}
                                className="flex items-center my-2"
                            >
                                <span className="mr-2">
                                    {index + 1}. {player?.name}
                                    {player?.id === socket?.id && " (you)"}
                                </span>
                                <>
                                    <button
                                        disabled={index === 0}
                                        onClick={() => {
                                            const newOrder = [
                                                ...roomState.turnOrder,
                                            ];
                                            // Swap the current player with the one above
                                            [
                                                newOrder[index - 1],
                                                newOrder[index],
                                            ] = [
                                                newOrder[index],
                                                newOrder[index - 1],
                                            ];
                                            emitTurnOrderChange(newOrder);
                                        }}
                                        className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        disabled={
                                            index ===
                                            roomState.turnOrder.length - 1
                                        }
                                        onClick={() => {
                                            const newOrder = [
                                                ...roomState.turnOrder,
                                            ];
                                            // Swap the current player with the one below
                                            [
                                                newOrder[index],
                                                newOrder[index + 1],
                                            ] = [
                                                newOrder[index + 1],
                                                newOrder[index],
                                            ];
                                            emitTurnOrderChange(newOrder);
                                        }}
                                        className="ml-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                    >
                                        ▼
                                    </button>
                                </>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Start Game Button */}
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
};

export default PartyLeaderControls;
