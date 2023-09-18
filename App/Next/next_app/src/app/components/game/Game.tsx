"use client";
import React, { useEffect } from "react";
import Canvas from './canvas';
import Result from './result';

const Game = ({ ...props }) => {
	useEffect(() => {
		if (!data)
			socket?.emit("retrieveData", props.userId);
	}, []);

	const { socket, move, stopMove, launchGame, leaveQueue, joinQueue, data, userId, result, setResult, setInGameContext } = props;

	return (
		<div>
			{ data && (
				(result === undefined || result === null) ? (
				<Canvas
					move={move}
					stopMove={stopMove}
					launchGame={launchGame}
					data={data}
					userId={userId}
				/>
			) : (
				<Result
					result={result}
					setResult={setResult}
					leaveQueue={leaveQueue}
					joinQueue={joinQueue}
					setInGameContext={setInGameContext}
				/>
			))
			}
		</div>
	);
}

export default Game;