"use client";
import React, { useState, useEffect } from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput from "./OtpInput";
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utilsFunction/isTwoFAValid";
import generateTwoFA from "./utilsFunction/generateTwoFA";

const Manage2FAFirstLogin = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);
	const [enableMessage, setEnableMessage] = useState<string>('Enable 2FA');
	const [cancelActive, setCancelActive] = useState<boolean>(true);
	const [enableActive, setEnableActive] = useState<boolean>(false);
	const [isVisible, setIsVisible] = useState(false);
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 2100);

			return () => clearTimeout(timer);
		}
	}, [isVisible]);

	const handleEnableClick = async () => {
		generateTwoFA('http://localhost:4000/2fa/turn-on/aucaland', setImageUrl);
		setCancelActive(false);
		setEnableActive(true);
		setDisplayBox(true);
	}

	const handleRefreshClick = () => {
		handleEnableClick();
	}

	const handleCancelClick = async () => {
		setDisplayBox(false);
		setImageUrl('');
		setInputValue('');
		setEnableMessage('Enable 2FA');
		setCancelActive(true);
		setEnableActive(false);
	}

	const handleSubmit = async () => {
		const isValid = await isTwoFAValid(inputValue, 'http://localhost:4000/2fa/verifyTwoFA/aucaland');
		if (!isValid) {
			setIsVisible(true);
			setMessage("Wrong code");
			return;
		}
		setImageUrl('');
		setDisplayBox(false);
		setMessage("Two Factor Auth enabled");
		setIsVisible(true);
		window.location.href = "http://localhost:3000/home";
	}

	const handleCallback = (childData: string) =>{ //set the code value from child 'OtpInput'
		setInputValue(childData);
		console.log("childData: " + childData);
	}

	return (
		<div className="border-2 border-surface2 rounded-md p-4">
			<CustomBtn 
				id="TwoFAEButton" 
				onClick={handleEnableClick} 
				disable={enableActive}>{enableMessage}
			</CustomBtn>
			<CustomBtn
				id="Cancel2FA" 
				onClick={handleCancelClick} 
				disable={cancelActive}>Cancel
			</CustomBtn>
			<QrCodeDisplay
				imageUrl={imageUrl} 
				displayBox={displayBox}>
			</QrCodeDisplay>
			{
				imageUrl && 
				<CustomBtn 
					id="Cancel2FA" 
					onClick={handleRefreshClick} 
					disable={cancelActive}>Refresh
				</CustomBtn>}
			{
				displayBox &&
				<div className="flex flex-row items-center">
					{ 
						displayBox && 
						<OtpInput parentCallback={handleCallback}></OtpInput>
					}
					{ 
						displayBox &&
						<CustomBtn id="codeSubmit" 
						disable={false} 
						onClick={handleSubmit}>Submit</CustomBtn> 
					}
				</div>
			}
			<div className=" bg-gradient-to-tr from-blue text-base">
				{
					isVisible && 
					<p>{message}</p>
				}
			</div>
		</div>
	);
};


export default Manage2FAFirstLogin;