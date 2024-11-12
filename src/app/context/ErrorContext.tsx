// context/ErrorContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
} from "react";
import ErrorModal from "../components/ErrorModal";

interface ErrorContextType {
    setError: (message: ErrorMessage) => void;
    clearError: () => void;
}

interface ErrorMessage {
    title: string;
    description: string;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error("useError must be used within an ErrorProvider");
    }
    return context;
};

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

    const setError = (message: ErrorMessage) => {
        setErrorMessage(message);
    };

    const clearError = () => {
        setErrorMessage(null);
    };

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({ setError, clearError }),
        [setError, clearError]
    );

    return (
        <ErrorContext.Provider value={contextValue}>
            {children}
            {errorMessage && (
                <div>
                    <ErrorModal
                        message={errorMessage.title}
                        description={errorMessage.description}
                        onClose={clearError}
                    />
                </div>
            )}
        </ErrorContext.Provider>
    );
};
