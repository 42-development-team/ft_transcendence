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

export default function Home() {
	const { login, userId } = useAuthContext();
	const { inGameContext } = useContext(InGameContext);
	const { friends, invitedFriends, requestedFriends, addFriend, blockedUsers, blockUser, unblockUser } = useFriends();
	const [fontSize, setFontSize] = useState<number>(typeof window !== 'undefined' ? window.innerWidth / 8.5 : 80);
	const { theme } = useContext(themeContext);
	let storage = typeof window !== "undefined" ? localStorage.getItem("theme") : "mocha";
	const [colorText, setColorText] = useState<string>(storage === "latte" ? "text-[#e7a446]" : "text-[#f0f471]");
	const [neonColor, setNeonColor] = useState<string>(storage === "latte" ? "#e7a446" : "#0073e6");
	const [pSpace, setPSpace] = useState<number>(-15);

	if (typeof window !== "undefined") {
		window.addEventListener('resize', () => {
			setFontSize(Math.max(window.innerWidth / 8.5, 80));
			if (window.innerWidth < 1000)
				setPSpace(-15);
			else {
				setPSpace(-35);
			}
		});
	}

	useEffect(() => {
		if (theme === "latte") {
			setColorText("text-[#e7a446]");
			setNeonColor("#ea76cb");
		} else {
			setColorText("text-[#e7a446]");
			setNeonColor("#cba6f9");
		}
	}, [theme]);

	useEffect(() => {
		if (typeof window === 'undefined')
			setFontSize(80);
		else {
			setFontSize(Math.max((window.innerWidth / 8.5), 80));
			if (window.innerWidth < 1000)
				setPSpace(-15);
			else {
				setPSpace(-35);
			}
		}
	}, [window]);

	useEffect(() => {
		login();
	}, []);

	const { surrender, move, stopMove, leaveQueue, joinQueue, isUserQueued, launchGame, socket, inGame, setInGameContext, result, setResult, data, changeMode, mode } = useGame();

	return (
		<div className="flex w-full h-full">
			<Chat userId={userId} friends={friends} invitedFriends={invitedFriends} requestedFriends={requestedFriends}
				addFriend={addFriend} blockedUsers={blockedUsers} blockUser={blockUser} unblockUser={unblockUser} />
			{inGame === false && inGameContext === false ? (
				<div className="w-full p-4 h-full flex flex-col items-center justify-evenly">
					<div className="flex basis-1/6" />
					<div
						className={`flex cyber pointer-events-none ` + colorText}
						style={{
							fontSize: fontSize + 'px',
							fontFamily: "Cy",
							textShadow: `0 0 35px black ,4px 4px 10px black, 0 0 15px ${neonColor}, 0 0 20px ${neonColor}, 0 0 25px ${neonColor}, 0 0 30px ${neonColor}`,
							userSelect: "none",
						}}>
						<span style={{ letterSpacing: pSpace + 'px' }}>P</span>ONG
					</div>
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
					/>
				</div>
			)}
		</div>
	);
}
