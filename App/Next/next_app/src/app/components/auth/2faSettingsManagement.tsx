"use client";
import {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput from "./OtpInput";
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utilsFunction/isTwoFAValid";
import generateTwoFA from "./utilsFunction/generateTwoFA";
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const TwoFASettingsManagement = ({userId}: {userId: RequestCookie}) => {

	const [imageUrl, setImageUrl] = useState<string>('');
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);
	const [isVisible, setIsVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [colorClick, setColor] = useState<string>('bg-mauve');
	const [colorText, setColorText] = useState<string>('text-red-700');

	useEffect( () => { //on first load
		isTwoFAActive();
	}, [] );

	useEffect(() => { //timer -> submit message
		if (isVisible) {
		  const timer = setTimeout(() => {
			setIsVisible(false);
		  }, 2600);
  
		  return () => clearTimeout(timer);
		}
	  }, [isVisible]);
	
	const isTwoFAActive = async () => {
		try {
			const response = await fetch(`${process.env.BACK_URL}/2fa/isTwoFAActive/${userId}`);
			const data = await response.json();
			setIsActive(data);
		} catch (error) {
			console.log(error);
		}
	}

	const handleEnableClick = async () => { //TODO: maybe send alert to child OtpInput when twoFA refreshed (and del old enter value)
		try {
			generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/`, userId.value, setImageUrl);
			setDisplayBox(true);
			setColor('bg-red');
		} catch (error) {
			console.log(error);
		}
	}
	
	const handleDisableClick = () => {
		setDisplayBox(true);
		setImageUrl('');
		setColor('bg-red');
	}

	const turnOff = async () => {
		try {
			const response = await fetch(`${process.env.BACK_URL}/2fa/turn-off/`, {
				method: "POST",
				body: JSON.stringify({userId: userId}),
			});
		} catch (error) {
			console.log(error);
		}
	}

	const handleSubmit = async () => {
		const isValid = await isTwoFAValid(inputValue, userId.value, `${process.env.BACK_URL}/2fa/verifyTwoFA/${userId}`);
		if (!isValid)
		{
			setIsVisible(true);
			setColorText('text-red-700');
			setMessage("Error: code doesn't match");
			return ;
		}
		if (isActive) {
			turnOff();
			setIsActive(false);
			setImageUrl('');
			setDisplayBox(false);
			setMessage("Two Factor Auth disabled");
			setIsVisible(true);
			setColor('bg-mauve');
			setColorText('text-green-700');
		}
		else {
			setIsActive(true);
			setDisplayBox(false);
			setMessage("Two Factor Auth enabled");
			setIsVisible(true);
			setColor('bg-mauve');
			setColorText('text-green-700');
		}
	}

	const handleCallback = (childData: string) =>{
		setInputValue(childData);
	}

	const handleCallbackEnter = () => {
		handleSubmit();
	}

	const handleOnKeyDown = ({key}: React.KeyboardEvent<HTMLButtonElement>) => {
		if (key === 'Enter') {
			handleSubmit();
		}
	}

	return (
		<div className="flex-auto flex flex-col border-2 rounded bg-base shadow-[0_35px_90px_-10px_rgba(0,0,0,0.7)]">
			<div className="flex justify-center mt-2">
				{
					!isActive &&
					<CustomBtn
						anim={true}
						color={colorClick}
						id="TwoFAEButton" 
						onClick={handleEnableClick} 
						disable={isActive}
					>
						Enable 2FA
					</CustomBtn>
				}
				{
					isActive &&
					<CustomBtn
						anim={true}
						color={colorClick}
						id="TwoFADButton" 
						onClick={handleDisableClick} 
						disable={!isActive}
					>
						Disable 2FA
					</CustomBtn>
				}
			</div>
			<QrCodeDisplay 
				imageUrl={imageUrl} 
				displayBox={displayBox}>
			</QrCodeDisplay>
			{ 
				displayBox && 
				<OtpInput parentCallbackData={handleCallback} parentCallbackEnter={handleCallbackEnter}></OtpInput>
			}
			<div className={` ${colorText} text-center`}>
				{
					isVisible && 
					<p>{message}</p>
				}
	  		</div>
			{ 
				displayBox &&
				<button
					className={`focus:ring-4 shadow-lg transform active:scale-75 transition-transform font-bold text-sm rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3`}
					id="codeSubmit"
					onKeyDown={(e) => handleOnKeyDown(e)}
					onClick={handleSubmit}>Submit
				</button> 
			}
		</div>
	);
};

export default TwoFASettingsManagement;
