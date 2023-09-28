import { GameDto } from "./game-data.dto";

export class GameRoomDto {
	id: number;
	roomName: string;
	playerOneId: number;
	playerTwoId: number;
	readyPlayerOne: boolean;
	readyPlayerTwo: boolean;
	reconnect: boolean;
	playerOneDisconnected: boolean;
	playerTwoDisconnected: boolean;
	data: GameDto;
}