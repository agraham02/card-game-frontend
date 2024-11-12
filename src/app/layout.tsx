// app/layout.tsx
import { AppProviders } from "./context/AppProviders";
import "./styles/globals.css";

export const metadata = {
    title: "Spades Game",
    description: "Play Spades with friends",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
