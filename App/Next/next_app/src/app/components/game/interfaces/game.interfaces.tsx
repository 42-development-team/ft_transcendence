export interface PlayerInterface {
	id: number,
	name: string,
	color: string,
	x: number,
	y: number,
	w: number,
	h: number,
    points: number,
	velocity: number,
	angle: number,
}

export interface BallInterface {
	color: string,
	x: number,
	y: number,
	r: number,
	pi2: number,
	speed: [number, number],
	incr: number,
}

export interface GameInterface {
	id: number,
	roomName: string,
	end: boolean,
	player1: PlayerInterface,
	player2: PlayerInterface,
	ball: BallInterface,
}
