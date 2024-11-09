"use client"; // Use this if it's in Next.js

import { useState } from "react";

interface AlertModalProps {
    message: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
    message,
    description,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null; // Don't render if it's closed

    return (
        <div className="flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800">
                <svg
                    className="flex-shrink-0 inline w-4 h-4 mr-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <div>
                    <span className="font-medium">{message}</span> {description}
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AlertModal;
