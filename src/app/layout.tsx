// app/layout.tsx
import { SocketProvider } from "./context/SocketContext";
import "./styles/globals.css";

export const metadata = {
    title: "Spades Game",
    description: "Play Spades with friends",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SocketProvider>{children}</SocketProvider>
            </body>
        </html>
    );
}
