import { User } from "@prisma/client";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateGameDto {

    @IsNotEmpty()
    @IsNumber()
    winnerScore: number;

    @IsNotEmpty()
    @IsNumber()
    loserScore: number;

    @IsNotEmpty()
    @IsNumber()    
    winnerId: number;
    
    @IsNotEmpty()
    @IsNumber()
    loserId: number;

}