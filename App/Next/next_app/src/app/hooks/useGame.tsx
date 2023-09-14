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
			const {winnerId, loserId} = body;
			console.log("winner:", winnerId, "loser:", loserId);
			console.log("userId", userId);
			if (userId === winnerId) {
				const {id, won} = {id: winnerId, won: true};
				console.log("id: ",id, "won:", won);
				setResult({id: winnerId, won: true});
			}
			else if (userId === loserId) {
				const {id, won} = {id: loserId, won: true};
				console.log("id: ",id, "won:", won);
				setResult({id: loserId, won: false});
			}
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
		console.log("launchGame: id:", id, "userId:", userId);
		setUserId(userId);
		socket?.emit("launchGame", id);
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
