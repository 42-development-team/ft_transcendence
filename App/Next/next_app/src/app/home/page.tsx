"use client"

import Chat from "@/components/chat/Chat";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import Play from "../components/home/play";
import Game from "../components/game/Game";
import useGame from "../hooks/useGame";
import Result from "../components/game/result";

export default function Home() {
  const { login, userId } = useAuthContext();
  useEffect(() => {
    login();
  }, []);

	const {move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, setInGame, result, setResult, data, changeMode} = useGame();

  return (
    <div className="flex w-full h-full">
      <Chat userId={userId} />
      {inGame === false ?
        <div className="w-full p-4 h-full flex items-center justify-center">
          <Play socket={socket} isUserQueued={isUserQueued} leaveQueue={leaveQueue} joinQueue={joinQueue} userId={userId} changeMode={changeMode}/>
          <div className="relative inline-block h-4 w-8 cursor-pointer rounded-full">
							<input
								id="switch-mode"
								type="checkbox"
								className="peer absolute h-4 w-8 cursor-pointer appearance-none rounded-full bg-overlay0 transition-colors duration-300 checked:bg-pink-500 peer-checked:border-pink-500 peer-checked:before:bg-pink-500"
								onClick={changeMode}
								defaultChecked={false}
								/>
							<label
								htmlFor="switch-mode"
								className={`before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-pink-500 peer-checked:before:bg-pink-500`}
								>
                Custom Mode
							</label>
					</div>
        </div>
      :
          <Game socket={socket} move={move} stopMove={stopMove} launchGame={launchGame} leaveQueue={leaveQueue} joinQueue={joinQueue} data={data} userId={userId} result={result} setResult={setResult} setInGame={setInGame}/>
      }
    </div>
  );
}
