"use client";
import {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput from "./OtpInput";
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utils/isTwoFAValid";
import generateTwoFA from "./utils/generateTwoFA";
import { useLoggedInContext } from "@/app/context/LoggedInContextProvider";
import Submit2FA from "./Submit2FA";

const Settings2faComponent = () => {

	const [imageUrl, setImageUrl] = useState<string>('');
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);
	const [isVisible, setIsVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [colorClick, setColor] = useState<string>('bg-mauve');
	const [colorText, setColorText] = useState<string>('text-red-700');
	const {userId} = useLoggedInContext();
	let userIdStorage: string | null ; //use of localstorage because all react components are reset when page is refreshed

	if ( localStorage.getItem('userId') ) {
		userIdStorage = localStorage.getItem('userId');
	}

	useEffect( () => {//on first load
		if ( userId ) {
			userIdStorage = userId;
			localStorage.setItem('userId', userId);
		}
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
			const response = await fetch(`${process.env.BACK_URL}/2fa/isTwoFAActive/${userIdStorage}`);
			const data = await response.json();
			setIsActive(data);
		} catch (error) {
			console.log(error);
		}
	}

	const handleEnableClick = async () => { //TODO: send alert to child OtpInput when twoFA refreshed (and del old input value)
		try {
			await generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/`, userIdStorage as string, setImageUrl);
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
				method: "DELETE",
				body: JSON.stringify({userId: userIdStorage as string}),
				headers: {
					'Content-Type': 'application/json',
				}
			});
		} catch (error) {
			console.log(error);
		}
	}

	const handleSubmit = async () => {
		setIsActive(false);
		const isValid = await isTwoFAValid(inputValue, userIdStorage as string, `${process.env.BACK_URL}/2fa/verifyTwoFA/`);
		if (!isValid)
		{
			setIsVisible(true);
			setColorText('text-red-700');
			setMessage("Error: code doesn't match");
			return ;
		}
		if (isActive) {
			await turnOff();
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
				<Submit2FA 	
					displayBox={displayBox}
					handleOnKeyDown={handleOnKeyDown}
					handleSubmit={handleSubmit}
					handleCallbackData={handleCallback}
					handleCallbackEnter={handleCallbackEnter}
					isVisible={isVisible}
					message={message}
					colorText={colorText}
				>Enter 2FA code:</Submit2FA>
		</div>
	);
};

export default Settings2faComponent;
