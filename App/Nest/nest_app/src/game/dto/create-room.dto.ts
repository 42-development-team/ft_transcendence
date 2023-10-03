import { GameDto } from "./game-data.dto";

export class GameRoomDto {
	id: number;
	roomName: string;
	playerOneId: number;
	playerTwoId: number;
	readyPlayerOne: boolean;
	readyPlayerTwo: boolean;
	playerOneDisconnected: boolean;
	playerTwoDisconnected: boolean;
	reconnect: boolean;
	data: GameDto;
}