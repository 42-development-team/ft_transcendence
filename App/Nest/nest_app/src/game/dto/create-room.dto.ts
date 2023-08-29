import { GameDto } from "./game-data.dto";

export class GameRoomDto {
	id: number;
	roomName: string;
	playerOneId: number;
	playerTwoId: number;
	data?: GameDto;
}