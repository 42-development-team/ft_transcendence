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

	const { socket, surrender, move, stopMove, launchGame, leaveQueue, joinQueue, data, userId, result, setResult, setInGameContext } = props;

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
						/>
				</div>
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