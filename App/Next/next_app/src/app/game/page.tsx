
import Canvas from '../components/game/canvas';

const Game = ({...props}) => {
	
	const {move, stopMove, data} = props;

	return (
		<Canvas move={move} stopMove={stopMove} data={data}/>
	);
}
	
export default Game;