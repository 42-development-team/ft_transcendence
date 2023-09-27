import { defaultIfEmpty } from "rxjs";

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
	velocitx: number;
	angle: number;
};

export class GameDto {
	id: number;
	forfeiterId: null | number;
	roomName: string;
	end: boolean;
	mode: boolean;
	player1: PlayerDto;
	player2: PlayerDto;
	ball: BallDto;
}