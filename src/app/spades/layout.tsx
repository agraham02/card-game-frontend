// app/layout.tsx
import React, { Suspense } from "react";

export const metadata = {
    title: "Spades Game",
    description: "Play Spades with friends",
};

export default function SpadesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
