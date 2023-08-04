import { useState, useEffect } from "react";
import CustomBtn from "../CustomBtn";
import QrCodeDisplay from "./QrCodeDisplay";
import isTwoFAValid from "./utils/isTwoFAValid";
import generateTwoFA from "./utils/generateTwoFA";
import Submit2FA from "./SubmitTwoFA";
import { useEffectTimer } from "./utils/useEffectTimer";
import ButtonAnimation from "./ButtonAnimation";
import refreshImage from '../../../../public/refresh-icon-10834.svg';
import isTwoFAActive from "./utils/isTwoFAActive";

const TwoFA = ({ userId }: { userId: string }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [displayBox, setDisplayBox] = useState<Boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enableBtnText, setEnableBtnText] = useState<string>('Enable 2FA ?')
  const [cancelDisable, setCancelDisable] = useState<boolean>(true);
  const [message, setMessage] = useState('');
  const [colorClick, setColor] = useState<string>('bg-mauve');
  const [colorText, setColorText] = useState<string>('text-red-700');
  const [activTwoFA, setActivTwoFA] = useState<boolean>(false);
  const [enableBtnActivated, setEnableBtnActivated] = useState<boolean>(false);
  const [disableBtnActivated, setDisableBtnActivated] = useState<boolean>(false);
  const [colorClickCancel, setColorCancel] = useState<string>('bg-mauve');

  useEffect(() => {
    const fetchData = async () => {
      const data = await isTwoFAActive(userId);

      setActivTwoFA(data);
      setDisableBtnActivated(data);
      setEnableBtnActivated(!data);
    }
    fetchData().catch(console.error);
  }, [userId]);

  useEffectTimer(isVisible, 2600, setIsVisible);

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
			// If the API call is successful, update the component state accordingly
			setActivTwoFA(false);
			setEnableBtnActivated(true);
			setCancelDisable(true);
			setIsVisible(true);
			setDisplayBox(false);
			setImageUrl('');
			setColor('bg-mauve');
			setColorText('text-green-700');
			setEnableBtnText('Enable 2FA ?');
			setMessage("Two Factor Auth disabled");
		  } else {
			// Handle any error cases here
			console.log("Error turning off 2FA:", response.status);
		  }
		} catch (error) {
		  console.log(error);
		}
	  }

	  const handleSubmit = async () => {
		setEnableBtnActivated(false);
		setDisableBtnActivated(false);
	  
		const isValid = await isTwoFAValid(inputValue, userId, `${process.env.BACK_URL}/2fa/verifyTwoFA/`);
		if (!isValid) {
		  setIsVisible(true);
		  setColorText('text-red-700');
		  setMessage("Error: code doesn't match");
		  return;
		}
	  
		if (activTwoFA) {
		  try {
			await turnOff();
		  } catch (error) {
			console.log(error);
			return;
		  }
		} else {
		  // If 2FA is currently disabled, you can handle the logic to turn it on here.
		  // For example, you can call a function to enable 2FA and update the backend accordingly.
		  try {
			await generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/`, userId, setImageUrl);
		  } catch (error) {
			console.log(error);
			return;
		  }
		}
		
		// Update the component state based on whether 2FA is enabled or disabled after the submission
		setActivTwoFA(!activTwoFA);
		setEnableBtnActivated(!activTwoFA);
		setDisableBtnActivated(activTwoFA);
		setCancelDisable(true);
		setIsVisible(true);
		setDisplayBox(false);
		setImageUrl('');
		setColor('bg-mauve');
		setColorText('text-green-700');
		setEnableBtnText(activTwoFA ? 'Enable 2FA ?' : '2FA enabled');
		setMessage(activTwoFA ? 'Two Factor Auth disabled' : 'Two Factor Auth enabled');
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
		<div className="flex-auto flex flex-col border-2 rounded-md bg-base shadow-[0_35px_90px_-10px_rgba(0,0,0,0.7)] p-4">
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
						Disable 2FA ?
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
				<div className="ml-12 my-4 flex-shrink self-center">
					<QrCodeDisplay
						imageUrl={imageUrl}
						displayBox={displayBox}>
					</QrCodeDisplay>
				</div>
				<ButtonAnimation
					imageUrl={imageUrl}
					handleRefreshClick={handleRefreshClick}
					refreshImage={refreshImage}
					cancelActive={cancelDisable}
				/>
			</div>
				<Submit2FA 	
					displayBox={displayBox}
					handleOnKeyDown={handleOnKeyDown}
					handleSubmit={handleSubmit}
					handleCallbackData={handleCallback}
					handleCallbackEnter={handleCallbackEnter}
					isVisible={isVisible}
					message={message}
					colorText={colorText}
				>Enter 2FA code:</Submit2FA>
		</div>
	);
};

export default TwoFA;

