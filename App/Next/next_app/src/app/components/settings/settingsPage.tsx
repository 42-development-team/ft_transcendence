"use client";

import { ChangeEvent, useEffect, useState } from "react";
import UpdateAvatar from "../auth/utils/updateAvatar";
import Avatar from "../profile/Avatar";
import ValidateBtn from "../ValidateBtn";
import { get } from "http";
import { useEffectTimer } from "../auth/utils/useEffectTimer";

const SettingsPage = ({
		userId,
		CallbackAvatarFile = () => { },
		CallbackImageUrl = () => { },
	}
	:
	{
		userId: string,
		CallbackAvatarFile?: any,
		CallbackImageUrl?: any
}) => {

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

	useEffectTimer(isVisibleTimer, 2600, setIsVisibleTimer);
	useEffectTimer(isVisibleTimerAvatar, 2600, setIsVisibleTimerAvatar);
	useEffectTimer(updatedUsername, 2600, setUpdatedUsername);

	/* called on page load, set the placeholder with default username */
	const getUserName = async (userId: string) => {
		const response = await fetch(`${process.env.BACK_URL}/auth/firstLogin/getUser/${userId}`, {
			method: "GET",
		});
		const data = await response.json();
		if (!data.ok)
			console.log(data.error);
		setPlaceHolder(data.username);
		setInputUserName(data.username);
	}

	const handleClickUsername = async () => {
		try {
			const updateData = {
				newUsername: inputUserName,
				userId: userId,
			};
			const usernameUpdateResponse = await fetch(`${process.env.BACK_URL}/auth/firstLogin/updateUsername`, {
				method: "PUT",
				body: JSON.stringify(updateData),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (usernameUpdateResponse.ok) {
				console.log("Username updated successfully");
			} else {
				console.log("Error updating username:", usernameUpdateResponse.status);
			}
			setValidateUsernameEnabled(false);
			setMessage("Username updated successfully");
			setIsVisibleTimer(true);
			setIsVisible(false);	
			setUpdatedUsername(true);
		} catch (error) {
			console.log("Error updating username:", error);
		}
	}

	const handleClickAvatar = async () => {
		try {
			setValidateAvatarEnabled(false);
			setMessage("Updating avatar...");
			setIsVisibleTimerAvatar(true);
			await UpdateAvatar(avatarFile, userId, setImageUrl);
			setMessage("Avatar updated successfully");
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
			else if (newinputUserName.length < 3 || newinputUserName.length > 15) {
				setMessage("Username must be at least 3 characters long, and at most 15 characters long");
				console.log("Username must be at least 3 characters long, and at most 15 characters long, newInput:", newinputUserName, "placeholder:", placeHolder);
				setValidateUsernameEnabled(false);
				setIsVisible(true);
				return;
			}

			const response = await fetch(`${process.env.BACK_URL}/auth/firstLogin/doesUserNameExist/${newinputUserName}`, {
				method: "GET",
			});
			const data = await response.json();
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

	const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null) => {
		setAvatarFile(childAvatarFile);
		setImageUrl(childImageUrl);
		if (childAvatarFile !== null && childImageUrl !== null)
			setValidateAvatarEnabled(true);
	}

	return (
		<div className="flex flex-col w-full justify-center">
			<div className="flex flex-col w-full p-4">
				<p className="flex flex-row font-bold justify-center">Choose your username</p>
				<div className="flex flex-row justify-center">
					<input style={{ backgroundColor: "#FFFFFF", color: "#000000", padding: "10px", borderRadius: "5px", fontWeight: "bold" }}
						id="username"
						onChange={(e) => handleOnChange(e)}
						placeholder={placeHolder}
						inputMode='text'
						type="text"
						className="flex flex-row justify-center m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none"
					/>
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
					!validateUsernameEnabled &&
						<div className=" text-green-400 text-center mb-2">
							{isVisibleTimer && <p>{message}</p>}
						</div>
				}
				<div className="flex justify-center mt-2">
					{validateUsernameEnabled &&
						<ValidateBtn onClick={handleClickUsername} disable={!validateUsernameEnabled} >
							Validate
						</ValidateBtn>
					}
				</div>
			</div>
			<Avatar
				CallbackAvatarData={handleCallBackDataFromAvatar} imageUrlGetFromCloudinary={imageUrl} disableChooseAvatar={false} disableImageResize={true}>
			</Avatar>
			{
				!validateAvatarEnabled &&
				<div className=" text-green-400 text-center mb-2">
					{isVisibleTimerAvatar && <p>{message}</p>}
				</div>
			}
			<div className="flex justify-center mb-6">
				{validateAvatarEnabled &&
					<ValidateBtn onClick={handleClickAvatar} disable={!validateAvatarEnabled} >
						Validate
					</ValidateBtn>
				}
			</div>
		</div>
	)
}

export default SettingsPage;