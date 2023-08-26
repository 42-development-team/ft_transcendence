import { GameUserDto } from "./game-user.dto";

export class GetGameDto {
    id: number;
    createdAt: Date;
    gameDuration: number;
    winnerScore: number;
    loserScore: number;
    winner: GameUserDto;
    loser: GameUserDto;
}