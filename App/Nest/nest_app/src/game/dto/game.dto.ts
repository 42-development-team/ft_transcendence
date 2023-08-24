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
	name: string;
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
	player1: PlayerDto;
	player2: PlayerDto;
	ball: BallDto;
}