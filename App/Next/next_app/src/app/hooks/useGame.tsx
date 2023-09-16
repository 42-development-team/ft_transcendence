"use client";

import { useContext, useEffect, useState } from "react";
import { GameInterface } from "../components/game/interfaces/game.interfaces";
import { useAuthContext } from "../context/AuthContext";
import LoadingContext from "../context/LoadingContext";
import { useRouter } from "next/navigation";

export default function useGame() {

	const {socket, userId} = useAuthContext();
	const [data, setData] = useState<GameInterface>();
	const [inGame, setInGame] = useState<boolean>(false);
	const router = useRouter();
	const [result, setResult] = useState<{id: number, won: boolean} | undefined>(undefined);
	const {gameLoading, setGameLoading} = useContext(LoadingContext);

	useEffect(() => {
		socket?.on('updateGame', (body: any) => {
			setData(body);
		});

		socket?.on('matchIsReady', (body: any) => {
			setInGame(true);
			setData(body);
			setGameLoading(false);
		});

		socket?.on('reconnectGame', () => {
			setInGame(true);
		});

		socket?.on('endOfGame', (body: any) => {
			const {winnerId, loserId} = body;

			if (parseInt(userId) === winnerId)
				setResult({id: winnerId, won: true});
			else if (parseInt(userId) === loserId)
				setResult({id: loserId, won: false});
		});

		socket?.on('surrender', () => { //TODO: implement in backlogical
			setInGame(false);
		});

		socket?.on('sendDataToUser', (body: any) => {
			setData(body);
		});

		return () => {
			socket?.off('isQueued');
			socket?.off('isNotQueued');
			socket?.off('updateGame');
			socket?.off('matchIsReady');
			socket?.off('reconnectGame');
			socket?.off('endOfGame');
			socket?.off('surrender');
			socket?.off('sendDataToUser');
		};
	}, [socket]);

	const joinQueue = async () => {
		socket?.emit("joinQueue", 0);
	}

	const leaveQueue = async () => {
		socket?.emit("leaveQueue");
	}

	const move = async (event: string, id: number, uid: number) => {
		socket?.emit("move", event, id, uid);
	}

	const stopMove = async (event: string, id: number, uid: number) => {
		socket?.emit("stopMove", event, id, uid);
	}

	const launchGame = async (id: number) => {
		socket?.emit("launchGame", id);
	}

	const isUserQueued = async (uid: number) => {
		socket?.emit("isUserQueued", uid);
	}

	const surrender = async (id: number, userId: number) => {
		socket?.emit("surrender", {id, userId});
	}

	return {
		move,
		stopMove,
		leaveQueue,
		joinQueue,
		launchGame,
		isUserQueued,
		surrender,
		socket,
		inGame,
		setInGame,
		result,
		setResult,
		data,
	}
}
