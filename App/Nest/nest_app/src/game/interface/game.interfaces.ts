export interface PlayerInterface {
	name: string,
	color: string,
	x: number,
	y: number,
	w: number,
	h: number,
    points: number,
}

export interface BallInterface {
	color: string,
	x: number,
	y: number,
	r: number,
	pi2: number,
	speed: [number, number],
}

export interface GameInterface {
	player1: PlayerInterface,
	player2: PlayerInterface,
	ball: BallInterface,
}

export interface SegInterface {
	x: number,
	y: number,
	x1: number,
	y1: number,
}
