"use client";
import useChatConnection from "./useChatConnection";
import { useEffect, useState } from "react";
import { GameInterface } from "../game/interfaces/game.interfaces";

export default function useGame() {
	
	const socket = useChatConnection();
	const [data, setData] = useState<GameInterface>();

	// init data with p1, p2 and ball infos
	useEffect(() => {
		socket?.on('updateGame', (body: any) => {
			console.log("move event - useGame.tsx");
			console.log("body:", JSON.stringify(body, null, 2));
			// update data

		});
		return () => {
			socket?.off('updateGame');
		};
	}, [socket]);

	const move = async (event: string) => {
		// Emit le move sur la socket
		socket?.emit('move', (event));
	}

	const stopMove = async (event: string) => {
		socket?.emit('stopMove', (event));
	}

	return {
		move,
		stopMove,
		data,
	}
}
