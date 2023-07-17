"use client";
import {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput from "./OtpInput";
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utilsFunction/isTwoFAValid";
import generateTwoFA from "./utilsFunction/generateTwoFA";

const TwoFASettingsManagement = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState('');
	const [displayBox, setDisplayBox] = useState<Boolean>(false);
	const [isVisible, setIsVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [colorClick, setColor] = useState<string>('bg-mauve');

	useEffect( () => { //on first load
		isTwoFAActive();
	}, [] );

	useEffect(() => { //timer -> submit message
		if (isVisible) {
		  const timer = setTimeout(() => {
			setIsVisible(false);
		  }, 2600);
  
		  return () => clearTimeout(timer);
		}
	  }, [isVisible]);
	
	const isTwoFAActive = async () => {
		const response = await fetch('http://localhost:4000/2fa/isTwoFAActive/cpalusze'); //TODO: replace 'aucaland' by current user => create task for that
		if (!response.ok) {
			throw new Error('Failed to fetch \'isTwoFAActive');
		}
		const data = await response.json();
		setIsActive(data);
		console.log(isActive);
	}

	const handleEnableClick = async () => { //TODO: maybe send alert to child OtpInput when twoFA refreshed (and del old enter value)
		generateTwoFA('http://localhost:4000/2fa/turn-on/cpaluszse', setImageUrl);
		setDisplayBox(true);
		setColor('bg-red');
	}
	
	const handleDisableClick = () => {
		setDisplayBox(true);
		setImageUrl('');
		setColor('bg-red');
	}

	const turnOff = async () => {
		const response = await fetch('http://localhost:4000/2fa/turn-off/cpalusze');
		if (!response.ok) {
			throw new Error('Failed to fetch \'turn-off');
		}
	}

	const handleSubmit = async () => {
		const isValid = await isTwoFAValid(inputValue, 'http://localhost:4000/2fa/verifyTwoFA/cpalusze');
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
			setColor('bg-mauve');
		}
		else {
			setIsActive(true);
			setDisplayBox(false);
			setMessage("Two Factor Auth enabled");
			setIsVisible(true);
			setColor('bg-mauve');
		}
	}

	const handleCallback = (childData: string) =>{
		setInputValue(childData);
		console.log("childData: " + childData);
	}

	return (
		<div className="flex-auto flex flex-col border-2 rounded bg-base shadow-[0_35px_90px_-10px_rgba(0,0,0,0.7)]">
			<div className="flex justify-center mt-2">
				{
					!isActive &&
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
					isActive &&
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
			<QrCodeDisplay 
				imageUrl={imageUrl} 
				displayBox={displayBox}>
			</QrCodeDisplay>
			{ 
				displayBox && 
				<OtpInput parentCallback={handleCallback}></OtpInput>
			}
			<div className=" text-center text-red-700">
				{
					isVisible && 
					<p>{message}</p>
				}
	  		</div>
			{ 
				displayBox &&
				<CustomBtn
					anim={true}
					color="bg-mauve"
					id="codeSubmit" 
					disable={false} 
					onClick={handleSubmit}>Submit
				</CustomBtn> 
			}
		</div>
	);
};


export default TwoFASettingsManagement;
