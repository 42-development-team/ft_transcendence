"use client";
import {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput from "./OtpInput";
import QrCodeDisplay from "./QrCodeDisplay";

const TwoFASettingsManagement = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);
	const [isVisible, setIsVisible] = useState(false);
	const [message, setMessage] = useState('');

	useEffect( () => { //on first load
		isTwoFAActive();
	}, [] );

	useEffect(() => { //timer -> submit message
		if (isVisible) {
		  const timer = setTimeout(() => {
			setIsVisible(false);
		  }, 2100);
  
		  return () => clearTimeout(timer);
		}
	  }, [isVisible]);
	
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

	const handleEnableClick = async () => { //TODO: maybe send alert to child OtpInput when twoFA refreshed (and del old enter value)
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

	const handleCallback = (childData: string) =>{ //set the code value from child 'OtpInput'
		setInputValue(childData);
		console.log("childData: " + childData);
	}

	return (
		<div className="flex-auto flex flex-col border-2 rounded bg-base shadow-[0_35px_90px_-10px_rgba(0,0,0,0.7)]">
			<div className="flex justify-center mt-2">
				<CustomBtn 
					id="TwoFAEButton" 
					onClick={handleEnableClick} 
					disable={isActive}>Enable 2FA
				</CustomBtn>
				<CustomBtn 
					id="TwoFADButton" 
					onClick={handleDisableClick} 
					disable={!isActive}>Disable 2FA
				</CustomBtn>
			</div>
			<QrCodeDisplay 
				imageUrl={imageUrl} 
				displayBox={displayBox}>
			</QrCodeDisplay>
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
			<div className=" bg-gradient-to-tr from-blue text-base">
				{
					isVisible && 
					<p>{message}</p>
				}
	  		</div>
		</div>
	);
};


export default TwoFASettingsManagement;
