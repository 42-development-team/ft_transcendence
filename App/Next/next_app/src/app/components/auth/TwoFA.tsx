"use client";
import {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utils/isTwoFAValid";
import generateTwoFA from "./utils/generateTwoFA";
import Submit2FA from "./SubmitTwoFA";
import { useEffectTimer } from "./utils/useEffectTimer";
import ButtonAnimation from "./ButtonAnimation";
import refreshImage from '../../../../public/refresh-icon-10834.svg';
import isTwoFAActive from "./utils/isTwoFAActive";

const TwoFA = ({userId} : {userId : string}) => {

	const [imageUrl, setImageUrl] 						= useState<string>('');
	const [inputValue, setInputValue] 					= useState('');
	const [displayBox, setDisplayBox] 					= useState<Boolean>(false);
	const [isVisible, setIsVisible] 					= useState(false);
	const [enableBtnText, setEnableBtnText] 			= useState<string>('Enable 2FA ?')
	const [cancelDisable, setCancelDisable] 			= useState<boolean>(true);
	const [message, setMessage] 						= useState('');
	const [colorClick, setColor] 						= useState<string>('bg-mauve');
	const [colorText, setColorText] 					= useState<string>('text-red-700');
	const [activTwoFA, setActivTwoFA] 					= useState<boolean>(false);
	const [enableBtnActivated, setEnableBtnActivated] 	= useState<boolean>(false);
	const [disableBtnActivated, setDisableBtnActivated] = useState<boolean>(false);
	const [colorClickCancel	, setColorCancel] 			= useState<string>('bg-mauve');
	let	  userIdStorage: string | null ; //use of localstorage because all react components are reset when page is refreshed

	if ( localStorage.getItem('userId') ) {
		userIdStorage = localStorage.getItem('userId');
	}

	useEffect( () => {//on first load
		if ( userId ) {
			userIdStorage = userId;
			localStorage.setItem('userId', userId);
		}
		const fetchData = async () => {
			const data = await isTwoFAActive(userIdStorage as string);

			setActivTwoFA(data);
			setDisableBtnActivated(data);
			setEnableBtnActivated(!data);
		}
		fetchData().catch(console.error);
	}, [] );

	useEffectTimer(isVisible, 2600, setIsVisible);

	const handleEnableClick = async () => { //TODO: send alert to child OtpInput when twoFA refreshed (and del old input value)
		try {
			await generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/`, userIdStorage as string, setImageUrl);
			setDisplayBox(true);
			setCancelDisable(false);
			setEnableBtnActivated(false);
			setColor('bg-red');
		} catch (error) {
			console.log(error);
		}
	}
	
	const handleCancelClick = () => {
		if (activTwoFA)
		setDisableBtnActivated(true);
		else
			setEnableBtnActivated(true);
		setDisplayBox(false);
		setCancelDisable(true);
		setImageUrl('');
		setInputValue('');
		setColorCancel('bg-mauve');
		setColor('bg-mauve');
	}

	const handleRefreshClick = () => {
		handleEnableClick();
	}

	const handleDisableClick = () => {
		setDisplayBox(true);
		setCancelDisable(false);
		setDisableBtnActivated(false);
		setImageUrl('');
		setColor('bg-red');
		setColorCancel('bg-mauve');
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
		setEnableBtnActivated(false);
		setDisableBtnActivated(false);

		const isValid = await isTwoFAValid(inputValue, userIdStorage as string, `${process.env.BACK_URL}/2fa/verifyTwoFA/`);
		if (!isValid)
		{
			setIsVisible(true);
			setColorText('text-red-700');
			setMessage("Error: code doesn't match");
			return ;
		}

		if (activTwoFA) {
			try {
				await turnOff();
			} catch (error) {
				console.log(error);
				return ;
			}
			setEnableBtnActivated(true);
			setCancelDisable(true);
			setIsVisible(true);
			setActivTwoFA(false);
			setDisplayBox(false);
			setImageUrl('');
			setColor('bg-mauve');
			setColorText('text-green-700');
			setEnableBtnText('Enable 2FA ?');
			setMessage("Two Factor Auth disabled");
		}
		else {
			setActivTwoFA(true);
			setDisableBtnActivated(true);
			setCancelDisable(true);
			setIsVisible(true);
			setDisplayBox(false);
			setImageUrl('');
			setColor('bg-mauve');
			setColorText('text-green-700');
			setEnableBtnText('2FA enabled');
			setMessage("Two Factor Auth enabled");
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
		<div className="flex-auto flex flex-col border-2 rounded-md bg-base shadow-[0_35px_90px_-10px_rgba(0,0,0,0.7)] p-4">
			<div className="flex justify-center mt-2">
				{
					!activTwoFA &&
					<CustomBtn
						anim={true}
						color={colorClick}
						id="TwoFAEButton" 
						onClick={handleEnableClick} 
						disable={!enableBtnActivated}
					>
						{enableBtnText}
					</CustomBtn>
				}
				{
					activTwoFA &&
					<CustomBtn
						anim={true}
						color={colorClick}
						id="TwoFADButton" 
						onClick={handleDisableClick} 
						disable={!disableBtnActivated}
					>
						Disable 2FA ?
					</CustomBtn>
				}
				<CustomBtn
					anim={true}
					color={colorClickCancel}
					id="Cancel2FA"
					onClick={handleCancelClick}
					disable={cancelDisable}>Cancel
				</CustomBtn>
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
					cancelActive={cancelDisable}
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

export default TwoFA;

