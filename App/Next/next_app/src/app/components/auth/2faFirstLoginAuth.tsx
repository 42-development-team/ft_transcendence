"use client";
import React, { useState, useEffect } from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput from "./OtpInput";
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utilsFunction/isTwoFAValid";
import generateTwoFA from "./utilsFunction/generateTwoFA";
import svgImage from '../../../../public/collapse-left-svgrepo-com.svg';

const Manage2FAFirstLogin = () => {
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
		setEnableMessage('Enable 2FA');
		setCancelActive(true);
		setEnableActive(false);
		setColorCancel('bg-red');
		setColor('bg-mauve');
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

	const buttonStyle = {
		backgroundImage: `url(${svgImage})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		backgroundSize: "cover",
	}

	return (
		<div className="border-2 border-surface2 rounded-md p-4">
			<div className="flex justify-center">
				<CustomBtn 
					color={colorClick}
					id="TwoFAEButton" 
					onClick={handleEnableClick} 
					disable={enableActive}
				>
					{enableMessage}
				</CustomBtn>
				<CustomBtn
					color={colorClickCancel}
					id="Cancel2FA" 
					onClick={handleCancelClick} 
					disable={cancelActive}>Cancel
				</CustomBtn>
			</div>
			<div className="flex flex-evenly justify-center">
				<QrCodeDisplay
					imageUrl={imageUrl} 
					displayBox={displayBox}>
				</QrCodeDisplay>
				<div className="flex-col flex justify-center">
					{
						imageUrl && 
						<CustomBtn
							style={buttonStyle}
							color="bg-mauve"
							id="Refresh2FA" 
							onClick={handleRefreshClick} 
							disable={cancelActive}>
						</CustomBtn>
					}
				</div>
			</div>
				{
					displayBox &&
					<div className="flex flex-row items-center">
						{ 
							displayBox && 
							<OtpInput parentCallback={handleCallback}></OtpInput>
						}
					</div>
				}
			<div className="flex flex-col items-center">
				{ 
					displayBox &&
					<CustomBtn
						color="bg-mauve"
						id="codeSubmit" 
						disable={false} 
						onClick={handleSubmit}
					>
						Submit
					</CustomBtn> 
				}
			</div>
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