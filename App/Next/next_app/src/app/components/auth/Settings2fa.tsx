"use client";
import {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utils/isTwoFAValid";
import generateTwoFA from "./utils/generateTwoFA";
import { useLoggedInContext } from "@/app/context/LoggedInContextProvider";
import Submit2FA from "./Submit2FA";
import { useEffectTimer } from "./utils/useEffectTimer";
import ButtonAnimation from "./ButtonAnimation";
import refreshImage from '../../../../public/refresh-icon-10834.svg';

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
	const [cancelActive, setCancelActive] = useState<boolean>(true);
	const [enableMessage, setEnableMessage] = useState<string>('Enable 2FA');
	const [enableActive, setEnableActive] = useState<boolean>(false);
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

	useEffectTimer(isVisible, 2600, setIsVisible);
	
	const isTwoFAActive = async () => {
		try {
			const response = await fetch(`${process.env.BACK_URL}/2fa/isTwoFAActive/${userIdStorage}`);
			const data = await response.json();
			setEnableActive(data);
		} catch (error) {
			console.log(error);
		}
	}

	const handleEnableClick = async () => { //TODO: send alert to child OtpInput when twoFA refreshed (and del old input value)
		try {
			await generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/`, userIdStorage as string, setImageUrl);
			setDisplayBox(true);
			setCancelActive(false);
			setColor('bg-red');
		} catch (error) {
			console.log(error);
		}
	}
	
	const handleCancelClick = async () => {
		setDisplayBox(false);
		setImageUrl('');
		setInputValue('');
		setEnableMessage('Enable 2FA ?');
		setCancelActive(true);
		setEnableActive(false);
		setColorCancel('bg-red');
		setColor('bg-mauve');
	}

	const handleRefreshClick = () => {
		handleEnableClick();
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
		setEnableActive(false);
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
			setEnableActive(false);
			setImageUrl('');
			setDisplayBox(false);
			setMessage("Two Factor Auth disabled");
			setIsVisible(true);
			setColor('bg-mauve');
			setColorText('text-green-700');
		}
		else {
			setEnableActive(true);
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
					!enableActive &&
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
					enableActive &&
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
			<div className="flex flex-row justify-center">
				<div className="ml-12 my-4 flex-shrink self-center">
					<QrCodeDisplay
						imageUrl={imageUrl}
						displayBox={displayBox}>
					</QrCodeDisplay>
				</div>
				<ButtonAnimation
					imageUrl={imageUrl}
					handleRefreshClick={handleRefreshClick}
					refreshImage={refreshImage}
					cancelActive={cancelActive}
				/>
			</div>
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
