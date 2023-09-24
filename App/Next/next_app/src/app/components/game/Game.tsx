"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import Canvas from './Canvas';
import Result from './Result';
import Surrender from "./Surrender";
import Logo from "../home/Logo";
import getUserNameById from "../utils/getUserNameById";

const Game = ({ ...props }) => {

	const [opponnentUsername, setOpponnentUsername] = useState<string>("");
	const [userName, setUserName] = useState<string>("");

	console.log("userId: ", props.userId);
	console.log("userName: ", userName);
	useEffect(() => {
		if (!data)
			socket?.emit("retrieveData", props.userId);
		getUserNameById(props.userId).then((userName: SetStateAction<string>) => {
			setUserName(userName);
		});
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
						<div className="flex flex-row justify-evenly mb-2 mx-[20vw]">
							<div className="flex">{opponnentUsername}</div>
							<div className="flex">{userName}</div>
						</div>
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