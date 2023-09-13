"use client";
import { useEffect, useState } from "react";
import { GameInterface } from "../components/game/interfaces/game.interfaces";
import { useAuthContext } from "../context/AuthContext";

export default function useGame() {

	const {socket} = useAuthContext();
	const [data, setData] = useState<GameInterface>();
	const [inGame, setInGame] = useState<boolean>(false);
	const [userId, setUserId] = useState<number | null>(null);
	const [result, setResult] = useState<{id: number, won: boolean} | undefined>(undefined);

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

		socket?.on('endOfGame', (body: any) => {
			console.log(body);
			const {winnerId, loserId} = body;
			if (userId === winnerId)
				setResult({id: winnerId, won: true});
			else if (userId === loserId)
				setResult({id: loserId, won: false});
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

	const launchGame = async (id: number, userId: number) => {
		socket?.emit("launchGame", id);
		setUserId(userId);
	}

	return {
		move,
		stopMove,
		leaveQueue,
		joinQueue,
		launchGame,
		inGame,
		result,
		data,
	}
}
