"use client";
import React, { useRef, useEffect, useState } from "react";
import Canvas from './canvas';
import Result from './result';

const Game = ({ ...props }) => {
	useEffect(() => {
		if (!data)
			socket?.emit("retrieveData", userId);
	}, []);

	const { socket, move, stopMove, launchGame, leaveQueue, joinQueue, data, userId, result, setResult, setInGame } = props;

	return (
		<div>
			{ data && (
				(result === undefined || result === null) ? (
				<Canvas move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId} />
			) : (
				<Result socket={socket} result={result} setResult={setResult} setInGame={setInGame} leaveQueue={leaveQueue} joinQueue={joinQueue} />
			))
			}
		</div>
	);
}

export default Game;