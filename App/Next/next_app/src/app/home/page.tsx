"use client";
import ChatBar from "@/components/chat/ChatBar"
import { useEffect } from "react"
import { useLoggedInContext } from "../context/LoggedInContextProvider";
import { refreshToken } from "../utils/refreshJWT";

export default function Home() {
    const {login} = useLoggedInContext();
    useEffect(() => {
        login();
    }, []);
    return (
        <div className="flex flex-auto w-full h-full">
            <ChatBar />
            <div className="w-full p-4 h-full">
                <a > You should land here after successful login </a>
            </div>
            <button onClick={refreshToken}>
                Refresh JWT
            </button>
        </div>
    )
}