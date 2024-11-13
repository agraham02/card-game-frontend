"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./context/SocketContext";

const HomePage = () => {
    const [playerName, setPlayerName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [isServerHealthy, setIsServerHealthy] = useState<boolean | null>(
        null
    );
    const router = useRouter();
    const { disconnect } = useSocket();

    const handleJoinRoomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (playerName.trim() && isServerHealthy) {
            const roomIdentifier =
                roomId.trim() ||
                Math.random().toString(36).substring(2, 8).toUpperCase();
            router.push(
                `/lobby?playerName=${encodeURIComponent(
                    playerName
                )}&roomId=${encodeURIComponent(roomIdentifier)}`
            );
        }
    };

    useEffect(() => {
        disconnect();

        // Perform server health check
        const checkServerHealth = async () => {
            try {
                const apiUrl = process.env.BACKEND_API_URL ?? "";
                console.log(apiUrl);
                const response = await fetch(apiUrl); // Replace with your server URL
                if (response.ok) {
                    setIsServerHealthy(true);
                } else {
                    setIsServerHealthy(false);
                }
            } catch (error) {
                setIsServerHealthy(false);
            }
        };

        checkServerHealth();
    }, []);

    if (isServerHealthy === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                Checking server status...
            </div>
        );
    }

    if (isServerHealthy === false) {
        return (
            <div className="flex items-center justify-center h-screen text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-4">
                        Server Unreachable
                    </h1>
                    <p>Please check your connection or try again later.</p>
                </div>
            </div>
        );
    }

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
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Join Game
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
