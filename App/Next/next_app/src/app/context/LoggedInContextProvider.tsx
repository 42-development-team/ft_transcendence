"use client";
import React, {useContext, createContext, useState} from "react";

// Note: we also need username ? Replace "PROFILE" text by "username"
type LoggedInContextType = {
    isLoggedIn: boolean;
    login: (newLogin: string) => void;
    logout: () => void;
    uniqueLogin: string;
}

const LoggedInContextDefaultValues: LoggedInContextType = {
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
    uniqueLogin: "",
}

const LoggedInContext = createContext<LoggedInContextType>(LoggedInContextDefaultValues);

export const LoggedInContextProvider = ({children} : {children: React.ReactNode}) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [uniqueLogin, setUniqueLogin] = useState<string>("");

    const login = (newLogin: string) => {
        setLoggedIn(true);
        setUniqueLogin("newLogin")
        console.log(`Now logged as ${newLogin}`)
    }

    const logout = () => {
        setLoggedIn(false);
        setUniqueLogin("");
    }

    return (
        <LoggedInContext.Provider value = {{isLoggedIn, login, logout, uniqueLogin}}>
            {children}
        </LoggedInContext.Provider>
    )
}

export const useLoggedInContext = () => useContext(LoggedInContext);