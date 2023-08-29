
import Canvas from '../components/game/canvas';

const Game = ({...props}) => {
	
	const { id } = props;
	console.log('id:', id);

	return (
		<Canvas />
	);
}
	
export default Game;