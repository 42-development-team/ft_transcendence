"use client"
import React from "react";
import Chat from "@/components/chat/Chat";
import { useEffect } from "react";
import { useAuthcontext } from "../context/AuthContext";
import Play from "../components/home/play";

export default function Home() {
  const { login, userId } = useAuthcontext();
  useEffect(() => {
    login();
  }, []);

  return (
    <div className="flex flex-auto w-full h-full">
      <Chat userId={userId} />
      <div className="w-full p-4 h-full flex items-center justify-center">
        <Play /> 
      </div>
    </div>
  );
}
