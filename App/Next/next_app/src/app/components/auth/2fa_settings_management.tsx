"use client";
import React, {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'

const Manage2FAComponent = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);

	useEffect( () => {
		isTwoFAActive();
	}, [] );

	const isTwoFAActive = async () => {
		const response = await fetch('http://localhost:4000/2fa/isTwoFAActive/aucaland'); //TODO: replace 'aucaland' by current user => create task for that
		if (!response.ok) {
			throw new Error('Failed to fetch \'isTwoFAActive');
		}
		const data = await response.json();
		setIsActive(data);
	}

	const isTwoFAValid = async () => {
		const response = await fetch('http://localhost:4000/2fa/verifyTwoFA/aucaland', {
			method: 'POST',
			body: JSON.stringify({code: inputValue}),
			headers: {
		'Content-Type': 'application/json',
		}});
		if (!response.ok) {
			throw new Error('Failed to fetch \'verifyTwoFA');
		}
		const data = await response.json();
		return data;
	}

	const handleEnableClick = async () => {
		try {
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
	
	const handleDisableClick = async () => {
		setDisplayBox(true);
		setImageUrl('');
	}

	const turnOff = async () => {
		const response = await fetch('http://localhost:4000/2fa/turn-off/aucaland');
		if (!response.ok) {
			throw new Error('Failed to fetch \'turn-off');
		}
		const data = await response.json();
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	}

	const handleSubmit = async () => {
		const isValid = await isTwoFAValid();
		if (!isValid)
			{
				setIsVisible(true);
				setMessage("Wrong code");
				return ;
			}
		if (isActive) {
			turnOff();
			setIsActive(false);
			setImageUrl('');
			setDisplayBox(false);
			setMessage("Two Factor Auth disabled");
			setIsVisible(true);
		}
		else {
			setIsActive(true);
			setDisplayBox(false);
			setMessage("Two Factor Auth enabled");
			setIsVisible(true);
		}
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
		<div>
			<CustomBtn id="TwoFAEButton" onClick={handleEnableClick} disable={isActive}>Enable 2FA</CustomBtn>
			<CustomBtn id="TwoFADButton" onClick={handleDisableClick} disable={!isActive}>Disable 2FA</CustomBtn>
			{imageUrl !== '' && <div>
				<img src={imageUrl} height="300" width="300" alt="QR Code" />
			</div> }
			{displayBox && <div className="m-4 pt-4">
				<p className="font-bold text-center">Enter 2FA Code</p>
				<input type="text" 
				className="m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none"
				value={inputValue}
				onChange={handleInputChange}/>
			</div> }
			<CustomBtn id="codeSubmit" disable={false} onClick={handleSubmit}>Submit</CustomBtn>
			<div className=" bg-gradient-to-tr from-blue text-base">
				{isVisible && <p>{message}</p>}
	  		</div>
		</div>
	);
};


export default Manage2FAComponent;
