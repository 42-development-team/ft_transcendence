"use client"
import Chat from "@/components/chat/Chat";
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Play from "../components/home/play";
import Game from "../components/game/Game";
import useGame from "../hooks/useGame";
import InGameContext from "../context/inGameContext";
import useFriends from "@/hooks/useFriends";
import Logo from "../components/home/Logo";

export default function Home() {
	const { login, userId } = useAuthContext();
	const { inGameContext } = useContext(InGameContext);
	const [disable, setDisable] = useState(true);
	const { friends, invitedFriends, requestedFriends, addFriend, blockedUsers, blockUser, unblockUser } = useFriends();
	const { surrender, move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, setInGameContext, result, setResult, data, changeMode, mode, setMode } = useGame();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		login();
	}, []);

	return (
		<div className="flex w-full h-full">
			<Chat userId={userId} friends={friends} invitedFriends={invitedFriends} requestedFriends={requestedFriends}
				addFriend={addFriend} blockedUsers={blockedUsers} blockUser={blockUser} unblockUser={unblockUser} />
			{inGame === false && inGameContext === false ? (
				<div className="w-full p-4 h-full flex flex-col items-center justify-evenly">
					<div className="flex basis-1/6" />
					<Logo />	
					<div className="basis-1/5" />
					<div className="basis-3/6">
						<Play
							socket={socket}
							isUserQueued={isUserQueued}
							leaveQueue={leaveQueue}
							joinQueue={joinQueue}
							userId={userId}
							changeMode={changeMode}
							mode={mode}
							disabled={disable}
							setDisable={setDisable}
						/>
					</div>
				</div>
			) : (
				<div className="flex flex-col justify-center h-full w-full items-center">
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
						mode={mode}
						setMode={setMode}
					/>
				</div>
			)}
		</div>
	);
}
