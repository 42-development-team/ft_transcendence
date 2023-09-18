"use client";
import { useContext, useEffect, useState } from "react";
import { GameInterface } from "../components/game/interfaces/game.interfaces";
import { useAuthContext } from "../context/AuthContext";
import LoadingContext from "../context/LoadingContext";

export default function useGame() {

	const {socket, userId} = useAuthContext();
	const [data, setData] = useState<GameInterface>();
	const [inGame, setInGame] = useState<boolean>(false);
	const [result, setResult] = useState<{id: number, won: boolean} | undefined>(undefined);
	const {gameLoading, setGameLoading} = useContext(LoadingContext);
	const [mode, setMode] = useState<boolean>(false);

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

		return () => {
			socket?.off('isQueued');
			socket?.off('isNotQueued');
			socket?.off('updateGame');
			socket?.off('matchIsReady');
			socket?.off('reconnectGame');
			socket?.off('endOfGame');
		};
	}, [socket]);

	useEffect(() => {leaveQueue()}, [mode]);

	const changeMode = () => {
		if (mode === true)
			setMode(false);
		else
			setMode(true);
		console.log('mode', mode);
	}

	const joinQueue = async () => {
		socket?.emit("joinQueue", mode);
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

	return {
		move,
		stopMove,
		leaveQueue,
		joinQueue,
		launchGame,
		isUserQueued,
		socket,
		inGame,
		setInGame,
		result,
		setResult,
		data,
		changeMode,
	}
}
