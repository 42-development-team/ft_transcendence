"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client';

type AuthContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    uniqueLogin: string;
    userId: string;
    refreshJWT: () => void;
	socket: Socket | undefined,
}

const AuthContextDefaultValues: AuthContextType = {
    isLoggedIn: false,
    login: async () => { },
    logout: () => { },
    uniqueLogin: "",
    userId: "",
    refreshJWT: async () => { },
	socket: undefined,
}

const AuthContext = createContext<AuthContextType>(AuthContextDefaultValues);

const JWT_REFRESH_INTERVAL = 25 * 60 * 1000;

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [uniqueLogin, setUniqueLogin] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
	const [socket, setSocket] = useState<Socket | undefined>(undefined);
	const ENDPOINT = `${process.env.BACK_URL}`;

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log("interval triggered: " + Date.now() / 1000);
            refreshJWT();
        }, JWT_REFRESH_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

	useEffect(() => {
		if (isLoggedIn)
			initializeSocket();
	}, [isLoggedIn]);

	// useEffect(() => {
	// 	if (isLoggedIn) {
	// 	  const handleTabClosing = (event: BeforeUnloadEvent) => {
	// 		logout();
	// 	};
	// 	if (isLoggedIn) {
	// 		window.addEventListener('beforeunload', handleTabClosing);
	// 	}
	// 	  return () => {
	// 		window.removeEventListener('beforeunload', handleTabClosing);
	// 	  };
	// 	}
	//   }, [isLoggedIn]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/auth/profile`, { credentials: "include" });
            const data = await response.json();;
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

    const refreshJWT = async () => {
        await fetch(`${process.env.BACK_URL}/auth/refresh`, { credentials: 'include' }).catch((error) => {
            console.log("Error fetching profile: " + error.message);
            logout();
        });
    }

    const login = async () => {
        // Todo: update user status
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
        // Todo: update user status
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

	const initializeSocket = () => {
		console.log('Connecting to socket.io server...');
		const socket = connect();
		setSocket(socket);
		return () => {
			console.log('Disconnecting from socket.io server...');
			socket.close();
		}
	};

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, uniqueLogin, userId, refreshJWT, socket }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthcontext = () => useContext(AuthContext);
