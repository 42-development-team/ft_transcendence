"use client";
import Image from 'next/image';
import CustomBtn from "@/components/CustomBtn";
import Manage2FAFirstLogin from "@/components/auth/2faFirstLoginAuth";
import { ChangeEvent, useState, useEffect } from 'react';

export default function FirstLogin() {

    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [validateEnabled, setValidateEnabled] = useState(false);
    const [placeHolder, setPlaceHolder] = useState('');

    const getUserName = async () => {
        const response = await fetch("http://localhost:4000/firstLogin/getUserName/cpalusze", {
            method: "GET",
        });
        const data = await response.json();
        setPlaceHolder(data.username);
    }

    useEffect(() => {
        try {
            getUserName();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const redirectToHome = () => {
        if (validateEnabled) {
            setMessage("Redirecting...");
            window.location.href = "http://localhost:3000/home";
        }
    }

    const handleClick = () => {
        redirectToHome();
    }

    const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const response = await fetch("http://localhost:4000/firstLogin/doesUserNameExist", {
            method: "POST",
            body: JSON.stringify({username: e.target.value}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const isUserAlreadyTaken = await response.json();
        console.log("response: " + isUserAlreadyTaken);
        if (isUserAlreadyTaken) { //TODO: when username same as mine, dont enter in this, waiting for current user task
            setMessage("Username already taken");
            setValidateEnabled(false);
            setIsVisible(true);
        }
        else {
            setMessage("Username available");
            setIsVisible(true);
            setValidateEnabled(true);
        }
        if (e.target.value === "") {
            setValidateEnabled(true);
            setIsVisible(false);
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
                <Manage2FAFirstLogin></Manage2FAFirstLogin>
            </div>
            <CustomBtn disable={!validateEnabled} onClick={handleClick}>
                Validate
            </CustomBtn>
        </div>
    )
}