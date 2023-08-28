export class JoinGameRoomDto {
	gameId: number;
	roomName: string;
	playerOneId?: number;
	playerTwoId?: number;
}