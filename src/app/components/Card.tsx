// app/components/Card.tsx

import React from "react";
import { Card as CardType, Suit } from "../types/Card";

interface CardProps extends CardType {
    suit: CardType["suit"];
    value: CardType["value"];
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
        <button
            className={`w-16 h-24 bg-white rounded shadow-md border border-gray-300 flex flex-col justify-between p-2 cursor-pointer transform transition-transform duration-200 ease-in-out hover:-translate-y-3 ${
                isRed ? "text-red-600" : "text-black"
            }`}
            onClick={onClick}
        >
            <div className="text-sm">
                {value}
                {suitSymbols[suit]}
            </div>
            <div className="text-center text-2xl">{suitSymbols[suit]}</div>
            <div className="text-sm transform rotate-180">
                {value}
                {suitSymbols[suit]}
            </div>
        </button>
    );
};

export default Card;
