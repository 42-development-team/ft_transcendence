"use client";
import { useEffect, useState } from "react";
import { BallInterface, GameInterface, PlayerInterface } from "../game/interfaces/game.interfaces";
import { useAuthcontext } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function useGame() {

	const {socket} = useAuthcontext();
	const [data, setData] = useState<GameInterface>();
	const [inGame, setInGame] = useState<boolean>(false);
	const router = useRouter();

	const handleNewGameConnection = (body: any) => {
		const { room, user } = body;
	};

	// init data with p1, p2 and ball infos
	useEffect(() => {
		socket?.on('updateGame', (body: any) => {
			console.log("updateGame event - useGame.tsx");
			console.log("body:", JSON.stringify(body, null, 2));
			setData(body);
		});

		socket?.on('matchIsReady', (body: any) => {
			setInGame(true);
			setData(body);
		});

		return () => {
			socket?.off('updateGame');
			socket?.off('matchIsReady');
		};
	}, [socket]);


	// TODO keep this logic but match it with db model
	
	const joinQueue = async () => {
		socket?.emit("joinQueue", 0);
	}

	const leaveQueue = async () => {
		socket?.emit("leaveQueue");
	}

	const move = async (event: string) => {
		// Emit le move sur la socket
		socket?.emit('move', event);
	}

	const stopMove = async (event: string) => {
		socket?.emit('stopMove', event);
	}

	const launchGame = async (id: number) => {
		socket?.emit('launchGame', id);
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
