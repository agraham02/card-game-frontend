// app/context/AppProviders.tsx

import { ReactNode } from "react";
import { SocketProvider } from "./SocketContext";
import { ErrorProvider } from "./ErrorContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <SocketProvider>
            <ErrorProvider>{children}</ErrorProvider>
        </SocketProvider>
    );
};
