import { Spinner } from '@material-tailwind/react'
import { useState } from 'react'
import CustomBtnPlay from '../CustomBtnPlay'
import CustomBtn from '../CustomBtn'
import { join } from 'path'

const Play = () => {

	const [buttonText, setButtonText] = useState('Play')
	const [loading, setLoading] = useState(false)
	const [disable, setDisable] = useState(false)

	const matchmaking = async () => {
		setLoading(true)
		setDisable(true)
		setButtonText("Calling racket master...")

		//TODO: handle matchmaking
	}

	const cancelMatchmaking = async () => {
		setLoading(false)
		setDisable(false)
		setButtonText("Play")
	}

	return (
		<div className='flex flex-col '>
			<div className='flex flex-col justify-center items-center'>
				{loading ? (
					<div className='flex flex-col'>
						<div className='flex flex-row justify-center'>
							<div className='flex shapes-5 ' style={{ opacity: 1 }}></div>
						</div>
							<div className='flex text-center text-[1.4rem] mt-6 italic font-extralight'>{buttonText}</div>
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
						X
					</CustomBtnPlay>
					</div>
				</div>
			}
		</div>
	)
}

export default Play