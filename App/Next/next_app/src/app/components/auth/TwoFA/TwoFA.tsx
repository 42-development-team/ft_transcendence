"use client";

import { useState, useEffect } from "react";
import CustomBtn from "../../CustomBtn";
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./isTwoFAValid";
import generateTwoFA from "./generateTwoFA";
import Submit2FA from "./SubmitTwoFA";
import { useEffectTimer } from "../utils/useEffectTimer";
import ButtonAnimation from "../ButtonAnimation";
import refreshImage from "../../../../../public/refresh-icon-10834.svg";
import isTwoFAActive from "./isTwoFAActive";

const TwoFA = ({ userId }: { userId: string }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [displayBox, setDisplayBox] = useState<Boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enableBtnText, setEnableBtnText] = useState<string>('Enable 2FA?')
  const [cancelDisable, setCancelDisable] = useState<boolean>(true);
  const [message, setMessage] = useState('');
  const [colorClick, setColor] = useState<string>('bg-mauve');
  const [error, setError] = useState<boolean>(false);
  const [activTwoFA, setActivTwoFA] = useState<boolean>(false);
  const [enableBtnActivated, setEnableBtnActivated] = useState<boolean>(false);
  const [disableBtnActivated, setDisableBtnActivated] = useState<boolean>(false);
  const [colorClickCancel, setColorCancel] = useState<string>('bg-mauve');
  const [disable2FA, setDisable2FA] = useState<boolean>(false);
  const [refreshDisabled, setRefreshDisabled] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await isTwoFAActive(userId);

	  if (!displayBox) {

		  setActivTwoFA(data);
		  setDisableBtnActivated(data);
		  setEnableBtnActivated(!data);
	  }
    }
    fetchData().catch(console.error);
  }, [userId, isVisible]);

  useEffectTimer(isVisible, 2600, setIsVisible);
  useEffectTimer(disable2FA, 2600, setDisable2FA);

  const handleEnableClick = async () => {
    try {
      await generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/`, userId, setImageUrl);
      setDisplayBox(true);
      setCancelDisable(false);
      setEnableBtnActivated(false);
      setColor('bg-red');
    } catch (error) {
      console.log(error);
    }
  }
	
	const handleCancelClick = () => {
		if (activTwoFA)
			setDisableBtnActivated(true);
		else
			setEnableBtnActivated(true);
		setDisplayBox(false);
		setCancelDisable(true);
		setImageUrl('');
		setInputValue('');
		setColorCancel('bg-mauve');
		setColor('bg-mauve');
	}

	const handleRefreshClick = () => {
		handleEnableClick();
	}

	const handleDisableClick = () => {
		setDisplayBox(true);
		setCancelDisable(false);
		setDisableBtnActivated(false);
		setImageUrl('');
		setColor('bg-red');
		setColorCancel('bg-mauve');
	}

	const turnOff = async () => {
		try {
		  const response = await fetch(`${process.env.BACK_URL}/2fa/turn-off/`, {
			method: "DELETE",
			body: JSON.stringify({ userId }),
			headers: {
			  'Content-Type': 'application/json',
			}
		  });
	  
		  if (response.ok) {
			setActivTwoFA(false);
			setEnableBtnActivated(true);
			setCancelDisable(true);
			setMessage("Two Factor Auth disabled");
			setError(false);
			setIsVisible(true);
			setDisplayBox(false);
			setImageUrl('');
			setColor('bg-mauve');
			setEnableBtnText('Enable 2FA?');
		  } else {
			console.log("Error turning off 2FA:", response.status);
		  }
		} catch (error) {
		  console.log(error);
		}
	  }

	  const handleSubmit = async () => {
		setEnableBtnActivated(false);
		setDisableBtnActivated(false);
		setDisable2FA(true);
		setRefreshDisabled(true);
	  
		const isValid = await isTwoFAValid(inputValue, userId, `${process.env.BACK_URL}/2fa/verifyTwoFA/`);
		setInputValue('');
		if (!isValid) {
			setError(true)
		  setIsVisible(true);
		  setMessage("Error: code doesn't match");
		  setRefreshDisabled(false);
		  return;
		}

		if (activTwoFA) {
		  try {
			await turnOff();
			
		  } catch (error) {
			console.log(error);
			setRefreshDisabled(false);
			return;
		  }
		}
		
		setActivTwoFA(!activTwoFA);
		setEnableBtnActivated(!activTwoFA);
		setDisableBtnActivated(activTwoFA);
		setCancelDisable(true);
		setMessage(activTwoFA ? 'Two Factor Auth disabled' : 'Two Factor Auth enabled');
		setError(false);
		setIsVisible(true);
		setDisplayBox(false);
		setImageUrl('');
		setColor('bg-mauve');
		setEnableBtnText(activTwoFA ? 'Enable 2FA ' : '2FA enabled');
		setRefreshDisabled(false);
	  }

	const handleCallback = (childData: string) =>{
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
		<div className="flex flex-col border-0 rounded-md bg-opacity-50 bg-base shadow-[0_35px_90px_-10px_rgba(0,0,0,0.25)]">
			<div className="flex justify-center mt-2">
				{
					!activTwoFA &&
					<CustomBtn
						anim={true}
						color={colorClick}
						id="TwoFAEButton" 
						onClick={handleEnableClick} 
						disable={!enableBtnActivated}
					>
						{enableBtnText}
					</CustomBtn>
				}
				{
					activTwoFA &&
					<CustomBtn
						anim={true}
						color={colorClick}
						id="TwoFADButton" 
						onClick={handleDisableClick} 
						disable={!disableBtnActivated}
					>
						Disable 2FA 
					</CustomBtn>
				}
				<CustomBtn
					anim={true}
					color={colorClickCancel}
					id="Cancel2FA"
					onClick={handleCancelClick}
					disable={cancelDisable}>Cancel
				</CustomBtn>
			</div>
			<div className="flex flex-row justify-center">
				<div className="ml-12 self-center">
					<QrCodeDisplay
						imageUrl={imageUrl}
						displayBox={displayBox}>
					</QrCodeDisplay>
				</div>
				<ButtonAnimation
					imageUrl={imageUrl}
					handleRefreshClick={handleRefreshClick}
					refreshImage={refreshImage}
					disable={refreshDisabled}
				/>
			</div>
				<Submit2FA 	
					displayBox={displayBox}
					disabled={disable2FA}
					handleOnKeyDown={handleOnKeyDown}
					handleSubmit={handleSubmit}
					handleCallbackData={handleCallback}
					handleCallbackEnter={handleCallbackEnter}
					isVisible={isVisible}
					message={message}
					error
				>
					Enter 2FA code:
				</Submit2FA>
		</div>
	);
};

export default TwoFA;

