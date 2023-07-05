"use client";
import React, {useContext, createContext, useState} from "react";

type LoggedInContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const LoggedInContextDefaultValues: LoggedInContextType = {
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
}

const LoggedInContext = createContext<LoggedInContextType>(LoggedInContextDefaultValues);

export const LoggedInContextProvider = ({children} : {children: React.ReactNode}) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

    const login = () => {
        setLoggedIn(true);
    }

    const logout = () => {
        setLoggedIn(false);
    }

    return (
        <LoggedInContext.Provider value = {{isLoggedIn, login, logout}}>
            {children}
        </LoggedInContext.Provider>
    )
}

export const useLoggedInContext = () => useContext(LoggedInContext);