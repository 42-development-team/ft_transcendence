import Canvas from './canvas';
import Result from './result';

const Game = ({...props}) => {
	
	const {socket, move, stopMove, launchGame, leaveQueue, joinQueue, data, userId, result, setResult, setInGame} = props;

	return (
		result === undefined ?
		<Canvas move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId}/>
		:
		<Result socket={socket} result={result} setResult={setResult} setInGame={setInGame} leaveQueue={leaveQueue} joinQueue={joinQueue}/>
	);
}
	
export default Game;