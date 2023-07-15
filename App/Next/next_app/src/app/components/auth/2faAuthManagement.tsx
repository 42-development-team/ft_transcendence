"use client";
import React, {useState, useEffect} from "react";
import CustomBtn from "../CustomBtn";
import '../../globals.css'

const TwoFAAuthComponent = () => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState('');
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

	const isTwoFAValid = async () => {
		const response = await fetch('http://localhost:4000/2fa/verifyTwoFA/aucaland', {
			method: 'POST',
			body: JSON.stringify({code: inputValue}),
			headers: {
		'Content-Type': 'application/json',
		}});
		const data = await response.json();
		if (data)
			window.location.href = "http://localhost:3000/home";
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
  
	return (
		<div>
			{
				<div className="m-4 pt-4">
					<p className="font-bold text-center">Enter 2FA Code</p>
					<input type="text" 
					className="m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none"
					value={inputValue}
					onChange={handleInputChange}/>
				</div> 
			}
			<CustomBtn
				color="bg-yellow"
				id="codeSubmit" 
				disable={false} 
				onClick={handleSubmit}>Submit
			</CustomBtn>
			<div className=" bg-gradient-to-tr from-blue text-base">
				{isVisible && <p>{message}</p>}
	  		</div>
		</div>
	);
};

export default TwoFAAuthComponent;
