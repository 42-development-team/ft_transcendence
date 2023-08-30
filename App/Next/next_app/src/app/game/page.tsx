
import Canvas from '../components/game/canvas';

const Game = ({...props}) => {
	
	const {move, stopMove, launchGame, data} = props;

	return (
		<Canvas move={move} stopMove={stopMove} launchGame={launchGame} data={data}/>
	);
}
	
export default Game;