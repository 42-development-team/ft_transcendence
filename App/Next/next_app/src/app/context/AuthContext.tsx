"use client";
import React, { useContext, createContext, useState, useEffect } from "react";
import LoadingContext from "./LoadingContext";
import { io, Socket } from 'socket.io-client';

type AuthContextType = {
	isLoggedIn: boolean;
	login: () => void;
	logout: () => void;
	uniqueLogin: string;
	userId: string;
	socket: Socket | undefined,
	socketReady: boolean,
}

const AuthContextDefaultValues: AuthContextType = {
	isLoggedIn: false,
	login: async () => { },
	logout: () => { },
	uniqueLogin: "",
	userId: "",
	socket: undefined,
	socketReady: false,
}

const AuthContext = createContext<AuthContextType>(AuthContextDefaultValues);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
	const [uniqueLogin, setUniqueLogin] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const [socket, setSocket] = useState<Socket | undefined>(undefined);
	const ENDPOINT = `${process.env.BACK_URL}`;
	const { gameLoading, setGameLoading } = useContext(LoadingContext);
	const [socketReady, setSocketReady] = useState(false);

	// Exception catcher for fetch
	useEffect(() => {
		const { fetch : originalFetch } = window;
		window.fetch = async (...args) => {
			try {
				let [resource, config] = args;
				const response = await originalFetch(resource, config as RequestInit);
				if (!response.ok && (response.status === 401 || response.status === 500)) {
					setLoggedIn(false);
					window.location.href = "/";
					return Promise.reject(response);
				}
				return response;
			}
			catch (error) {
				return ;
			}
		};
	}, []);

	useEffect(() => {
		if (isLoggedIn && userId && !socketReady) {
			initializeSocket(userId);
		}
	}, [isLoggedIn, userId]);

	const fetchProfile = async () => {
		try {
			const response = await fetch(`${process.env.BACK_URL}/auth/profile`, { credentials: "include" });
			const data = await response.json();
			let newLogin: string = data.login as string;
			setUniqueLogin(newLogin);
			let newUserId: string = data.sub as string;
			setUserId(newUserId);
		}
		catch (error) {
			console.log("Error fetching profile: " + error);
			await logout();
		}
	}

	const login = async () => {
		setLoggedIn(true);
		await fetchProfile().catch((error) => {
			console.log("error fetching profile: " + error.message);
		});
	}

	const logout = async () => {
		await fetch(`${process.env.BACK_URL}/auth/logout`, { credentials: "include" }).catch((error) => {
			console.log("error fetching logout: " + error.message);
		});
		setUserId("");
		setLoggedIn(false);
		setUniqueLogin("");
		setGameLoading(false);
		socket?.disconnect();
	}

	const connect = () => {
		return io(ENDPOINT, {
			withCredentials: true,
			reconnectionAttempts: 1,
			transports: ['websocket'],
		})
	}

	useEffect(() => {
		socket?.on('connect_error', (err) => {
			console.log('Connection to socket.io server failed', err);
		});
		socket?.on('disconnect', (reason) => {
			console.log('Disconnected from socket.io server', reason);
		});
		socket?.on('connect', () => {
			console.log('Connected to socket.io server');
			setSocketReady(true);
		});

		return () => {
			socket?.off('connect_error');
			socket?.off('disconnect');
			socket?.off('connect');
		}
	}, [socket]);

	const initializeSocket = async (userId: string) => {
		const socket = connect();
		setSocket(socket);
		return () => {
			socket.close();
		}
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, login, logout, uniqueLogin, userId, socket, socketReady }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuthContext = () => useContext(AuthContext);
