import { Player } from "./player";

export interface RoomState {
    id: string;
    players: Player[];
    partyLeaderId: string;
    gameRules: object;
    turnOrder: string[];
    status: string;
    gameType: string;
}
