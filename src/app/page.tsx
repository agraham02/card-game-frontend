"use client";
// TODO: add loading screen to check the health of the server

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./context/SocketContext";

const HomePage = () => {
    const [playerName, setPlayerName] = useState("");
    const [roomId, setRoomId] = useState("");
    const router = useRouter();
    const { disconnect } = useSocket();

    const handleJoinRoomSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (playerName.trim()) {
            let randomName = "";
            if (!roomId.trim()) {
                randomName = Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase();
            }

            router.push(
                `/lobby?playerName=${encodeURIComponent(
                    playerName
                )}&roomId=${encodeURIComponent(
                    roomId.trim() || randomName
                )}`
            );
        }
    };

    // const handleCreateRoomSubmit = () => {
    //     if (playerName.trim()) {
    //         router.push(
    //             `/lobby?playerName=${encodeURIComponent(
    //                 playerName
    //             )}&roomId=${encodeURIComponent(roomId)}`
    //         );
    //     }
    // };

    useEffect(() => {
        disconnect();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen ">
            <div className="bg-[var(--card-background)] p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Welcome to My Game
                </h1>
                <form onSubmit={handleJoinRoomSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="playerName"
                            className="block text-sm font-medium"
                        >
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="playerName"
                            name="playerName"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-[var(--background)] text-[var(--foreground)]"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="roomId"
                            className="block text-sm font-medium"
                        >
                            Room ID
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-[var(--background)] text-[var(--foreground)]"
                            placeholder="Enter Room ID to Join"
                        />
                    </div>
                    <div className="space-y-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            onClick={handleJoinRoomSubmit}
                        >
                            Join Game
                        </button>
                        {/* <div className="flex items-center my-4">
                            <hr className="flex-grow border-t border-gray-300" />
                            <span className="px-2 ">or</span>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>
                        <button
                            type="button"
                            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                            onClick={handleCreateRoomSubmit}
                        >
                            Create Room
                        </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
