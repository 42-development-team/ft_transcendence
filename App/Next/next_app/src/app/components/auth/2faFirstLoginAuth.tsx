"use client";
import React, { useState, useEffect } from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput from "./OtpInput";
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utilsFunction/isTwoFAValid";
import generateTwoFA from "./utilsFunction/generateTwoFA";
import refreshImage from '../../../../public/refresh-icon-10834.svg';
import Image from "next/image";

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
	const [colorText, setColorText] = useState<string>('text-red-700');

	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 2600);

			return () => clearTimeout(timer);
		}
	}, [isVisible]);

	const handleEnableClick = async () => {
		generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/mdegraeu`, setImageUrl);
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
		const isValid = await isTwoFAValid(inputValue, `${process.env.BACK_URL}/2fa/verifyTwoFA/mdegraeu`);
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
		await fetch(`${process.env.BACK_URL}/auth/jwt`, {credentials: 'include'});
		window.location.href = `${process.env.FRONT_URL}/home`;
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
				<CustomBtn
					anim={true}
					color={colorClick}
					id="TwoFAEButton" 
					onClick={handleEnableClick} 
					disable={enableActive}
				>
					{enableMessage}
				</CustomBtn>
				<CustomBtn
					anim={true}
					color={colorClickCancel}
					id="Cancel2FA" 
					onClick={handleCancelClick} 
					disable={cancelActive}>Cancel
				</CustomBtn>
			</div>
			<div className="flex flex-row justify-center ">
				<div className=" ml-12 flex-shrink self-center">
					<QrCodeDisplay
						imageUrl={imageUrl} 
						displayBox={displayBox}>
					</QrCodeDisplay>
				</div>
				<div className="self-center mt-2 duration-500">
					{
						imageUrl && 
						<button
							className="active:animate-spin  1s origin-[50%_50%]"
							color="bg-mauve"
							id="Refresh2FA" 
							onClick={handleRefreshClick} 
							disabled={cancelActive}>
							<Image src={refreshImage} 
								alt="refresh"
								width={30}
								height={30}
								className="m-2 rounded-[inherit]"  
							/>
						</button>
					}
				</div>
			</div>
				{
					displayBox &&
					<div className="flex flex-row items-center">
						{ 
							displayBox && 
							<OtpInput parentCallbackData={handleCallbackData} parentCallbackEnter={handleCallbackEnter}></OtpInput>
						}
					</div>
				}
				<div className={` ${colorText} text-center`}>
					{isVisible && <p>{message}</p>}
				</div>
			<div className=" active:duration-500 flex flex-col items-center">
				{ 
					displayBox &&
					<button
						className={`focus:ring-4 shadow-lg transform active:scale-75 transition-transform font-bold text-sm rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3`}
						id="codeSubmit"
						onKeyDown={(e) => handleOnKeyDown(e)}
						onClick={handleSubmit}
					>
						Submit
					</button> 
				}
			</div>
		</div>
	);
};


export default Manage2FAFirstLogin;