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

	useEffect(() => {
	  if (isVisible) {
		const timer = setTimeout(() => {
		  setIsVisible(false);
		}, 2600);

		return () => clearTimeout(timer);
	  }
	}, [isVisible]);

	const isTwoFAValid = async () => {
		const response = await fetch(`${process.env.BACK_URL}/2fa/verifyTwoFA/mdegraeu`, {
			method: 'POST',
			body: JSON.stringify({code: inputValue}),
			headers: {
		'Content-Type': 'application/json',
		}});
		const data = await response.json();
		if (data)
		{
			await fetch(`${process.env.BACK_URL}/auth/jwt`, {credentials: 'include'});
			window.location.href = `${process.env.FRONT_URL}/home`;
		}
		console.log("isValid?: " + data);
		return data;
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	}

	const handleSubmit = async () => {
		const isValid = await isTwoFAValid();
		if (!isValid)
			{
				setIsVisible(true);
				setMessage("Error: code doesn't match");
				return ;
			}
		if (isActive) {
			setIsActive(false);
			setMessage("Error: authentication failed");
			setIsVisible(true);
		}
		else {
			setIsActive(true);
			setMessage("Successfuly logged-in");
			setIsVisible(true);
		}
	}
  
	const handleCallback = (childData: string) =>{
		setInputValue(childData);
		console.log("childData: " + childData);
	}

	return (
		<div className="flex flex-col">
			{
				<div className=" text-center">
					Enter 2FA Code :
					{ 
						<OtpInput parentCallback={handleCallback}></OtpInput>
					}
				</div>
			}
			<div className=" text-red-700 text-center">
				{isVisible && <p>{message}</p>}
	  		</div>
			<CustomBtn
				anim={true}
				color="bg-mauve"
				id="codeSubmit" 
				disable={false} 
				onClick={handleSubmit}>Submit
			</CustomBtn>
		</div>
	);
};

export default TwoFAAuthComponent;
