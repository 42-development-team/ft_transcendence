"use client";
import { ChangeEvent, useState, useEffect, useContext } from 'react';
import ValidateBtn from '../ValidateBtn';
import TwoFA from '@/app/components/auth/TwoFA';
import Avatar from '../profile/Avatar';
import UpdateAvatar from './utils/updateAvatar';
import { useRouter } from 'next/navigation';
import { isAlphanumeric } from '../utils/isAlphanumeric';
import { useEffectTimer } from './utils/useEffectTimer';
import ThemeContext from '../theme/themeContext';

const FirstLoginPageComponent = ({ userId }: { userId: string }) => {

	const [message, setMessage] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [validateEnabled, setValidateEnabled] = useState(true);
	const [redirecting, setRedirecting] = useState(false);
	const [placeHolder, setPlaceHolder] = useState('');
	const [waiting2fa, setWaiting2fa] = useState(true);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [inputUserName, setInputUserName] = useState('');
	const [wrongFormat, setWrongFormat] = useState<boolean>(false);
	const Router = useRouter();
	const { theme } = useContext(ThemeContext);
	const [textColor, setTextColor] = useState<string>(theme === "latte" ? "text-base" : "text-text");

	useEffectTimer(wrongFormat, 2600, setWrongFormat);

	useEffect(() => {
		if (theme === "latte") {
			setTextColor("text-base");
		}
		else {
			setTextColor("text-text");
		}
	}, [theme]);

	useEffect(() => {
		try {
			getUserName(userId);
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {

	}, [wrongFormat]);

	/* called on page load, set the placeholder with default username */
	const getUserName = async (userId: string) => {
		const response = await fetch(`${process.env.BACK_URL}/auth/firstLogin/getUser/${userId}`, {
			method: "GET",
		});
		const data = await response.json();
		if (data && !data.ok && data.error)
			console.log(data.error);
		setPlaceHolder(data.username);
		setInputUserName(data.username);
	}

	const redirectToHome = () => {
		setMessage("Redirecting...");
		Router.push('/home');
	}

	/* handle validate click, so username update and avagtar update in cloudinary */
	const handleClick = async () => {
		try {
			setWaiting2fa(false);
			setRedirecting(true);
			setMessage("Updating avatar/username...")
			setIsVisible(true);
			if (!wrongFormat)
				await UpdateAvatar(avatarFile, userId, setImageUrl);
			const updateData = {
				newUsername: inputUserName,
				userId: userId,
			};
			if (inputUserName !== '') {
				const usernameUpdateResponse = await fetch(`${process.env.BACK_URL}/auth/firstLogin/updateUsername`, {
					method: "PUT",
					body: JSON.stringify(updateData),
					headers: {
						"Content-Type": "application/json",
					},
				});
			}
			setMessage("Avatar/username successfully updated");
			redirectToHome();
		} catch (error) {
			console.log("Error during avatar upload or username update:", error);
		}
	};


	/* handle change of username input */
	const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
		try {
			const newinputUserName = e.target.value;
			if (newinputUserName === "") {
				setInputUserName(placeHolder);
				setValidateEnabled(true);
				setIsVisible(false);
				return;
			}
			else if (isAlphanumeric(newinputUserName) === false) {
				setMessage("Username can only contain letters and numbers");
				setValidateEnabled(false);
				setIsVisible(true);
				return;
			}
			else if (newinputUserName.length < 3 || newinputUserName.length > 15) {
				setMessage("Username must be at least 3 characters long, and at most 15 characters long");
				setValidateEnabled(false);
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
				setValidateEnabled(false);
				setIsVisible(true);
				setMessage("Username already taken");
			}
			else {
				setIsVisible(true);
				setValidateEnabled(true);
				setMessage("Username available");
				setInputUserName(newinputUserName);
			}
		} catch (error) {
			console.log(error);
		}

	}

	const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null, message: string | null) => {
		if (message !== null) {
			setWrongFormat(true);
			setImageUrl(null);
			setAvatarFile(null);
			setMessage(message);
			console.log("Error during avatar upload:", message);
			return;
		}
		console.log("Avatar successfully uploaded");
		setValidateEnabled(true);
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
				{
					validateEnabled || redirecting ?
						<div className=" text-green-400 text-center">
							{isVisible && <p>{message}</p>}
						</div>
						:
						<div className=" text-red-700 text-center ">
							{isVisible && <p>{message}</p>}
						</div>
				}
			</div>
			<Avatar
				CallbackAvatarData={handleCallBackDataFromAvatar} imageUrlGetFromCloudinary={imageUrl} disableChooseAvatar={false} disableImageResize={true} isOnProfilePage={false}>
			</Avatar>
			<div className='flex justify-center text-red-700'>
				{wrongFormat && <p>{message}</p>}
			</div>
			{
				waiting2fa &&
				<TwoFA userId={userId}></TwoFA>
			}
			<div className="flex justify-center mb-6 mt-4">
				<ValidateBtn onClick={handleClick} disable={!validateEnabled} >
					Validate
				</ValidateBtn>
			</div>
		</div>
	)
}


export default FirstLoginPageComponent;

