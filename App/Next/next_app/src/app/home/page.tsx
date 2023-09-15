"use client"

import Chat from "@/components/chat/Chat";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import Play from "../components/home/play";
import Game from "../components/game/Game";
import useGame from "../hooks/useGame";
import Surrender from "../components/game/Surrender";

export default function Home() {
  const { login, userId } = useAuthContext();
  useEffect(() => {
    login();

  }, []);

  const { move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, data } = useGame();

  return (
    <div className="flex w-full h-full">
      <Chat userId={userId} />
      {
        !inGame &&
        <div className="w-full p-4 h-full flex items-center justify-center">
          <Play socket={socket} isUserQueued={isUserQueued} leaveQueue={leaveQueue} joinQueue={joinQueue} userId={userId} />
        </div>
      }
      {
        inGame &&
        <div className="flex flex-col flex-grow h-inherit w-inherit">
          <Surrender />
          <Game move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId} />
        </div>
      }
    </div>
  );

}
