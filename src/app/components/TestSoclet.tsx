import { useEffect } from "react";
import { io } from "socket.io-client";

const TestSocket = () => {
    useEffect(() => {
        const socket = io("http://localhost:4000");

        socket.on("connect", () => {
            console.log("Connected to server with ID:", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });
    }, []);

    return <div>Testing Socket.IO</div>;
};

export default TestSocket;
