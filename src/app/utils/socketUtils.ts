// app/utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;


export const connectSocket = (
    query: { [key: string]: string },
    namespace: string = "/"
) => {
    if (!socket) {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        console.log("Connecting socket..." + apiUrl);
        socket = io(`${apiUrl}${namespace}`, { query });
        console.log(socket);
    } else {
        console.log("Socket already connected");
        console.log(socket);
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error("Socket not connected");
    }
    return socket;
};

export const disconnectSocket = () => {
    console.log("Disconnecting socket...");
    if (socket && socket.connected) {
        const socketID = socket.id;
        socket.disconnect();
        console.log("Disconnected from server with ID:", socketID);
    }
    socket = null;
};
