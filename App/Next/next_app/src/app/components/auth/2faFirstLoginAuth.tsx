"use client";
import React, { useState, useEffect } from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'

const Manage2FAFirstLogin = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);
	const [enableMessage, setEnableMessage] = useState<string>('Enable 2FA');
	const [cancelActive, setCancelActive] = useState<boolean>(true);
	const [enableActive, setEnableActive] = useState<boolean>(false);

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

	return (
		<div className="border-2 border-surface2 rounded-md p-4">
			<CustomBtn id="TwoFAEButton" onClick={handleEnableClick} disable={enableActive}>{enableMessage}</CustomBtn>
			<CustomBtn id="Cancel2FA" onClick={handleCancelClick} disable={cancelActive}>Cancel</CustomBtn>
			{imageUrl !== '' && <div>
				<img src={imageUrl} height="300" width="300" alt="QR Code" />
			</div>}
			{imageUrl && <CustomBtn id="Cancel2FA" onClick={handleRefreshClick} disable={cancelActive}>Refresh</CustomBtn>}
			{
				displayBox &&
				<div className="flex flex-row items-center">
					<div className="m-4">
						<input type="text"
							className=" bg-base border-red  border-0  w-64 h-8 focus:outline-none"
							placeholder="Enter 2FA Code"
							value={inputValue}
							onChange={handleInputChange} />
					</div>
					<CustomBtn id="codeSubmit" disable={false} onClick={handleSubmit}>Submit</CustomBtn>
				</div>
			}

			<div className=" bg-gradient-to-tr from-blue text-base">
				{isVisible && <p>{message}</p>}
			</div>
		</div>
	);
};


export default Manage2FAFirstLogin;