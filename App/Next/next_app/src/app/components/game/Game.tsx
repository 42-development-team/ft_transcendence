
import Canvas from './canvas';
import Result from './result';

const Game = ({...props}) => {
	
	const {move, stopMove, launchGame, data, userId, result} = props;

	return (
		result === undefined ?
		<Canvas move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId}/>
		:
		<Result result={result}/>
	);
}
	
export default Game;