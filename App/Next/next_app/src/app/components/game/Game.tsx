"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import Canvas from './Canvas';
import Result from './Result';
import Logo from "../home/Logo";
import getUserNameById from "../utils/getUserNameById";
import DropDownMenu from "../dropdown/DropDownMenu";
import { DropDownActionSurrender } from "../dropdown/DropDownItem";

const Game = ({ ...props }) => {

	const { socket, move, stopMove, launchGame, joinQueue, data, mode, userId, result, setResult, setInGameContext } = props;
	const [opponnentUsername, setOpponnentUsername] = useState<string>("");
	const [userName, setUserName] = useState<string>("");

	useEffect(() => {
		if (!props.data || !props.data.player1) {
			socket?.emit("retrieveData", props.userId);
			return ;
		}
		getUserNameById(props.userId).then((userName: SetStateAction<string>) => {
			setUserName(userName);
		});
		if ( props.data.player1.id === parseInt(props.userId))
			getUserNameById(props.data.player2.id).then((userName: SetStateAction<string>) => {
				setOpponnentUsername(userName);
			});
		else
			getUserNameById(props.data.player1.id).then((userName: SetStateAction<string>) => {
				setOpponnentUsername(userName);
			});
	}, [props.data ? props.data.player1 : props.data]);

	return (
		<div className="flex flex-grow justify-center">
			{data && (
				(result === undefined || result === null) ? (
					<div className="flex flex-col flex-grow justify-center">
						<div className="flex flex-row justify-between mb-2 mx-[12vw]">
							<div className="flex text-[2.2vw] text-mauve">{opponnentUsername}</div>
							<div className="flex flex-row text-[2.2vw] text-mauve">
								{userName}
								<DropDownMenu width="w-4" height="h-4" color="bg-crust" position="bottom-10 right-2">
									<DropDownActionSurrender onClick={() => props.surrender(props.data.id, parseInt(userId))}>
										Surrender
									</DropDownActionSurrender>	
								</DropDownMenu>	
							</div>
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
						/>
						<div className="basis-2/11"></div>
					</div>
				))
			}
		</div>
	);
}

export default Game;