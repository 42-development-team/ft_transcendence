
// ========================== //
//		BALL INTERFACE
// ========================== //
// import BallInterface from './interfaces/ballInterface';
// let ball: BallInterface;

// ball = {
	// 	color: 'red',
	// 	position: [0.5, 0.5],
	// 	r: 10, // const
	// 	pi2: Math.PI * 2, // const
// 	speed: [0.002, 0.005],
// }

// ========================== //
//		Player INTERFACE
// ========================== //
// import PlayerInterface from './interfaces/playerInterface';

// let p1: PlayerInterface;
// let p2: PlayerInterface;

// p1 = {
// 	color: 'lavender',
// 	position: [0.1, 0.5],
// 	rect: [0.01, 0.08],
// }

// p2 = {
// 	color: 'blue',
// 	position: [0.9, 0.5],
// 	rect: [0.01, 0.08],
// }

// ========================== //
//		Player CLASS
// ========================== //
// class Player1 {
// 	color: string = 'blue';
// 	position: [number, number] = [0.1, 0.5];
// 	rect: [number, number] = [0.01, 0.08];
// }

// class Player2 {
// 	color: string = 'blue';
// 	position: [number, number] = [0.9, 0.5];
// 	rect: [number, number] = [0.01, 0.08];
// }

import Canvas from '../components/game/canvas';
import Ball from './class/ball.class';

const Game = () => {

	// let ball: Ball = new Ball(0.02, 0.04);

	return (
		<Canvas />
		// <Canvas ball={ball}/>
	);
}
	// <div className='items-center'>
	// </div>
	
export default Game;