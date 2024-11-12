"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "../context/SocketContext";
import PartyLeaderControls from "./PartyLeaderControls";
import { useError } from "../context/ErrorContext";
import { Player } from "../types/player";
import { RoomState } from "../types/lobby";

const LobbyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const playerName = searchParams.get("playerName") ?? "";
    const roomId = searchParams.get("roomId") ?? "";
    const [roomState, setRoomState] = useState<RoomState>({
        id: "",
        players: [],
        partyLeaderId: "",
        gameRules: {},
        turnOrder: [],
        status: "",
        gameType: "",
    });
    const [playerId, setPlayerId] = useState<string | undefined>("");

    const { connect, socket } = useSocket();
    const { setError } = useError();

    useEffect(() => {
        if (!socket) {
            connect("", { playerName, roomId });
        }

        if (!socket) {
            console.log("Socket not initialized");
            return;
        }

        // Handle socket connection
        socket.on("connect", () => {
            console.log("Connected with socket ID:", socket.id);
            setPlayerId(socket.id);
            socket.emit("JOIN_ROOM", { roomId, playerName });
        });

        socket.on("ROOM_CREATED", ({ roomId }) => {
            console.log("Room created:", roomId);
        });

        socket.on("ROOM_STATE_UPDATED", ({ roomState }) => {
            console.log("Room state updated:");
            console.log(roomState);
            setRoomState(roomState);
        });

        socket.on("GAME_STARTED", ({ roomId, gameType }) => {
            console.log("Game started!", gameType);

            // Map game types to routes and navigate
            let gameRoute;
            switch (gameType) {
                case "spades":
                    gameRoute = "/spades";
                    break;
                case "dominoes":
                    gameRoute = "/dominoes";
                    break;
                // Add more cases for additional games
                default:
                    console.error("Unknown game type:", gameType);
                    return;
            }

            // Navigate to the appropriate game page with room and player info
            router.push(
                `${gameRoute}?roomId=${roomId}&playerName=${playerName}`
            );
        });

        socket.on("ERROR", (error) => {
            setError(error);
        });

        socket.on("GAME_TYPE_SET", ({ gameType, gameRules }) => {
            console.log("Game type set:", gameType);
            setRoomState((prevState: RoomState) => ({
                ...prevState,
                gameType,
                gameRules,
            }));
        });

        // **Handle PARTY_LEADER_CHANGED event**
        socket.on("PARTY_LEADER_CHANGED", ({ newLeaderId }) => {
            console.log("Party leader changed:", newLeaderId);
            setRoomState((prevState: RoomState) => ({
                ...prevState,
                partyLeaderId: newLeaderId,
            }));
        });

        // **Handle PLAYER_KICKED event**
        socket.on("PLAYER_KICKED", ({ playerId: kickedPlayerId }) => {
            console.log("Player kicked:", kickedPlayerId);
            if (kickedPlayerId === socket.id) {
                // If the current player was kicked, redirect them
                alert("You have been kicked from the room.");
                router.push("/"); // Redirect to home or another page
            } else {
                // Remove the kicked player from the roomState
                setRoomState((prevState: RoomState) => ({
                    ...prevState,
                    players: prevState.players.filter(
                        (player: Player) => player.id !== kickedPlayerId
                    ),
                }));
            }
        });

        // Cleanup event listeners on unmount
        return () => {
            socket.off("connect");
            socket.off("ROOM_CREATED");
            socket.off("JOIN_SUCCESS");
            socket.off("ROOM_STATE_UPDATED");
            socket.off("GAME_STARTED");
            socket.off("ERROR");
            socket.off("GAME_TYPE_SET");
            socket.off("PARTY_LEADER_CHANGED");
            socket.off("PLAYER_KICKED");
        };
    }, [socket]);

    const isPartyLeader = socket?.id === roomState?.partyLeaderId;

    // Render lobby with roomState
    return (
        <div>
            <h1>Lobby - Room: {roomId}</h1>
            {/* Display players */}
            <h2 className="text-lg font-semibold">Players:</h2>
            <ul>
                {roomState?.players.map((player: Player) => (
                    <li key={player.id}>
                        {player.name} {player.id === socket?.id && "(you)"}
                        {player.id === roomState?.partyLeaderId && (
                            <span className="ml-2 text-xs text-yellow-500">
                                (Leader)
                            </span>
                        )}
                    </li>
                ))}
            </ul>
            {/* Display game settings */}
            <h2>Game: {roomState?.gameType || "Not selected"}</h2>

            {/* Display the player order to all players */}
            {!isPartyLeader && (
                <div className="mt-4">
                    <h3 className="font-semibold">Order of Play:</h3>
                    <ul>
                        {roomState?.turnOrder.map(
                            (playerId: string, index: number) => {
                                const player = roomState?.players.find(
                                    (p: Player) => p.id === playerId
                                );
                                return (
                                    <li key={playerId} className="my-2">
                                        <span>
                                            {index + 1}. {player?.name}
                                            {player?.id === socket?.id &&
                                                " (you)"}
                                        </span>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
            )}

            {/* Party leader controls */}
            {isPartyLeader && socket && playerId && (
                <PartyLeaderControls
                    socket={socket}
                    roomId={roomId}
                    playerId={playerId}
                    roomState={roomState}
                />
            )}
        </div>
    );
};

export default LobbyPage;
