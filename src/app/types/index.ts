// app/types/index.ts

export type Suit = "Spades" | "Hearts" | "Diamonds" | "Clubs";
export type Value =
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K"
    | "A";

export interface Card {
    suit: Suit;
    value: Value;
}

export interface Player {
    id: string;
    name: string;
}
