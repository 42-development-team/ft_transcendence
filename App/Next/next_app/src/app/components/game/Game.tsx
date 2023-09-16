"use client";
import React, { useRef, useEffect, useState } from "react";
import Canvas from './canvas';

const Game = ({ ...props }) => {

	const { move, stopMove, launchGame, data, userId, socket } = props;

	useEffect(() => {
		if (!data)
			socket?.emit("retrieveData", userId);
	}, []);

	return (
		<div>
			{
				data &&
				<Canvas socket={socket} move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId} />
			}

		</div>
	);
}

export default Game;