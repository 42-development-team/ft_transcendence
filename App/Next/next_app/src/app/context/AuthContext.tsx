"use client";
import { Dialog, DialogBody, DialogFooter, DialogHeader, Button } from "@material-tailwind/react";
import { useContext, createContext, useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import { delay } from "@/app/utils/delay";

type AuthContextType = {
	isLoggedIn: boolean;
	login: () => void;
	logout: () => void;
	uniqueLogin: string;
	userId: string;
	socket: Socket | undefined,
}

const AuthContextDefaultValues: AuthContextType = {
	isLoggedIn: false,
	login: async () => { },
	logout: () => { },
	uniqueLogin: "",
	userId: "",
	socket: undefined,
}

const AuthContext = createContext<AuthContextType>(AuthContextDefaultValues);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
	const [uniqueLogin, setUniqueLogin] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const [socket, setSocket] = useState<Socket | undefined>(undefined);
	const [channelNameInvited, setChannelNameInvited] = useState("");
	const ENDPOINT = `${process.env.BACK_URL}`;
	const [open, setOpen] = useState(false);
	const [invited, setInvited] = useState(false);

	useEffect(() => {
		if (isLoggedIn && userId)
			initializeSocket(userId);
	}, [isLoggedIn, userId]);

	useEffect(() => {
		if (isLoggedIn) {
			const handleTabClosing = (event: BeforeUnloadEvent) => {
				fetch(`${process.env.BACK_URL}/users/update_status/${userId}`, {
					credentials: "include",
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						currentStatus: "offline",
					}),
				});

			};
			if (isLoggedIn) {
				window.addEventListener('beforeunload', handleTabClosing);
			}
			return () => {
				window.removeEventListener('beforeunload', handleTabClosing);
			};
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
			if (uniqueLogin !== "" && userId !== "") {
				console.log(`uniqueLogin=${uniqueLogin}`);
				console.log(`userId=${userId}`);
			}
		}
		catch (error) {
			console.log("Error fetching profile: " + error);
			logout();
		};
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
		setLoggedIn(false);
		setUniqueLogin("");
		setUserId("");
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
		socket.on('connect', () => {
			// fetch to verify userStatus is online. If not update it to online
			if (userId) {
				fetch(`${process.env.BACK_URL}/users/update_status/${userId}`, {
					credentials: "include",
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						currentStatus: "online",
					}),
				});
			}
		})
		return () => {
			socket.close();
		}
	};

	useEffect(() => {
		socket?.on('userInvited', (body: any) => {
			setChannelNameInvited(body.room);
			setInvited(true);
			const userInvited = body.user;
			if (userInvited.id === userId) {
				console.log(`user ${userInvited.name} has been invited to join channel ${channelNameInvited}`);
				setOpen(true);
			}
		})
	}, [socket, invited]);

	const handleOpen = () => {
		delay(2000);
		setOpen(!open);
	}

	return (
		<AuthContext.Provider value={{ isLoggedIn, login, logout, uniqueLogin, userId, socket }}>
			{children}
			<Dialog open={open} handler={handleOpen} className="mt-auto">
				<DialogHeader>
					Invitation
				</DialogHeader>
				<DialogBody divider>
					You have been invited to join the channel: {channelNameInvited}
				</DialogBody>
				<DialogFooter>
					<Button
						variant="text" color="red"
						onClick={handleOpen}
						className="mr-1">
						Ok
					</Button>
				</DialogFooter>
			</Dialog>
		</AuthContext.Provider>
	)
}

export const useAuthcontext = () => useContext(AuthContext);
