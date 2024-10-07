// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
    const [playerName, setPlayerName] = useState("");
    const [roomId, setRoomId] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (playerName.trim() && roomId.trim()) {
            router.push(
                `/lobby?playerName=${encodeURIComponent(
                    playerName
                )}&roomId=${encodeURIComponent(roomId)}`
            );
        }
    };

    return (
        <div className="flex items-center justify-center h-screen ">
            <div className="bg-[var(--card-background)] p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Welcome to Spades Game
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-[var(--background)] text-[var(--foreground)]"
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
