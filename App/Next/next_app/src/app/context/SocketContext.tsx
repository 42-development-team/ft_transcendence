"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import useSocketConnection from "../hooks/useSocketConnection";
import { useAuthcontext } from "./AuthContext";

type SocketContextType = {
    socket: Socket | undefined,
}

const SocketContextDefaultValues: SocketContextType = {
    socket: undefined,
}

const SocketContext = createContext<SocketContextType>(SocketContextDefaultValues);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    // const [socket, setSocket] = useState<Socket | undefined>(undefined);
	// const {isLoggedIn} = useAuthcontext();
	// const newSocket = useSocketConnection();

	const socket = useSocketConnection();

	// useEffect(() => {
	// 	if (isLoggedIn) {
	// 		setSocket(newSocket);
	// 	}
	// }, [isLoggedIn] )

    useEffect(() => {
        console.log("Socket in SocketContextProvider:", socket);
    }, [socket]);

    // useEffect(() => {
    //     console.log("isLoggedIn in SocketContextProvider:", isLoggedIn);
    // }, [isLoggedIn]);

    console.log("SocketContextProvider rendered");

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}


export const useSocketContext = () => useContext(SocketContext);
