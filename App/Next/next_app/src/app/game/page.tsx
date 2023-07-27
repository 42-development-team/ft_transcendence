import Canvas from '../components/game/canvas';
import PlayerInterface from './interfaces/playerInterface';
import BallInterface from './interfaces/ballInterface';

// window width const
// window heigth const

const Game = () => {
// envoyer params
	let p1: PlayerInterface;
	let p2: PlayerInterface;
	let ball: BallInterface;
	
	p1 = {
		color: 'blue',
		position: [10, 10],
		rect: [15, 30],
	}

	p2 = {
		color: 'blue',
		position: [190, 10],
		rect: [15, 30],
	}

	ball = {
		color: 'red',
		position: [100, 100],
		r: 10, // const
		pi2: Math.PI * 2, // const
		direction: [0, 0],
		speed: [0, 0],
	}

	return <Canvas width={400} height={400} />;
}

export default Game;