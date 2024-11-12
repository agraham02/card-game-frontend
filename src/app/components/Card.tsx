import React from "react";
import { Card as CardType, Suit } from "../types/Card";

interface CardProps extends CardType {
    suit: CardType["suit"];
    value: CardType["value"];
    handleOnClick?: () => void;
}

const suitSymbols: { [key in Suit]: string } = {
    Spades: "♠",
    Hearts: "♥",
    Diamonds: "♦",
    Clubs: "♣",
};

const Card: React.FC<CardProps> = ({ suit, value, handleOnClick }) => {
    const isRed = suit === "Hearts" || suit === "Diamonds";

    return (
        <button
            className={`w-16 h-24 bg-white rounded shadow-md border border-gray-300 flex flex-col justify-between p-2 cursor-pointer transform transition-transform duration-200 ease-in-out ${
                isRed ? "text-red-600" : "text-black"
            } ${handleOnClick ? "hover:-translate-y-3" : ""}`}
            {...(handleOnClick ? { onClick: handleOnClick } : {})}
        >
            <div className="text-sm">
                {value}
                {suitSymbols[suit]}
            </div>
            <div className="text-center self-center text-2xl">
                {suitSymbols[suit]}
            </div>
            <div className="text-sm transform rotate-180 self-end">
                {value}
                {suitSymbols[suit]}
            </div>
        </button>
    );
};

export default Card;
