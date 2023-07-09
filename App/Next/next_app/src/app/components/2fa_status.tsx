"use client";
import React, {useState, useEffect} from "react";
import CustomBtn from "./CustomBtn";

const Enable2FAComponent = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [isActive, setIsActive] = useState<boolean>(false); //init boolean with db
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);

	useEffect( () => {
		isTwoFAActive();
	}, [] );

	const isTwoFAActive = async () => {
		const response = await fetch('http://localhost:4000/2fa/isTwoFAActive/dfbsurain');
		if (!response.ok) {
			throw new Error('Failed to fetch \'isTwoFAActive');
		}
		const data = await response.json();
		console.error("isActive?:" + data);
		setIsActive(data);
	}

	const isTwoFAValid = async () => {

		const response = await fetch('http://localhost:4000/2fa/verifyTwoFA/dfbsurain', {
			method: 'POST',
			body: JSON.stringify({code: inputValue}),
			headers: {
		'Content-Type': 'application/json',
		}});
		const data = await response.json();
		console.log("isValid?: " + data);
		return data;
	}

	const handleEnableClick = async () => {
		try {
			setDisplayBox(true);
			const response = await fetch('http://localhost:4000/2fa/turn-on/dfbsurain');
			const data = await response.json();
			setImageUrl(data.base64Qrcode);
		} catch (error)                                                                                                                                                                                                                                                                                                                                                                                                                 {
			console.error('Error retrieving image URL:', error);
		}
	};

	const handleDisableClick = async () => {
		try {
			setDisplayBox(true);
		}
		catch(error) {
			console.error('Error in handleDisableClick', error);
		}
	};

	const turnOff = async () => {
		const response = await fetch('http://localhost:4000/2fa/turn-off/dfbsurain');
		const data = await response.json();
		if (data.ok)
			return ;
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	}

	const handleSubmit = async () => {
		const isValid = await isTwoFAValid();
		if (!isValid)
			return ; //display error message
		if (isActive) {
			turnOff();
			setIsActive(false);
			setImageUrl('');
			setDisplayBox(false); //set message ok
		}
		else {
			setIsActive(true);
			setDisplayBox(false); //set message ok
		}
	}

	return (
		<div>
			<CustomBtn id="TwoFAEButton" onClick={handleEnableClick} disable={isActive}>Enable 2FA</CustomBtn>
			<CustomBtn id="TwoFADButton" onClick={handleDisableClick} disable={!isActive}>Disable 2FA</CustomBtn>
			{imageUrl !== '' && <img src={imageUrl} height="300" width="300" alt="QR Code" />}
			{displayBox && <div className="m-4 pt-4">
				<p className="font-bold text-center">Enter 2FA Code</p>
				<input type="text" 
				className="m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none"
				value={inputValue}
				onChange={handleInputChange}/>
			</div> }
			<CustomBtn id="codeSubmit" disable={false} onClick={handleSubmit}>Submit</CustomBtn>
		</div>
	);
};

export default Enable2FAComponent;
