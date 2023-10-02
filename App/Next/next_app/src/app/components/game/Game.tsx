"use client";
import React, { useEffect, useState } from "react";
import Canvas from './Canvas';
import Result from './Result';
import { useAuthContext } from "@/app/context/AuthContext";
import { GameHeaderInfo } from "./GameHeaderInfo";
import OverlayMessage from "./overlayMessage";

const Game = ({ ...props }) => {
	const { userId } = useAuthContext();
	const { socket, surrender, move, stopMove, launchGame, joinQueue, data, mode, result, setResult, setInGameContext, setMode, countdown } = props;
	const [beforeLeave, setBeforeLeave] = useState<number>(20);
	const [paused, setPaused] = useState<boolean>(false);
	
	useEffect(() => {
		if (userId === undefined || userId === "")
			return;
		socket?.emit("retrieveData", userId);
	}, [userId, socket]);

	useEffect(() => {
		socket?.on("playerDisconnected", (body: any) => {
			const { beforeLeave } = body;
			setBeforeLeave(beforeLeave);
			setPaused(true);
		});

		socket?.on("playerReconnected", () => {
			setPaused(false);
		});

		return () => {
			socket?.off("playerDisconnected");
			socket?.off("playerReconnected");
		}
	}, [socket]);

	return (
		<div className="flex flex-grow justify-center">
			{data && (
				(result === undefined || result === null) ? (
					<div className="flex flex-col flex-grow justify-center h-full">
						<div className="flex flex-row justify-between mb-2 mx-[12vw] z-100">
							{paused &&
								<OverlayMessage id={data.id} userId={userId} surrender={surrender} message={`Your opponent has left the game. Redirect in ${beforeLeave} s.`} />
							}
							{!paused &&
								<GameHeaderInfo
									userId={userId}
									data={data}
									surrender={surrender}
								/>
							}
						</div>
						<Canvas
							move={move}
							stopMove={stopMove}
							launchGame={launchGame}
							data={data}
							userId={userId}
							mode={mode}
							countdown={countdown}
						/>
					</div>
				) : (
					<div className="flex flex-col justify-center w-[70%]">
						<Result
							result={result}
							setResult={setResult}
							joinQueue={joinQueue}
							setInGameContext={setInGameContext}
							data={data}
							setMode={setMode}
						/>
						<div className="basis-2/11"></div>
					</div>
				))
			}
		</div>
	);
}

export default Game;