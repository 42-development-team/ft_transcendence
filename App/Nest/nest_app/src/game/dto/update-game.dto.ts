import { User } from "@prisma/client";

export class UpdateGameDto {
    // gameId: number;
    winnerScore: number;
    loserScore: number;
    winner: User;
    winnerId: number;
    loserId: number;
    loser: User;
}