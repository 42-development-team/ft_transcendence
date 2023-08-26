import { Spinner } from '@material-tailwind/react'
import { useState } from 'react'
import CustomBtnPlay from '../CustomBtnPlay'

const Play = () => {

  const [buttonText, setButtonText] = useState('Play')
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)

  const matchmaking = async () => {
	setLoading(true)
	setDisable(true)
	setButtonText("")
	//TODO: handle matchmaking

  }

	return (
	<div className='flex flex-row '>
		<div className='flex flex-col justify-center items-center'>
			<CustomBtnPlay
				disable={disable}
				onClick={matchmaking}>
					{buttonText}
					{loading &&
					<div className='flex flex-row justify-center shapes-5 ' style={{opacity: 1}}>

					</div>}
			</CustomBtnPlay>
		</div>
	</div>
  )
}

export default Play