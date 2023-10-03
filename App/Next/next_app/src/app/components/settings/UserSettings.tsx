"use client";

import { ChangeEvent, useState, useEffect, useContext, useRef } from 'react';
import ValidateBtn from '../ValidateBtn';
import { Alert } from '@material-tailwind/react';
import { AlertErrorIcon } from '../alert/AlertErrorIcon';
import { AlertSuccessIcon } from '../alert/AlertSuccessIcon';
import TwoFA from '../auth/TwoFA/TwoFA';
import Avatar from '../profile/Avatar';
import UpdateAvatar from '../auth/utils/updateAvatar';
import { useRouter } from 'next/navigation';
import { isAlphanumeric } from '../utils/isAlphanumeric';
import ThemeContext from '../theme/themeContext';
import UpdateUsernameById from '../utils/updateUsernameById';
import getUserNameById from '../utils/getUserNameById';
import getAvatarById from '../utils/getAvatarById';


const UserSettingsComponent = ({ userId, onSettings }: { userId: string, onSettings: boolean }) => {

	const [submitable, setSubmitable] = useState<boolean>(onSettings ? false : true);
	const [usernameMessage, setUsernameMessage] = useState('');
	const [AvatarMessage, setAvatarMessage] = useState('');
	const [placeHolder, setPlaceHolder] = useState('');
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [inputUserName, setInputUserName] = useState('');
	const Router = useRouter();
	const { theme } = useContext(ThemeContext);
	const [textColor, setTextColor] = useState<string>(theme === "latte" ? "text-base" : "text-text");
	let 	isUserAlreadyTaken = false;
	const [openAvatarAlert, setOpenAvatarAlert] = useState<boolean>(false);
	const [openUsernameAlert, setOpenUsernameAlert] = useState<boolean>(false);
	const [errorUsername, setErrorUsername] = useState<boolean>(false);
	const [errorAvatar, setErrorAvatar] = useState<boolean>(false);

	useEffect(() => {
		if (theme === "latte") {
			setTextColor("text-base");
		}
		else {
			setTextColor("text-text");
		}
	}, [theme]);

	const getAvatar = async (id: string) => {
		const avatar: string = await getAvatarById(id);
		setImageUrl( avatar);
	};

	useEffect(() => {
		try {
			getUserName(userId);
			getAvatar(userId);
		} catch (error) {
			console.log(error);
		}
	}, []);

	/* called on page load, set the placeholder with default username */
	const getUserName = async (userId: string) => {
		const username = await getUserNameById(userId);
		if (username === undefined) {
			console.log("Error fetching username");
			return;
		}
		setPlaceHolder(username);
		setInputUserName(username);
	}

	const redirectOrReload = async () => {
		setOpenUsernameAlert(false);
		if (!onSettings) {
			await fetch(`${process.env.BACK_URL}/auth/jwt`, { credentials: 'include', method: "GET" });
			setAlert("Redirecting ..", true, false, true, false);
			Router.push('/home');
		}
		else {
			await getUserName(userId);
		}
	}

	const setAlert = async (message: string, error: boolean, keepVisible: boolean, avatar: boolean, username: boolean) => {
		if (avatar) {
			setOpenAvatarAlert(false);
			setErrorAvatar(error);
			if (!errorUsername)
				setSubmitable(true);
			else
				setSubmitable(false);
			setAvatarMessage(message);
			setOpenAvatarAlert(true);
			if (!keepVisible) {
				setTimeout(() => {
					setAvatarMessage('');
					setOpenAvatarAlert(false);
				}, 3500);
			}
		}
		if (username) {
			setOpenUsernameAlert(false);
			setUsernameMessage(message);
			setErrorUsername(error);
			if (error)
				setSubmitable(false);
			else
				setSubmitable(true);
			setOpenUsernameAlert(true);
			if (!keepVisible) {
				setTimeout(() => {
					setUsernameMessage('');
					setOpenUsernameAlert(false);
				}, 3500);
			}
		}
	}

	/* handle validate click, so username update and avatar update in cloudinary */
	const handleClick = async () => {
		try {
			setSubmitable(false);
			if (isUserAlreadyTaken) {
				setAlert("Username already taken", true, true, false, true);
				return;
			}
			setAlert("Updating username/avatar...", false, false, true, false)
			if (!errorAvatar)
				await UpdateAvatar(avatarFile, userId, setImageUrl);
			const updateData = {
				newUsername: inputUserName,
				userId: userId,
			};
			if (inputUserName !== '') {
				await UpdateUsernameById(updateData.newUsername, updateData.userId);
			}
			setAlert("Username/avatar updated successfully", false, false, true, false);
			await redirectOrReload();
			setSubmitable(false);
		} catch (error) {
			console.log("Error during avatar upload or username update:", error);
		}
	};


	/* handle change of username input */
	const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
		try {
			const newinputUserName = e.target.value;
			if (newinputUserName === "") {
				setSubmitable(true);
				setOpenUsernameAlert(false);
				setInputUserName(placeHolder);
				return;
			}
			else if (isAlphanumeric(newinputUserName) === false) {
				setAlert("Username can only contain letters and numbers", true, true, false, true);
				return;
			}
			else if (newinputUserName.length < 3 || newinputUserName.length > 15) {
				setAlert("Username must be at least 3 characters long, and at most 15 characters long", true, true, false, true);
				return;
			}

			const response = await fetch(`${process.env.BACK_URL}/auth/doesUserNameExist/${newinputUserName}`, {
				credentials: "include",
				method: "GET",
			});
			const data = await response.json();
			isUserAlreadyTaken = (data.isUsernameTaken);
			const isUsernameSameAsCurrent = newinputUserName === placeHolder;

			if (isUserAlreadyTaken && !isUsernameSameAsCurrent) {
				setAlert("Username already taken", true, true, false, true);
			}
			else {
				setInputUserName(newinputUserName);
				setAlert("Username available", false, true, false, true);
			}
		} catch (error) {
			console.log(error);
		}

	}

	const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null, message: string | null) => {
		if (message !== null) {
			setImageUrl(null);
			setAvatarFile(null);
			setAlert(message, true, false, true, false);
			return;
		}
		setAlert("Ready to be uploaded", false, false, true, false)
		setAvatarFile(childAvatarFile);
		setImageUrl(childImageUrl);
	}

	return (
		<div className="flex flex-col items-center ">
			<div className="flex flex-col m-4 pt-4 ">
				<p className={`font-bold text-center ` + textColor}>Choose your username</p>
				<div className='flex justify-center'>
					<input style={{ backgroundColor: "#FFFFFF", color: "#000000", padding: "10px", borderRadius: "5px", fontWeight: "bold" }}
						id="username"
						onChange={(e) => handleOnChange(e)}
						placeholder={placeHolder}
						inputMode='text'
						type="text"
						className=" m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none"
					/>
				</div>
				<Alert
					className='mb-4 mt-4 p-2 text-text text-center border-mauve border-[1px] break-all justify-center'
					variant='gradient'
					open={openUsernameAlert}
					icon={errorUsername ? <AlertErrorIcon /> : <AlertSuccessIcon />}
					animate={{
						mount: { y: 0 },
						unmount: { y: 100 },
					}}>
					{usernameMessage}
				</Alert>
			</div>
			<Avatar
				CallbackAvatarData={handleCallBackDataFromAvatar} imageUrlGetFromCloudinary={imageUrl} disableChooseAvatar={false} isOnProfilePage={false}>
			</Avatar>
			<Alert
				className='mb-4 mt-4 p-2 text-text text-center border-mauve border-[1px] break-all w-[60%] justify-center'
				variant='gradient'
				open={openAvatarAlert}
				icon={errorAvatar ? <AlertErrorIcon /> : <AlertSuccessIcon />}
				animate={{
					mount: { y: 0 },
					unmount: { y: 100 },
				}}>
				{AvatarMessage}
			</Alert>
			{
				<TwoFA userId={userId}></TwoFA>
			}
			<div className="flex justify-center mb-6 mt-4 ">
				{((onSettings && submitable) || (!onSettings)) &&
					<ValidateBtn onClick={handleClick} disable={!submitable} >
						Validate
					</ValidateBtn>
				}
			</div>
		</div>
	)
}


export default UserSettingsComponent;

