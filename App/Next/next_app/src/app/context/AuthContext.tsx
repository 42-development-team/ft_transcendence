"use client";
import { useContext, createContext, useState, useEffect } from "react";

// Note: we also need username ? Replace "PROFILE" text by "username"
type AuthContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    uniqueLogin: string;
    userId: string;
    refreshJWT: () => void;
}

const AuthContextDefaultValues: AuthContextType = {
    isLoggedIn: false,
    login: async () => { },
    logout: () => { },
    uniqueLogin: "",
    userId: "",
    refreshJWT: async () => { },
}

const AuthContext = createContext<AuthContextType>(AuthContextDefaultValues);

const JWT_REFRESH_INTERVAL = 25 * 60 * 1000;

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [uniqueLogin, setUniqueLogin] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

    // Debug logs
    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log("interval triggered: " + Date.now() / 1000);
            refreshJWT();
        }, JWT_REFRESH_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);


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
            // Todo: logout on error
            throw new Error("Error fetching profile: " + error);
        };
    }

    const refreshJWT = async () => {
        console.log("refreshJWT");
        await fetch(`${process.env.BACK_URL}/auth/refresh`, { credentials: 'include' }).catch((error) => {
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
        await fetch(`${process.env.BACK_URL}/auth/logout`, { credentials: "include" }).catch((error) => {
            console.log("error fetching profile: " + error.message);
        });
        setLoggedIn(false);
        // Todo: update user status
        setUniqueLogin("");
        setUserId("");
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, uniqueLogin, userId, refreshJWT }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthcontext = () => useContext(AuthContext);