"use client";
import React, {FC, useState, useEffect, useRef} from "react";
import '../../globals.css'

interface Props {}

const OtpInput = () => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const handleOnChange = ({target}: React.ChangeEvent<HTMLInputElement>, index: number):void => {
        const inputRef = useRef<HTMLInputElement>(null);
        const { value } = target
        const newOTP : string[] = [...otp];
        newOTP[index] = value.substring(value.length - 1);
        setOtp(newOTP);
        console.log(newOTP[index]);

        setOtp(newOTP);
    }
        return (
            <div className="my-2 mb-4 mx-8 mt-4 flex justify-center items-center space-x-2 ">
                {otp.map((_, index) => {
                    return (
                        <React.Fragment key={index}>
                        <input
                        ref={inputRef}
                            type="number"
                            className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl
                            border-gray-4-- focus:border-gray-700 focus:text-gray-700 text-gray-400 transition spin-button-none"
                            onChange={(e) => handleOnChange(e, index)}
                        />
                        {index === 2 && (
                            <span className="w-2 py-0.5 bg-gray-400"/>
                        )}
                        </React.Fragment>
                    );
                })}
            </div>
        )
}

export default OtpInput;
