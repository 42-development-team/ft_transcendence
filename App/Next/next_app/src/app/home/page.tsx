"use client";
import ChatBar from "@/components/chat/ChatBar"
import { useEffect } from "react"
import { useAuthcontext } from "../context/AuthContext";

export default function Home() {
    const {login, refreshJWT} = useAuthcontext();
    useEffect(() => {
        login();
    }, []);
    return (
        <div className="flex flex-auto w-full h-full">
            <ChatBar />
            <div className="w-full p-4 h-full">
                <a > You should land here after successful login </a>
            </div>
            <button onClick={refreshJWT}>
                Refresh JWT
            </button>
            <div className="m-4"></div>
        </div>
    )
}