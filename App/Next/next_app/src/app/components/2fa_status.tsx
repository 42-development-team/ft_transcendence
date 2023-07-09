"use client";
import React, {useState, useEffect} from "react";
import CustomBtn from "./CustomBtn";

const Enable2FAComponent = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [isActive, setIsActive] = useState<boolean>(false); //init boolean with db

	useEffect( () => {
		isTwoFAActive();
	}, [] );

	const isTwoFAActive = async () => {
		const response = await fetch('http://localhost:4000/2fa/isTwoFAActive/dfbsurain');
		const data = await response.json();
		console.error(data);
		setIsActive(data);
	}

	const handleEnableClick = async () => {
		try {
			const response = await fetch('http://localhost:4000/2fa/turn-on/dfbsurain');
			const data = await response.json();
			setImageUrl(data.base64Qrcode);
			setIsActive(true);
			// disableButton("TwoFAEButton");
			// enableButton("TwoFADButton");
		} catch (error)                                                                                                                                                                                                                                                                                                                                                                                                                 {
			console.error('Error retrieving image URL:', error);
		}
	};

	const handleDisableClick = () => {
		try {
			setIsActive(false);
			// enableButton("TwoFAEButton");
			// disableButton("TwoFADButton");
		}
		catch(error) {
			console.error('Error in handleDisableClick', error);
		}
	};

	return (
		<div>
			<CustomBtn id="TwoFAEButton" onClick={handleEnableClick} disable={isActive}>Enable 2FA</CustomBtn>
			<CustomBtn id="TwoFADButton" onClick={handleDisableClick} disable={!isActive}>Disable 2FA</CustomBtn>
			{imageUrl !== '' && <img src={imageUrl} height="300" width="300" alt="QR Code" />}
			<div className="m-4 pt-4">
				<p className="font-bold text-center">Enter 2FA Code</p>
				<input type="text" className="m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none"/>
			</div>
		</div>
	);
};

export default Enable2FAComponent;
