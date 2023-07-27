"use client";
import React, {useState} from "react";
import '../../globals.css'
import OtpInput from "./OtpInput";
import isTwoFAValid from "./utils/isTwoFAValid";
import SubmitBtn from "./SubmitBtn";
 
const Auth2faComponent = ({userId}: {userId: string}) => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [colorText, setColorText] = useState<string>('text-red-700');

	const handleSubmit = async () => {
		
		const isValid = await isTwoFAValid( inputValue, userId, `${process.env.BACK_URL}/2fa/verifyTwoFA/` );
		if (!isValid){
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
			await fetch(`${process.env.BACK_URL}/auth/jwt`, {credentials: 'include'});
			window.location.href = `${process.env.FRONT_URL}/home`;
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
			<SubmitBtn handleOnKeyDown={handleOnKeyDown} handleSubmit={handleSubmit} displayBox={true}>Submit</SubmitBtn>
		</div>
	);
};

export default Auth2faComponent;
