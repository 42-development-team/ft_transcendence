"use client";
import React, { useState, useEffect } from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utils/isTwoFAValid";
import generateTwoFA from "./utils/generateTwoFA";
import refreshImage from '../../../../public/refresh-icon-10834.svg';
import { useEffectTimer } from "./utils/useEffectTimer";
import Submit2FA from "./Submit2FA";
import ButtonAnimation from "./ButtonAnimation";

const FirstLogin2faComponent = ({userId} : {userId: string}) => {

	const [imageUrl, setImageUrl] = useState<string>('');
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);
	const [enableMessage, setEnableMessage] = useState<string>('Enable 2FA');
	const [cancelActive, setCancelActive] = useState<boolean>(true);
	const [enableActive, setEnableActive] = useState<boolean>(false);
	const [isVisible, setIsVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [colorClick, setColor] = useState<string>('bg-mauve');
	const [colorClickCancel	, setColorCancel] = useState<string>('bg-mauve');
	const [colorText, setColorText] = useState<string>('text-red-700');
	const [disableMessage, setDisableMessage] = useState<string>('Disable 2FA');
	
	useEffectTimer(isVisible, 2600, setIsVisible);

	const handleEnableClick = async () => {
		await generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/`, userId, setImageUrl);
		setCancelActive(false);
		setEnableActive(true);
		setDisplayBox(true);
		setColor('bg-red');
		setColorCancel('bg-mauve');
	}

	const handleRefreshClick = () => {
		handleEnableClick();
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

	const handleSubmit = async () => {
		setEnableActive(true);
		const isValid = await isTwoFAValid(inputValue, userId, `${process.env.BACK_URL}/2fa/verifyTwoFA/` );
		if (!isValid) {
			setIsVisible(true);
			setColorText('text-red-700');
			setMessage("Error: code doesn't match");
			return;
		}
		setColorText('text-green-400');
		setImageUrl('');
		setDisplayBox(false);
		setMessage("Two Factor Auth enabled");
		setIsVisible(true);
		setCancelActive(true);
		await fetch(`${process.env.BACK_URL}/auth/jwt`, {credentials: 'include'});
	}
	
	const handleCallbackData = (childData: string) =>{ //set the code value from child 'OtpInput'
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
		<div className=" flex flex-auto flex-col bg-base border-2 shadow-[0_35px_90px_-10px_rgba(0,0,0,0.7)] rounded-md p-4">
			<div className="flex justify-center mt-2">
				{
					!enableActive &&
					<CustomBtn
						anim={true}
						color={colorClick}
						id="TwoFAEButton"
						onClick={handleEnableClick}
						disable={enableActive}
					>
						{enableMessage}
					</CustomBtn>
				}
				<CustomBtn
					anim={true}
					color={colorClickCancel}
					id="Cancel2FA" 
					onClick={handleCancelClick} 
					disable={cancelActive}>Cancel
				</CustomBtn>
			</div>
			<div className="flex flex-row justify-center ">
				<div className=" ml-12 my-4 flex-shrink self-center">
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
				handleCallbackData={handleCallbackData}
				handleCallbackEnter={handleCallbackEnter}
				isVisible={isVisible}
				message={message}
				colorText={colorText}
			></Submit2FA>
		</div>
	);
};


export default FirstLogin2faComponent;

