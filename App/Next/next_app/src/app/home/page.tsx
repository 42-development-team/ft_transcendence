"use client"
import Chat from "@/components/chat/Chat";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import Play from "../components/home/play";
import Game from "../game/page";
import useGame from "../hooks/useGame";
import Image from "next/image";
import homeBackground from "../../../public/homeBackground.png";

export default function Home() {
  const { login, userId } = useAuthContext();
  useEffect(() => {
    login();
  }, []);

	const {move, stopMove, leaveQueue, joinQueue, launchGame, inGame, data} = useGame();

  return (
    <div className="flex flex-auto w-full h-full">
      <Chat userId={userId} />
      {!inGame &&
        <div className="w-full p-4 h-full flex items-center justify-center">
          <Play leaveQueue={leaveQueue} joinQueue={joinQueue}/>
        </div>
      }
      {inGame &&
        <Game move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId}/>
      }
    </div>
  );
}
