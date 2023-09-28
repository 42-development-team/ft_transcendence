"use client";

import { useContext, useEffect, useState } from 'react'
import CustomBtnPlay from '../CustomBtnPlay'
import ThemeContext from '../theme/themeContext';
import LoadingContext from '@/app/context/LoadingContext';
import GameInviteContext from '@/app/context/GameInviteContext';

const Play = ({...props}) => {

	const [buttonText, setButtonText] = useState('Play')
	const [loading, setLoading] = useState(false)
	const [disable, setDisable] = useState(true)
	const {leaveQueue, joinQueue, isUserQueued, userId, socket, changeMode, mode} = props;
	const {theme} = useContext(ThemeContext);
	const [textColor, setTextColor] = useState<string>(theme === "latte" ? "text-maroon" : "text-peach");
	const [userAlreadyQueued, setUserAlreadyQueued] = useState<boolean>(false);
	const {gameLoading, setGameLoading} = useContext(LoadingContext);
	const { inviteQueued } = useContext(GameInviteContext);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		socket?.on('isQueued', () => {
			setUserAlreadyQueued(true);
			setGameLoading(true);
		});
		socket?.on('isNotQueued', () => {
			setUserAlreadyQueued(false);
			setGameLoading(false);
		}
		);
	}, [socket]);

		useEffect(() => {
		if (inviteQueued === true || gameLoading === true) {
			setDisable(true);
		} else {
			setDisable(false);
		}
		console.log("inviteQueued: ", inviteQueued);
	}, [inviteQueued || gameLoading]);

	useEffect(() => {
		if (theme === "latte") {
			setTextColor("text-maroon");
		}
		else {
			setTextColor("text-peach");
		}
	}, [theme]);

	useEffect(() => {
		if (loading || userAlreadyQueued) {
			setButtonText("Cancel")
		}
		else {
			setButtonText("Play")
		}
	}, [loading, userAlreadyQueued])

	const matchmaking = async () => {
		setLoading(true)
		setUserAlreadyQueued(true);
		setDisable(true)
		setGameLoading(true);
		await joinQueue();
	}

	const cancelMatchmaking = async () => {
		setLoading(false)
		setUserAlreadyQueued(false);
		setDisable(false)
		setGameLoading(false);
		setButtonText("Play")
		await leaveQueue();
	}

	return (
		<div className='flex flex-col '>
			<div className='flex flex-col justify-center items-center'>
				{loading || userAlreadyQueued ? (
					<div className='flex flex-col'>
						<div className='flex flex-row justify-center'>
							<div className='flex shapes-5 text-peach' style={{ opacity: 1 }}></div>
						</div>
							<div className={`flex text-center text-[1.4rem] mt-6 italic font-extralight ` + textColor}>Queue up...</div>
					</div>
				) : (
					<CustomBtnPlay
					disable={disable}
					onClick={matchmaking}
					fontFam='Cy'
					changeMode={changeMode}
					mode={mode}
					>
						{!loading && buttonText}
					</CustomBtnPlay>
					
				)}
			</div>
			{(loading || userAlreadyQueued) &&
				<div className='flex flex-row justify-center'>
					<div className='flex '>
					<CustomBtnPlay onClick={cancelMatchmaking} width={110} height={60} color='bg-red-500' disable={false} anim={false}>
						{buttonText}
					</CustomBtnPlay>
					</div>
				</div>
			}
		</div>
	)
}

export default Play