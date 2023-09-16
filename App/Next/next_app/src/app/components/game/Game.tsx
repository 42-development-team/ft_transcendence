import Canvas from './canvas';
import Result from './result';

const Game = ({...props}) => {
	
	const {move, stopMove, launchGame, leaveQueue, joinQueue, data, userId, result} = props;

	return (
		result === undefined ?
		<Canvas move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId}/>
		:
		<Result result={result} leaveQueue={leaveQueue} joinQueue={joinQueue}/>
	);
}
	
export default Game;