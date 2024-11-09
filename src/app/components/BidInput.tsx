import React, { useState } from "react";

interface BidInputProps {
    min: number;
    max: number;
    initialValue?: number;
    onChange: (value: number) => void;
}

const BidInput: React.FC<BidInputProps> = ({
    min,
    max,
    initialValue = min,
    onChange,
}) => {
    const [value, setValue] = useState<number>(initialValue);

    const increaseValue = () => {
        if (value < max) {
            const newValue = value + 1;
            setValue(newValue);
            onChange(newValue);
        }
    };

    const decreaseValue = () => {
        if (value > min) {
            const newValue = value - 1;
            setValue(newValue);
            onChange(newValue);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            {/* Decrease button */}
            <button
                onClick={decreaseValue}
                className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                -
            </button>

            {/* Display the bid value */}
            <div className="w-12 text-center border border-gray-300 bg-white dark:bg-gray-800 dark:text-white rounded px-2 py-1">
                {value}
            </div>

            {/* Increase button */}
            <button
                onClick={increaseValue}
                className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                +
            </button>
        </div>
    );
};

export default BidInput;
