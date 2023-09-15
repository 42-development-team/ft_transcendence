"use client";
import { useContext, useEffect, useState } from "react";
import { GameInterface } from "../components/game/interfaces/game.interfaces";
import { useAuthContext } from "../context/AuthContext";
import LoadingContext from "../context/LoadingContext";

export default function useGame() {

	const {socket} = useAuthContext();
	const [data, setData] = useState<GameInterface>();
	const [inGame, setInGame] = useState<boolean>(false);
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

		socket?.on('endOfGame', () => {
			console.log('endOfGame');
			// setInGame(false);
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

	const isUserQueued = async (userId: number) => {
		socket?.emit("isUserQueued", userId);
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
		data,
	}
}
