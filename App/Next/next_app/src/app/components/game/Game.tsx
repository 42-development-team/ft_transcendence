"use client";

import { useEffect } from 'react';
import Canvas from './canvas';
import Result from './result';

const Game = ({...props}) => {
	
	const {move, stopMove, launchGame, setUid, data, userId, result} = props;

	return (
		result === undefined ?
		<Canvas move={move} stopMove={stopMove} launchGame={launchGame}  setUid={setUid} data={data} userId={userId}/>
		:
		<Result result={result}/>
	);
}
	
export default Game;