"use client";
import ChatBar from "@/components/chat/ChatBar"
import { useEffect } from "react"
import { useLoggedInContext } from "../context/LoggedInContextProvider";

const test = async() => {
    const response = await fetch(`${process.env.BACK_URL}/auth/refresh/`, { credentials: 'include' });
    await response.json().then((data) => {
        console.log(data);
    }).catch((error) => {
        throw new Error("Error fetching profile: " + error.message);
    });
}

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
            <button onClick={test}>
                Refresh JWT
            </button>
        </div>
    )
}