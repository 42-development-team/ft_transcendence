"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import useSocketConnection from "../hooks/useSocketConnection";

type SocketContextType = {
    socket: Socket | undefined,
}

const SocketContextDefaultValues: SocketContextType = {
    socket: undefined,
}

const SocketContext = createContext<SocketContextType>(SocketContextDefaultValues);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {

	const socket = useSocketConnection();

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}


export const useSocketContext = () => useContext(SocketContext);
