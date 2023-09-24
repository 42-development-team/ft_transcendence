"use client";
import React, { useEffect } from "react";
import Canvas from './Canvas';
import Result from './Result';
import Surrender from "./Surrender";
import Logo from "../home/Logo";

const Game = ({ ...props }) => {
	useEffect(() => {
		if (!data)
			socket?.emit("retrieveData", props.userId);
	}, []);

	const { socket, surrender, move, stopMove, launchGame, joinQueue, data, mode, userId, result, setResult, setInGameContext } = props;

	return (
		<div className="flex">
			{data && (
				(result === undefined || result === null) ? (
					<div className="flex flex-col flex-grow justify-center">
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
					<div className="flex flex-col items-center justify-evenly">
						<Logo />
						<Result
							result={result}
							setResult={setResult}
							joinQueue={joinQueue}
							setInGameContext={setInGameContext}
						/>
						<div className="basis-1/9"></div>
					</div>
				))
			}
		</div>
	);
}

export default Game;