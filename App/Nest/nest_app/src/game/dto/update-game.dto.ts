import { User } from "@prisma/client";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateGameDto {

    @IsNumber()
    gameId: number;

    @IsNotEmpty()
    @IsNumber()
    winnerScore: number;

    @IsNotEmpty()
    @IsNumber()
    loserScore: number;

    @IsNotEmpty()
    winner: User;

    @IsNotEmpty()
    @IsNumber()    
    winnerId: number;
    
    @IsNotEmpty()
    @IsNumber()
    loserId: number;

    @IsNotEmpty()
    loser: User;
}
