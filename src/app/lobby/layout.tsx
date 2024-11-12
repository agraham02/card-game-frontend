// app/layout.tsx
import React, { Suspense } from "react";

export const metadata = {
    title: "Lobby - Spades Game",
    description: "Join a lobby to play Spades with friends",
};

export default function LobbyLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
