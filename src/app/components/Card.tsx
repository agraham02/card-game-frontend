// app/components/Card.tsx

import React from "react";
import { Card as CardType, Suit } from "../types";

interface CardProps extends CardType {
    onClick?: () => void;
}

const suitSymbols: { [key in Suit]: string } = {
    Spades: "♠",
    Hearts: "♥",
    Diamonds: "♦",
    Clubs: "♣",
};

const Card: React.FC<CardProps> = ({ suit, value, onClick }) => {
    const isRed = suit === "Hearts" || suit === "Diamonds";

    return (
        <div
            className={`w-16 h-24 bg-white rounded shadow-md flex flex-col justify-between p-1 cursor-pointer ${
                isRed ? "text-red-600" : "text-black"
            }`}
            onClick={onClick}
        >
            <div className="">
                {value}
                {suitSymbols[suit]}
            </div>
            <div className="text-center text-2xl">{suitSymbols[suit]}</div>
            <div className="transform rotate-180">
                {value}
                {suitSymbols[suit]}
            </div>
        </div>
    );
};

export default Card;
