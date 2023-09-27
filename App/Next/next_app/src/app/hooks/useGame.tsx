"use client";

import { useContext, useEffect, useState } from "react";
import { GameInterface } from "../components/game/interfaces/game.interfaces";
import { useAuthContext } from "../context/AuthContext";
import LoadingContext from "../context/LoadingContext";
import IsInGameContext from "../context/inGameContext";
import { on } from "events";

export default function useGame() {

	const { socket, userId } = useAuthContext();
	const [data, setData] = useState<GameInterface>();
	const [inGame, setInGame] = useState<boolean>(false);
	const [mode, setMode] = useState<boolean>(false);
	const [result, setResult] = useState<{ id: number, won: boolean } | undefined>(undefined);
	const { setGameLoading } = useContext(LoadingContext);
	const { setInGameContext } = useContext(IsInGameContext);

	useEffect(() => {
		socket?.emit('isInGame', userId)
	}, [socket?.connected]);
	
	useEffect(() => {
		socket?.on('updateGame', (body: any) => {
			setData(body);
		});

		socket?.on('matchIsReady', (body: any) => {
			setInGame(true);
			setResult(undefined);
			setData(body);
			setMode(body.mode);
			setGameLoading(false);
			setInGameContext(true);
		});

		socket?.on('reconnectGame', () => {
			setInGameContext(true);
			setInGame(true);
		});

		socket?.on('endOfGame', (body: any) => {
			const { winnerId, loserId } = body;

			if (parseInt(userId) === winnerId)
				setResult({ id: winnerId, won: true });
			else if (parseInt(userId) === loserId)
				setResult({ id: loserId, won: false });

			setInGame(false);
		});

		socket?.on('sendDataToUser', (body: any) => {
			setData(body);
			setInGameContext(true);
			setInGame(true);
		});

		socket?.on('isAlreadyInGame', () => {
			setInGameContext(true);
			setInGame(true);
		});

		return () => {
			socket?.off('isQueued');
			socket?.off('isNotQueued');
			socket?.off('updateGame');
			socket?.off('matchIsReady');
			socket?.off('reconnectGame');
			socket?.off('endOfGame');
			socket?.off('sendDataToUser');
			socket?.off('isAlreadyInGame');
		};
	}, [socket]);


	const changeMode = async () => {
		await leaveQueue();
		if (mode === true)
			setMode(false);
		else
			setMode(true);
	}

	const joinQueue = async () => {
		socket?.emit("joinQueue", mode);
	}

	const leaveQueue = async () => {
		socket?.emit("leaveQueue", parseInt(userId));
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
		socket?.emit("surrender", id, userId);
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
		setInGameContext,
		result,
		setResult,
		data,
		changeMode,
		setMode,
		mode,
	}
}
