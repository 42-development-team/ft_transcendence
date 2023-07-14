"use client";
import React, {FC, useState, useEffect, useRef} from "react";
import '../../globals.css'

interface OtpInputProps {
    parentCallback: (concatString: string) => void;
}

let currentOtpIndex: number = 0;

const OtpInput = ({ parentCallback } : any) => {

    
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOnChange = ({target}: React.ChangeEvent<HTMLInputElement>):void => {
        const { value } = target
        const newOTP : string[] = [...otp];
        newOTP[currentOtpIndex] = value.substring(value.length - 1);
        
        if (!value) setActiveOtpIndex(currentOtpIndex - 1);
        else setActiveOtpIndex(currentOtpIndex + 1);
        setOtp(newOTP);

        const concatenatedString = newOTP.reduce((accumulator, currentValue) => accumulator + currentValue, '');
        if (currentOtpIndex === 5)
            parentCallback(concatenatedString);
        // if (currentOtpIndex === 5)
        //     props.parentCallback(sum)
    }

    const handleOnKeyDown = ({key}: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        currentOtpIndex = index;
        if (key === 'Backspace' ) {
            setActiveOtpIndex(currentOtpIndex - 1);
        }
    }   

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOtpIndex]);

        return (
            <div className={`my-2 mb-4 mx-8 mt-4 flex justify-center items-center space-x-2`}>
                {otp.map((_, index) => {
                    return (
                        <React.Fragment key={index}>
                        <input
                        ref={index === activeOtpIndex ? inputRef : null}
                            type="number"
                            className={` w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl
                            border-gray-4-- focus:border-gray-700 focus:text-gray-700 text-gray-400 animate-pulse`}
                            onChange={handleOnChange}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            value={otp[index]}
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
