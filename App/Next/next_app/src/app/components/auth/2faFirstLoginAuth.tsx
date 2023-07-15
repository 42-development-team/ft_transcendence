"use client";
import React, { useState, useEffect } from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput from "./otpInput";

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

	const isTwoFAValid = async () => {
		const response = await fetch('http://localhost:4000/2fa/verifyTwoFA/aucaland', {
			method: 'POST',
			body: JSON.stringify({ code: inputValue }),
			headers: {
				'Content-Type': 'application/json',
			}
		});
		if (!response.ok) {
			throw new Error('Failed to fetch \'verifyTwoFA');
		}
		const data = await response.json();
		return data;
	}

	const handleEnableClick = async () => {
		try {
			setCancelActive(false);
			setEnableActive(true);
			setDisplayBox(true);
			const response = await fetch('http://localhost:4000/2fa/turn-on/aucaland');
			if (!response.ok) {
				throw new Error('Failed to fetch \'turn-on');
			}
			const data = await response.json();
			setImageUrl(data.base64Qrcode);
		}
		catch (error) {
			console.error('Error retrieving image URL:', error);
		}
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
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
		const isValid = await isTwoFAValid();
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
			{
				imageUrl !== '' &&  displayBox && 
				<div className=" flex justify-center">
					<img className=" rounded shadow-[0_30px_60px_-10px_rgba(0,0,0,0.69)] border-2 border-surface0" 
					placeholder={'/home/aurel/Documents/ft_transcendence/App/Next/next_app/public/logout-svgrepo-com.svg'} 
					src={imageUrl} 
					height="150" 
					width="150" 
					alt="QR Code" />
				</div> 
			}
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