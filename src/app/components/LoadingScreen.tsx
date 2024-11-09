// app/components/LoadingScreen.tsx

import React from "react";

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = "Loading...",
}) => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="loader mb-4"></div>{" "}
                {/* You can use a spinner here */}
                <p className="text-lg">{message}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
