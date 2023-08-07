import Canvas from '../components/game/canvas';
import PlayerInterface from './interfaces/playerInterface';
import BallInterface from './interfaces/ballInterface';
// import * as style from './styles.css';
// declare module './styles.css';


const Game = () => {
// envoyer params
	let p1: PlayerInterface;
	let p2: PlayerInterface;
	let ball: BallInterface;

	p1 = {
		color: 'lavender',
		position: [0.1, 0.5],
		rect: [0.01, 0.08],
	}

	p2 = {
		color: 'blue',
		position: [0.9, 0.5],
		rect: [0.01, 0.08],
	}

	ball = {
		color: 'red',
		position: [0.5, 0.5],
		r: 10, // const
		pi2: Math.PI * 2, // const
		direction: [0, 0],
		speed: [0, 0],
	}

	return (
		// <div className='items-center'>
			<Canvas player1={p1} player2={p2} ball={ball} />
		// </div>
	);
}

export default Game;