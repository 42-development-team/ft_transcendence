"use client";
import { useEffect, useState } from "react";
import { GameInterface } from "../game/interfaces/game.interfaces";
import { useAuthcontext } from "../context/AuthContext";

export default function useGame() {

	const {socket} = useAuthcontext();
	const [data, setData] = useState<GameInterface>();
	const [inGame, setInGame] = useState<boolean>(false);

	useEffect(() => {
		socket?.on('updateGame', (body: any) => {
			setData(body);
		});

		socket?.on('matchIsReady', (body: any) => {
			setInGame(true);
			setData(body);
		});

		socket?.on('reconnectGame', () => {
			setInGame(true);
		});

		socket?.on('endOfGame', () => {
			console.log('endOfGame');
			setInGame(false);
		});

		return () => {
			socket?.off('updateGame');
			socket?.off('matchIsReady');
			socket?.off('reconnectGame');
			socket?.off('endOfGame');
		};
	}, [socket]);


	const joinQueue = async () => {
		socket?.emit("joinQueue", 0);
	}

	const leaveQueue = async () => {
		socket?.emit("leaveQueue");
	}

	const move = async (event: string, id: number, userId: number) => {
		socket?.emit("move", event, id, userId);
	}

	const stopMove = async (event: string, id: number, userId: number) => {
		socket?.emit("stopMove", event, id, userId);
	}

	const launchGame = async (id: number) => {
		socket?.emit("launchGame", id);
	}

	return {
		move,
		stopMove,
		leaveQueue,
		joinQueue,
		launchGame,
		inGame,
		data,
	}
}
