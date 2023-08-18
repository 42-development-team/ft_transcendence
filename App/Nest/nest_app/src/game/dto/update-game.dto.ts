import { User } from "@prisma/client";

export class UpdateGameDto {
    gameId: number;
    winnerScore: number;
    loserScore: number;
    winnerId: number;
    loserId: number;
}