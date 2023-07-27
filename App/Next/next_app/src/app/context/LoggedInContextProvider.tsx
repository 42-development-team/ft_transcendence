"use client";
import { useRouter } from "next/router";
import { useContext, createContext, useState, useEffect } from "react";

// Note: we also need username ? Replace "PROFILE" text by "username"
type LoggedInContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    uniqueLogin: string;
    userId: string;
}

const LoggedInContextDefaultValues: LoggedInContextType = {
    isLoggedIn: false,
    login: async () => { },
    logout: () => { },
    uniqueLogin: "",
    userId: "",
}

const LoggedInContext = createContext<LoggedInContextType>(LoggedInContextDefaultValues);

export const LoggedInContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [uniqueLogin, setUniqueLogin] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

    // Debug logs
    useEffect(() => {
        if (uniqueLogin !== "" && userId !== "") {
            console.log(`uniqueLogin=${uniqueLogin}`);
            console.log(`userId=${userId}`);
        }
    }, [uniqueLogin, userId]);


    const fetchProfile = async () => {
        const response = await fetch(`${process.env.BACK_URL}/auth/profile`, { credentials: "include" });
        await response.json().then((data) => {
            let newLogin: string = data.login as string;
            setUniqueLogin(newLogin);
            let newUserId: string = data.sub as string;
            setUserId(newUserId);
            console.log("newUserId=" + newUserId);
        }).catch((error) => {
            throw new Error("Error fetching profile: " + error.message);
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
        console.log("logout");
        await fetch(`${process.env.BACK_URL}/auth/logout`, { credentials: "include" }).catch((error) => {
            console.log("error fetching profile: " + error.message);
        });
        setLoggedIn(false);
        // Todo: update user status
        setUniqueLogin("");
        setUserId("");
    }

    return (
        <LoggedInContext.Provider value={{ isLoggedIn, login, logout, uniqueLogin, userId }}>
            {children}
        </LoggedInContext.Provider>
    )
}

export const useLoggedInContext = () => useContext(LoggedInContext);