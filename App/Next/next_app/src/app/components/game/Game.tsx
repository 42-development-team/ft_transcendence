"use client";
import React, { useEffect } from "react";
import Canvas from './Canvas';
import Result from './Result';
import Surrender from "./Surrender";

const Game = ({ ...props }) => {
	useEffect(() => {
		if (!data)
			socket?.emit("retrieveData", props.userId);
	}, []);

	const { socket, surrender, move, stopMove, launchGame, joinQueue, data, mode, userId, result, setResult, setInGameContext } = props;

	return (
		<div>
			{ data && (
				(result === undefined || result === null) ? (
				<div>
					<Surrender
						surrender={surrender}
						socket={socket}
						data={data}
						/>
					<Canvas
						move={move}
						stopMove={stopMove}
						launchGame={launchGame}
						data={data}
						userId={userId}
						mode={mode}
						/>
				</div>
			) : (
				<Result
					result={result}
					setResult={setResult}
					joinQueue={joinQueue}
					setInGameContext={setInGameContext}
				/>
			))
			}
		</div>
	);
}

export default Game;