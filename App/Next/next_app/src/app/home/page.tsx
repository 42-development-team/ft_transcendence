"use client"

import Chat from "@/components/chat/Chat";
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Play from "../components/home/play";
import Game from "../components/game/Game";
import useGame from "../hooks/useGame";
import InGameContext from "../context/inGameContext";
import Pong from "../../../public/pong.png"
import Image from "next/image";

export default function Home() {
  const { login, userId } = useAuthContext();
  const { inGameContext } = useContext(InGameContext);
  const [fontSize, setFontSize] = useState<number>(window.innerWidth / 9);

  window.addEventListener('resize', () => {
    setFontSize(window.innerWidth / 9);
  });

  useEffect(() => {
    login();
  }, []);

  const { surrender, move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, setInGameContext, result, setResult, data, changeMode, mode } = useGame();

  return (
    <div className="flex w-full h-full">
      <Chat userId={userId} />
      {inGame === false && inGameContext === false ? (
        <div className="w-full p-4 h-full flex flex-col items-center justify-evenly">
          <div className="flex basis-1/6"/>
            <div className='flex cyber text-yellow' style={{fontSize: fontSize + 'px', fontFamily: "Cy", textShadow:'4px 4px 8px'}}>PONG</div>
          <div className="basis-1/5"/>
          <div className="basis-3/6">
            <Play
              socket={socket}
              isUserQueued={isUserQueued}
              leaveQueue={leaveQueue}
              joinQueue={joinQueue}
              userId={userId}
              changeMode={changeMode}
              mode={mode}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center flex-grow h-full w-full">
          <Game
            socket={socket}
            surrender={surrender}
            move={move}
            stopMove={stopMove}
            launchGame={launchGame}
            joinQueue={joinQueue}
            data={data}
            userId={userId}
            result={result}
            setResult={setResult}
            setInGameContext={setInGameContext}
          />
        </div>
      )}
    </div>
  );
}
