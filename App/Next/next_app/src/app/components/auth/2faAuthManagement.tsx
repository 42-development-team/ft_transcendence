"use client";
import React, {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'
import OtpInput
 from "./OtpInput";
const TwoFAAuthComponent = () => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [colorText, setColorText] = useState<string>('text-red-700');

	const isTwoFAValid = async () => {
		const response = await fetch(`${process.env.BACK_URL}/2fa/verifyTwoFA/mdegraeu`, {
			method: 'POST',
			body: JSON.stringify({code: inputValue}),
			headers: {
				'Content-Type': 'application/json',
			}
		});
		const data = await response.json();
		if (data)
		{
			await fetch(`${process.env.BACK_URL}/auth/jwt`, {credentials: 'include'});
			window.location.href = `${process.env.FRONT_URL}/home`;
		}
		return data;
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	}

	const handleSubmit = async () => {
		const isValid: boolean = await isTwoFAValid();
		if (!isValid)
			{
				setIsVisible(true);
				setColorText('text-red-700');
				setMessage("Error: code doesn't match");
				return ;
			}
		if (isActive) {
			setIsActive(false);
			setColorText('text-red-700');
			setMessage("Error: authentication failed");
			setIsVisible(true);
		}
		else {
			setIsActive(true);
			setColorText('text-green-400');
			setMessage("Successfuly logged-in");
			setIsVisible(true);
		}
	}
  
	const handleCallbackData = (childData: string) =>{
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
		<div className="flex flex-col">
			{
				<div className=" text-center">
					Enter 2FA Code :
					{ 
						<OtpInput parentCallbackData={handleCallbackData} parentCallbackEnter={handleCallbackEnter}></OtpInput>
					}
				</div>
			}
			<div className={` ${colorText} text-center`}>
				{isVisible && <p>{message}</p>}
			</div>
			<button
				className={`focus:ring-4 shadow-lg transform active:scale-75 transition-transform font-bold text-sm rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3`}
				id="codeSubmit"
				onKeyDown={(e) => handleOnKeyDown(e)}
				onClick={handleSubmit}
			>
				Submit
			</button> 
		</div>
	);
};

export default TwoFAAuthComponent;
