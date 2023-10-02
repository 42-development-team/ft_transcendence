"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import Canvas from './Canvas';
import Result from './Result';
import getUserNameById from "../utils/getUserNameById";
import { useAuthContext } from "@/app/context/AuthContext";
import { GameHeaderInfo } from "./GameHeaderInfo";
import OverlayMessage from "./overlayMessage";

const Game = ({ ...props }) => {
	const { userId } = useAuthContext();
	const { socket, surrender, move, stopMove, launchGame, joinQueue, data, mode, result, setResult, setInGameContext, setMode, countdown } = props;
	const [beforeLeave, setBeforeLeave] = useState<number>(20);
	const [paused, setPaused] = useState<boolean>(false);
	const [opponnentUsername, setOpponnentUsername] = useState<string>("");
	const [currUserIsOnLeft, setCurrUserIsOnLeft] = useState<boolean>(false);
	const [userName, setUserName] = useState<string>("");
	const [dataReceived, setDataReceived] = useState<boolean>(false);

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
		}
);

		return () => {
			socket?.off("playerDisconnected");
			socket?.off("playerReconnected");
		}
	}, [socket]);

	const getAndSetUsersName = async (userId: string, opponentId: string) => {
		const name = await getUserNameById(userId);
		const opName = await getUserNameById(opponentId);
		setUserName(name);
		setOpponnentUsername(opName);
		console.log("my username:", name, userId);
		console.log("my opponent username:", opName, opponentId);
	}

	useEffect(() => {}, [userName, opponnentUsername]);

	useEffect(() => {
		if (dataReceived)
			return;
		if (!data || !data.player1 || userId === undefined || userId === "")
			return;

		console.log("p1 id:", data.player1.id); // p1 id is always left side => perfect

		setCurrUserIsOnLeft(data.player1.id === parseInt(userId));
		if (data.player1.id === parseInt(userId))
			getAndSetUsersName(userId, data.player2.id.toString());
		else
			getAndSetUsersName(userId, data.player1.id.toString());
		setDataReceived(true);
	}, [data, userId, dataReceived]);

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
									currUserIsOnLeft={currUserIsOnLeft}
									userName={userName}
									opponnentUsername={opponnentUsername}
									userId={userId}
									id={data.id}
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