"use client";
import React, {FC, useState, useEffect} from "react";
import '../../globals.css'

interface Props {}

const OtpInput: FC<Props> = (props): JSX.Element => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const handleOnChange = ({target}: React.ChangeEvent<HTMLInputElement>):void => {
        const { value } = target
        const val = value.substring(value.length - 1);
        console.log(val);
    }
        return (
            <div className="my-2 mb-4 mx-8 mt-4 flex justify-center items-center space-x-2 ">
                {otp.map((_, index) => {
                    return (
                        <React.Fragment key={index}>
                        <input
                            type="number"
                            className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl
                            border-gray-4-- focus:border-gray-700 focus:text-gray-700 text-gray-400 transition spin-button-none"
                            onChange={handleOnChange} 
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
