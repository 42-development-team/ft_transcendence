"use client";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import UpdateAvatar from "../auth/utils/updateAvatar";
import Avatar from "../profile/Avatar";
import ValidateBtn from "../ValidateBtn";
import { useEffectTimer } from "../auth/utils/useEffectTimer";
import getUserNameById from "../utils/getUserNameById";
import UpdateUsernameById from "../utils/updateUsernameById";
import DoesUserNameExist from "../utils/DoesUsernameExist";
import { useAuthContext } from "@/app/context/AuthContext";
import { isAlphanumeric } from "../utils/isAlphanumeric";
import ThemeContext from "../theme/themeContext";

const SettingsPage = ({userId}: {userId: string}) => {

	const { login } = useAuthContext();
	useEffect(() => {
	  login();
	}, []);

	const [message, setMessage] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [isVisibleTimer, setIsVisibleTimer] = useState(false);
	const [isVisibleTimerAvatar, setIsVisibleTimerAvatar] = useState(false);
	const [validateAvatarEnabled, setValidateAvatarEnabled] = useState(false);
	const [validateUsernameEnabled, setValidateUsernameEnabled] = useState(false);
	const [placeHolder, setPlaceHolder] = useState('');
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [inputUserName, setInputUserName] = useState('');
	const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false);
	const [updatedUsername, setUpdatedUsername] = useState<boolean>(false);
	const [updatingUsername, setUpdatingUsername] = useState<boolean>(false);
	const [updatingAvatar, setUpdatingAvatar] = useState<boolean>(false);
	const [wrongFormat, setWrongFormat] = useState<boolean>(false);
	const {theme} = useContext(ThemeContext);
	const [textColor, setTextColor] = useState<string>(theme === "latte" ? "text-base" : "text-text");

	useEffect(() => {
		const getAvatar = async () => {
			const response = await fetch(`${process.env.BACK_URL}/avatars/${userId}`, {
				credentials: "include",
				method: "GET",
			});
			const data = await response.json();
			setImageUrl(await data.avatar);
			setAvatarLoaded(true);
			return (data.avatar);
		}
		try {
			getUserName(userId);
			getAvatar();
		} catch (error) {
			console.log(error);
		}
	}, [avatarLoaded]);

	useEffect(() => {
		if (theme === "latte") {
			setTextColor("text-base");
		}
		else {
			setTextColor("text-text");
		}
	}, [theme]);

	useEffectTimer(isVisibleTimer, 2600, setIsVisibleTimer);
	useEffectTimer(isVisibleTimerAvatar, 2600, setIsVisibleTimerAvatar);
	useEffectTimer(updatedUsername, 2600, setUpdatedUsername);

	/* called on page load, set the placeholder with default username */
	const getUserName = async (userId: string) => {
		try {
			const username = await getUserNameById(userId);
			setPlaceHolder(username);
			setInputUserName(username);

		} catch (error) {
			console.log(error);
		}
	}

	const handleClickUsername = async () => {
		try {
			const updateData = {
				newUsername: inputUserName,
				userId: userId,
			};
			setUpdatingUsername(true);
			await UpdateUsernameById(updateData.newUsername, updateData.userId);
			setValidateUsernameEnabled(false);
			setMessage("Username updated successfully");
			setIsVisibleTimer(true);
			setUpdatingUsername(false);
			setIsVisible(false);	
			setUpdatedUsername(true);
		} catch (error) {
			setMessage("Error updating username");
			console.log("Error updating username:", error);
		}
	}

	const handleClickAvatar = async () => {
		try {
			setValidateAvatarEnabled(false);
			setUpdatingAvatar(true);
			setMessage("Updating avatar...");
			setIsVisibleTimerAvatar(true);
			if (!wrongFormat)
				await UpdateAvatar(avatarFile, userId, setImageUrl);
			setMessage("Avatar updated successfully");
			setUpdatingAvatar(false);
		} catch (error) {
			console.log("Error during avatar upload:", error);
			setMessage("Error during avatar upload");
		}
	};

	const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
		try {
			const newinputUserName = e.target.value;
			if (newinputUserName === "") {
				setInputUserName(placeHolder);
				setValidateUsernameEnabled(false);
				setIsVisible(false);
				return;
			}
			else if (isAlphanumeric(newinputUserName) === false) {
				setMessage("Username can only contain letters and numbers");
				setValidateUsernameEnabled(false);
				setIsVisible(true);
				return;
			}
			else if (newinputUserName.length < 3 || newinputUserName.length > 15) {
				setMessage("Username must be at least 3 characters long, and at most 15 characters long");
				setValidateUsernameEnabled(false);
				setIsVisible(true);
				return;
			}

			const data = await DoesUserNameExist(newinputUserName);
			const isUserAlreadyTaken = data.isUsernameTaken;
			const isUsernameSameAsCurrent = newinputUserName === placeHolder;

			if (isUserAlreadyTaken && !isUsernameSameAsCurrent) {
				setValidateUsernameEnabled(false);
				setIsVisible(true);
				setMessage("Username already taken");
			}
			else {
				setIsVisible(true);
				setValidateUsernameEnabled(true);
				setMessage("Username available");
				setInputUserName(newinputUserName);
			}
		} catch (error) {
			console.log(error);
		}

	}

	const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null, message: string | null) => {
		if (message !== null) {
			setValidateAvatarEnabled(false);
			setImageUrl(null);
			setAvatarFile(null);
			setIsVisibleTimerAvatar(true);
			setUpdatingAvatar(true);
			setWrongFormat(true);
			setMessage(message);
			console.log("Error during avatar upload:", message);
			return ;
		}
		setAvatarFile(childAvatarFile);
		setImageUrl(childImageUrl);
		setWrongFormat(false);
		if (childAvatarFile !== null && childImageUrl !== null)
			setValidateAvatarEnabled(true);
	}

	return (
		<div className="flex flex-col w-full justify-center">
			<div className="flex flex-col w-full p-4">
				<p className={`flex flex-row font-bold justify-center ` + textColor}>Choose your username</p>
				<div className="flex flex-row justify-center">
					{ !updatingUsername &&
					<input style={{ backgroundColor: "#FFFFFF", color: "#000000", padding: "10px", borderRadius: "5px", fontWeight: "bold" }}
						id="username"
						onChange={(e) => handleOnChange(e)}
						placeholder={placeHolder}
						inputMode='text'
						type="text"
						className="flex flex-row justify-center m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none"
					/>
					}
				</div>
			</div>
			<div className="flex flex-col justify-center">
				{
					validateUsernameEnabled ?
						<div className=" text-green-400 text-center mb-2">
							{isVisible && <p>{message}</p>}
						</div>
						:
						<div className=" text-red-700 text-center">
							{isVisible  && <p>{message}</p>}
						</div>
				}
				{
					!validateUsernameEnabled && updatedUsername &&
						<div className=" text-green-400 text-center mb-2">
							{isVisibleTimer && <p>{message}</p>}
						</div>
				}
				<div className="flex justify-center mt-2">
					{validateUsernameEnabled && !updatingAvatar &&
						<ValidateBtn onClick={handleClickUsername} disable={!validateUsernameEnabled} >
							Validate
						</ValidateBtn>
					}
				</div>
			</div>
			<Avatar
				CallbackAvatarData={handleCallBackDataFromAvatar} 
				imageUrlGetFromCloudinary={imageUrl}
				disableChooseAvatar={false}
				disableImageResize={true}
				isOnProfilePage={false}>
			</Avatar>
			{
				!validateAvatarEnabled && updatingAvatar && isVisibleTimerAvatar &&
				<div className=" text-green-400 text-center mb-2">
					{!wrongFormat && <p>{message}</p>}
					<div className="text-red-700">
						{ wrongFormat && <p>{message}</p> }
					</div>
				</div>
			}
			<div className="flex justify-center mb-6">
				{ !updatedUsername && validateAvatarEnabled &&
					<ValidateBtn onClick={handleClickAvatar} disable={!validateAvatarEnabled} >
						Validate
					</ValidateBtn>
				}
			</div>
		</div>
	)
}

export default SettingsPage;