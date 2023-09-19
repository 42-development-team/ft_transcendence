"use client"
import Chat from "@/components/chat/Chat";
import { useContext, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Play from "@/components/home/play";
import Game from "@/components/game/Game";
import useGame from "@/hooks/useGame";
import InGameContext from "@/context/inGameContext";
import useFriends from "@/hooks/useFriends";

export default function Home() {
	const { login, userId } = useAuthContext();
	const { inGameContext } = useContext(InGameContext);
	const { friends, invitedFriends, requestedFriends, addFriend, blockedUsers, blockUser, unblockUser } = useFriends();

	useEffect(() => {
		login();
	}, []);

	const { surrender, move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, setInGameContext, result, setResult, data, changeMode, mode } = useGame();

	return (
		<div className="flex w-full h-full">
			<Chat userId={userId} friends={friends} invitedFriends={invitedFriends} requestedFriends={requestedFriends}
				addFriend={addFriend} blockedUsers={blockedUsers} blockUser={blockUser} unblockUser={unblockUser} />
			{inGame === false && inGameContext === false ? (
				<div className="w-full p-4 h-full flex items-center justify-center">
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
