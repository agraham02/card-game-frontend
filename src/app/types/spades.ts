import { Card } from "./Card";
import { Player } from "./player";

export interface SpadesStaticGameState {
    // turnOrder: string[];
    players: Player[];
    teams: { [teamId: string]: string[] };
}

export interface SpadesGameState {
    currentTurnPlayerId: string;
    phase: string;
    bids: Record<string, number>;
    scores: Record<string, number>;
    currentTurnIndex: number | null;
    tricksWon: Record<string, number>;
    currentTrick: { playerId: string; card: Card }[];
    hand: Card[];
}
