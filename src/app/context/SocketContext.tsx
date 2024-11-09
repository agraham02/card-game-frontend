"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "../utils/socketUtils";
import { useRouter } from "next/navigation";

// Create the context
interface SocketContextType {
    socket: Socket | null;
    connect: (
        namespace: string,
        options: { playerName: string; roomId: string }
    ) => void;
    disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Socket provider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const router = useRouter();

    const connect = (
        namespace: string,
        options: { playerName: string; roomId: string }
    ) => {
        const gameSocket = connectSocket(namespace, options);
        setSocket(gameSocket);

        gameSocket.on("return_to_lobby", () => {
            // Navigate back to the lobby when the "return_to_lobby" event is triggered
            router.push(
                `/lobby?playerName=${encodeURIComponent(
                    options.playerName
                )}&roomId=${encodeURIComponent(options.roomId)}`
            );
        });

        gameSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected due to:", reason);
            if (reason === "io server disconnect") {
                // The disconnection was initiated by the server, need to manually reconnect
                // Optionally, you can force the client to disconnect
                disconnect();
            } else {
                // Disconnected due to other reasons (e.g., network issues), Socket.IO will attempt to reconnect
                // Optionally, show a message to the user about reconnection attempts
            }
            router.push("/"); // Redirect to the start screen
        });

        gameSocket.on("reconnect", (attemptNumber) => {
            console.log("Socket reconnected on attempt:", attemptNumber);
            // Redirect the user to the lobby page upon reconnection
            router.push(
                `/lobby?playerName=${encodeURIComponent(
                    options.playerName
                )}&roomId=${encodeURIComponent(options.roomId)}`
            );
        });
        gameSocket.on("connect_error", (error) => {
            console.log("Connection error:", error);
            // Handle connection errors if needed
        });
    };

    const disconnect = () => {
        if (socket) {
            disconnectSocket();
            setSocket(null);
        }
    };

    useEffect(() => {
        return () => {
            // Disconnect on component unmount
            disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, connect, disconnect }}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use the socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
