"use client"

import Chat from "@/components/chat/Chat";
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Play from "../components/home/play";
import Game from "../components/game/Game";
import useGame from "../hooks/useGame";
import Surrender from "../components/game/Surrender";
import { Socket } from "socket.io-client";
import InGameContext from "../context/inGameContext";

export default function Home() {
  const { login, userId } = useAuthContext();
  const { inGameContext } = useContext(InGameContext);

  useEffect(() => {
    login();
  }, []);

  
  const { surrender, move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, setInGame, result, setResult, data } = useGame();

  return (
    <div className="flex w-full h-full">
      <Chat userId={userId} />
      {result === undefined ? (
      inGame === false && inGameContext === false ? (
        <div className="w-full p-4 h-full flex items-center justify-center">
          <Play socket={socket} isUserQueued={isUserQueued} leaveQueue={leaveQueue} joinQueue={joinQueue} userId={userId} />
        </div> )
        : (
        <div className="flex flex-col justify-center flex-grow h-full w-full">
          <Surrender surrender={surrender} socket={socket as Socket} data={data}/>
          <Game
            socket={socket}
            move={move}
            stopMove={stopMove}
            launchGame={launchGame}
            leaveQueue={leaveQueue}
            joinQueue={joinQueue}
            data={data}
            userId={userId}
            result={result}
            setResult={setResult}
            setInGame={setInGame} />
        </div> )
       ) : (
      <div className="flex flex-col justify-center flex-grow h-full w-full">
          <Game
          socket={socket}
          move={move}
          stopMove={stopMove}
          launchGame={launchGame}
          leaveQueue={leaveQueue}
          joinQueue={joinQueue}
          data={data}
          userId={userId}
          result={result}
          setResult={setResult}
          setInGame={setInGame} />
      </div>
      )}
    </div>
  );
}
