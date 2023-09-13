"use client"

import Chat from "@/components/chat/Chat";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import Play from "../components/home/play";
import Game from "../components/game/Game";
import useGame from "../hooks/useGame";

export default function Home() {
  const { login, userId } = useAuthContext();
  useEffect(() => {
    login();
    
  }, []);

	const {move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, data} = useGame();

  return (
    <div className="flex w-full h-full">
      <Chat userId={userId} />
      {!inGame &&
        <div className="w-inherit p-4 h-inherit flex items-center justify-center">
          <Play socket={socket} isUserQueued={isUserQueued} leaveQueue={leaveQueue} joinQueue={joinQueue} userId={userId}/>
        </div>
      }
      {inGame &&
        <div className="flex flex-grow h-inherit w-inherit">
        <Game move={move} stopMove={stopMove} launchGame={launchGame} data={data} userId={userId}/>
        </div>
      }
    </div>
  );

}
