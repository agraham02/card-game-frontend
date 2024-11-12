// app/components/CardHand.tsx

import React from "react";
import Card from "./Card";
import { Card as CardType } from "../types/Card";

interface CardHandProps {
    cards: CardType[]; // Array of cards to display
    onCardClick?: (card: CardType) => void; // Optional click handler for each card
}

const CardHand: React.FC<CardHandProps> = ({ cards, onCardClick }) => {
    return (
        <div className="flex justify-center mt-4">
            {cards.map((card, index) => (
                <div
                    key={`${card.suit}-${card.value}`}
                    className={`-ml-4 ${index === 0 ? "ml-0" : ""}`}
                    style={{ zIndex: index }} // Apply z-index based on card index
                >
                    <Card
                        suit={card.suit}
                        value={card.value}
                        handleOnClick={() => onCardClick?.(card)}
                    />
                </div>
            ))}
        </div>
    );
};

export default CardHand;
