"use client"

import Chat from "@/components/chat/Chat";
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Play from "../components/home/play";
import Game from "../components/game/Game";
import useGame from "../hooks/useGame";
import InGameContext from "../context/inGameContext";
import themeContext from "../components/theme/themeContext";
import useFriends from "@/hooks/useFriends";
import Logo from "../components/home/Logo";

export default function Home() {
	const { login, userId } = useAuthContext();
	const { inGameContext } = useContext(InGameContext);
	const { friends, invitedFriends, requestedFriends, addFriend, blockedUsers, blockUser, unblockUser } = useFriends();
	const { theme } = useContext(themeContext);
	let storage = typeof window !== "undefined" ? localStorage.getItem("theme") : "mocha";
	const [colorText, setColorText] = useState<string>(storage === "latte" ? "text-[#e7a446]" : "text-[#f0f471]");
	const [neonColor, setNeonColor] = useState<string>(storage === "latte" ? "#e7a446" : "#0073e6");
	// const [loading, setLoading] = useState<boolean>(true);
	// const [pSpace, setPSpace] = useState<number>(-15);

	useEffect(() => {
		if (theme === "latte") {
			setColorText("text-[#e7a446]");
			setNeonColor("#ea76cb");
		} else {
			setColorText("text-[#e7a446]");
			setNeonColor("#cba6f9");
		}
	}, [theme]);

	// const handleResize = async () => {
	// 	if (window.innerWidth < 1000)
	// 		setPSpace(-15);
	// 	else {
	// 		setPSpace(-35);
	// 	}
	// }

	useEffect(() => {
		if (typeof window === 'undefined') return;
		// handleResize();
		login();
		// handleResize();
	}, []);

	const { surrender, move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, setInGameContext, result, setResult, data, changeMode, mode } = useGame();

	return (
		<div className="flex w-full h-full">
			<Chat userId={userId} friends={friends} invitedFriends={invitedFriends} requestedFriends={requestedFriends}
				addFriend={addFriend} blockedUsers={blockedUsers} blockUser={blockUser} unblockUser={unblockUser} />
			{inGame === false && inGameContext === false ? (
				<div className="w-full p-4 h-full flex flex-col items-center justify-evenly">
					<div className="flex basis-1/6" />
					<Logo colorText={colorText} neonColor={neonColor} />	
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
						mode={mode}
					/>
				</div>
			)}
		</div>
	);
}
