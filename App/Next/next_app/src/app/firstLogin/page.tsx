"use client";
import Image from 'next/image';
import CustomBtn from "@/components/CustomBtn";
import Manage2FAFirstLogin from "@/components/auth/2faFirstLoginAuth";

const redirectToHome = () => {
    window.location.href = "http://localhost:3000/home";
}

const handleClick = () => {
    console.log("Validate!");
    redirectToHome();
}

export default function FirstLogin() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="m-4 pt-4">
                <p className="font-bold text-center">Choose your username</p>
                <input type="text" className="m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none" />
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
            <CustomBtn onClick={handleClick}>
                Validate
            </CustomBtn>
        </div>
    )
}