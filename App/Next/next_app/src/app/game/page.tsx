
import Canvas from '../components/game/canvas';

const Game = ({...props}) => {
	
	const {move, stopMove, launchGame, data, userId} = props;

	return (
		<Canvas move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId}/>
	);
}
	
export default Game;