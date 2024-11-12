import React, { ChangeEvent, MouseEvent } from "react";
import { Socket } from "socket.io-client";
import DropdownInput from "../components/DropdownInput";

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
            socket.emit("START_GAME", {
                roomId,
                playerId,
                gameType: roomState?.gameType,
            });
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

    const handleKickPlayer = (targetPlayerId: string) => {
        if (socket) {
            socket.emit("KICK_PLAYER", {
                roomId,
                playerId,
                targetPlayerId,
            });
        }
    };

    const handlePromoteLeader = (newLeaderId: string) => {
        if (socket) {
            socket.emit("PROMOTE_LEADER", {
                roomId,
                playerId,
                newLeaderId,
            });
        }
    };

    return (
        <div>
            <h3>Party Leader Controls</h3>

            {/* Game Selection */}
            <DropdownInput id={"gameType"} handleOnChange={handleGameTypeChange} value={roomState?.gameType || ""}/>

            {/* Turn Order Controls */}
            <div className="mt-4">
                <h3 className="font-semibold">Order of Play:</h3>
                <ul>
                    {roomState?.turnOrder.map((playerId: string, index: number) => {
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

            {/* Player Management */}
            <div className="mt-4">
                <h3 className="font-semibold">Manage Players:</h3>
                <ul>
                    {roomState?.players.map((player: any) => (
                        <li key={player.id} className="flex items-center my-2">
                            <span className="mr-2">
                                {player.name}
                                {player.id === socket?.id && " (you)"}
                                {player.id === roomState?.partyLeaderId && (
                                    <span className="ml-2 text-xs text-yellow-500">
                                        (Leader)
                                    </span>
                                )}
                            </span>
                            {player.id !== playerId && (
                                <>
                                    <button
                                        onClick={() =>
                                            handlePromoteLeader(player.id)
                                        }
                                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                                    >
                                        Promote to Leader
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleKickPlayer(player.id)
                                        }
                                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Kick
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Start Game Button */}
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
};

export default PartyLeaderControls;
