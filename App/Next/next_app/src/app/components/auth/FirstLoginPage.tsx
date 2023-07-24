"use client";
import Image from 'next/image';
import CustomBtn from "@/components/CustomBtn";
import FirstLogin2faComponent from "@/components/auth/FirstLogin2fa";
import { ChangeEvent, useState, useEffect } from 'react';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// const FirstLoginPageComponent = ({userId}: {userId: RequestCookie}) => {
const FirstLoginPageComponent = ({userId}: {userId: string}) => {

    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [validateEnabled, setValidateEnabled] = useState(true);
    const [placeHolder, setPlaceHolder] = useState('');
    let inputUserName: string;

    useEffect(() => {
        try {
            // getUserName(userId.value);
            getUserName(userId);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const getUserName = async (userId: string) => {
        const response = await fetch(`${process.env.BACK_URL}/firstLogin/getUser/${userId}`, {
            method: "GET",
        });
        const data = await response.json();
        setPlaceHolder(data.username);
        inputUserName = data.username;
    }

    const redirectToHome = () => {
        if (validateEnabled) {
            setMessage("Redirecting...");
            window.location.href = `${process.env.FRONT_URL}/home`;
        }
    }

    const handleClick = async () => {
        try {
                await fetch(`${process.env.BACK_URL}/firstLogin/updateUsername/`, {
                method: "PUT",
                // body: JSON.stringify({newUsername: inputUserName, userId: userId.value}),
                body: JSON.stringify({newUsername: inputUserName, userId: userId}),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            await fetch(`${process.env.BACK_URL}/auth/jwt`, {credentials: 'include'});
            redirectToHome();
        } catch (error) {
            console.log(error);
        }
    }

    const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            inputUserName = e.target.value;
            console.log("inputValue-AfterSet: " + inputUserName);
            if (e.target.value === "") {
                setValidateEnabled(true);
                inputUserName = placeHolder;
                setIsVisible(false);
                return ;
            }
            else if (inputUserName.length < 3 || inputUserName.length > 15) {
                setMessage("Username must be at least 3 characters long, and at most 15 characters long");
                setValidateEnabled(false);
                setIsVisible(true);
                return ;
            }
            const response = await fetch(`${process.env.BACK_URL}/firstLogin/doesUserNameExist/${inputUserName}`, {
                method: "GET",
            });
            const isUserAlreadyTaken = await response.json();
            const isUsernameSameAsCurrent = inputUserName === placeHolder;
            console.log("response: " + isUserAlreadyTaken);
            if (isUserAlreadyTaken && !isUsernameSameAsCurrent) {
                setMessage("Username already taken");
                setValidateEnabled(false);
                setIsVisible(true);
            }
            else {
                setMessage("Username available");
                setIsVisible(true);
                setValidateEnabled(true);
            }
        } catch (error) { 
            console.log(error);
        }

    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="m-4 pt-4">
                <p className="font-bold text-center">Choose your username</p>
                <input
                    onChange={(e) => handleOnChange(e)}
                    placeholder={placeHolder}
                    inputMode='text'
                    type="text" 
                    className="m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none" 
                />
                {
                    validateEnabled ?
                    <div className=" text-green-400 text-center">
                        {isVisible && <p>{message}</p>}
                    </div>
                    :
                    <div className=" text-red-700 text-center">
                        {isVisible && <p>{message}</p>}
                    </div>
                }
            </div>

            <div className="m-4 flex-auto">
                <p className="font-bold mb-2">Choose your avatar</p>
                <Image
                    src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                    alt="default avatar"
                    width={128}
                    height={128}
                    className=" drop-shadow-xl"
                />
            </div>
            <div className="flex flex-col flex-auto items-center justify-center">
                <FirstLogin2faComponent userId={userId}></FirstLogin2faComponent>
            </div>
            <CustomBtn disable={!validateEnabled} onClick={handleClick}>
                Validate
            </CustomBtn>
        </div>
    )
}

export default FirstLoginPageComponent;