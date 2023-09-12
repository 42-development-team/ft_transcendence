"use client";

import { Spinner } from '@material-tailwind/react'
import { useContext, useEffect, useState } from 'react'
import CustomBtnPlay from '../CustomBtnPlay'
import CustomBtn from '../CustomBtn'
import { join } from 'path'
import useGame from '@/app/hooks/useGame';
import Canvas from '../game/canvas';
import ThemeContext from '../theme/themeContext';

const Play = ({...props}) => {

	const [buttonText, setButtonText] = useState('Play')
	const [loading, setLoading] = useState(false)
	const [disable, setDisable] = useState(false)
	const {leaveQueue, joinQueue} = props;
	const {theme} = useContext(ThemeContext);
	const [textColor, setTextColor] = useState<string>(theme === "latte" ? "text-maroon" : "text-peach");

	useEffect(() => {
		if (theme === "latte") {
			setTextColor("text-maroon");
		}
		else {
			setTextColor("text-peach");
		}
	}, [theme]);

	const matchmaking = async () => {
		setLoading(true)
		setDisable(true)
		setButtonText("Calling racket master...")
		joinQueue();

		//TODO: handle matchmaking
	}

	const cancelMatchmaking = async () => {
		setLoading(false)
		setDisable(false)
		setButtonText("Play")
		leaveQueue();

	}

	return (
		<div className='flex flex-col '>
			<div className='flex flex-col justify-center items-center'>
				{loading? (
					<div className='flex flex-col'>
						<div className='flex flex-row justify-center'>
							<div className='flex shapes-5 text-peach' style={{ opacity: 1 }}></div>
						</div>
							<div className={`flex text-center text-[1.4rem] mt-6 italic font-extralight ` + textColor}>{buttonText}</div>
					</div>
				) : (
					<CustomBtnPlay
						disable={disable}
						onClick={matchmaking}>
						{!loading && buttonText}
					</CustomBtnPlay>
				)}
			</div>
			{loading &&
				<div className='flex flex-row justify-center'>
					<div className='flex '>
					<CustomBtnPlay onClick={cancelMatchmaking} width={110} height={60} color='bg-red-500' disable={false} anim={false}>
						Cancel
					</CustomBtnPlay>
					</div>
				</div>
			}
		</div>
	)
}

export default Play