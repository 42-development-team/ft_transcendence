export class BallDto {
	color: string;
	x: number;
	y: number;
	r: number;
	pi2: number;
	incr: number;
	speed: [number, number];
}

export class PlayerDto {
	id: number;
	color: string;
	x: number;
	y: number;
	w: number;
	h: number;
    points: number;
	velocity: number;
	angle: number;
};

export class GameDto {
	id: number;
	roomName: string;
	end: boolean;
	forfeitId?: number;
	player1: PlayerDto;
	player2: PlayerDto;
	ball: BallDto;
}