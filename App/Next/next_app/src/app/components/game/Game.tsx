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
	const { socket, move, stopMove, launchGame, joinQueue, data, mode, result, setResult, setInGameContext, setMode } = props;
	const [beforeLeave, setBeforeLeave] = useState<number>(20);
	const [paused, setPaused] = useState<boolean>(false);
	const [opponnentUsername, setOpponnentUsername] = useState<string>("");
	const [currUserIsOnLeft, setCurrUserIsOnLeft] = useState<boolean>(false);
	const [userName, setUserName] = useState<string>("");
	const [dataReceived, setDataReceived] = useState<boolean>(false);

	useEffect(() => {
		if (userId === undefined || userId === "") return;
		socket?.emit("retrieveData", userId);
	}, [userId]);

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
		}
	}
		, [socket]);

	useEffect(() => {
		if (dataReceived) return;
		if (!props.data || !props.data.player1 || userId === undefined || userId === "") {
			return;
		}
		setCurrUserIsOnLeft(props.data.player1.id === parseInt(props.userId));
		getUserNameById(props.userId).then((userName: SetStateAction<string>) => {
			setUserName(userName);
		});
		if (props.data.player1.id === parseInt(props.userId))
			getUserNameById(props.data.player2.id).then((userName: SetStateAction<string>) => {
				setOpponnentUsername(userName);
			});
		else
			getUserNameById(props.data.player1.id).then((userName: SetStateAction<string>) => {
				setOpponnentUsername(userName);
			});
		setDataReceived(true);
	}, [props.data]);

	return (
		<div className="flex flex-grow justify-center">
			{data && (
				(result === undefined || result === null) ? (
					<div className="flex flex-col flex-grow justify-center h-full">
						<div className="flex flex-row justify-between mb-2 mx-[12vw] z-100">
							{paused &&
								<OverlayMessage surrender={props.surrender} message={`Your opponent has left the game. Redirect in ${beforeLeave} s.`} />
							}
							{!paused &&
								<GameHeaderInfo
									currUserIsOnLeft={currUserIsOnLeft}
									userName={userName}
									opponnentUsername={opponnentUsername}
									userId={userId}
									id={props.data.id}
									surrender={props.surrender}
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