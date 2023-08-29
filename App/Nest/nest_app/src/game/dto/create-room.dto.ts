import { GameDto } from "./game-data.dto";

export class GameRoomDto {
	gameId: number;
	roomName: string;
	playerOneId: number;
	playerTwoId: number;
	data?: GameDto;
}