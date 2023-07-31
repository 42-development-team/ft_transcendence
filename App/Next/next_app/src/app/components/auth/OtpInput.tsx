"use client";
import React, {useState, useEffect, useRef} from "react";
import '../../globals.css'

// interface OtpInputProps {
//     parentCallbackData: (concatString: string) => void;
//     parentCallbackEnter: () => void;
// }

let currentOtpIndex: number = 0;

const OtpInput = ( { parentCallbackData, parentCallbackEnter } : any ) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOnChange = ({target}: React.ChangeEvent<HTMLInputElement>):void => {
        const { value } = target
        const newOTP : string[] = [...otp];

        newOTP[currentOtpIndex] = value.substring(value.length - 1);
        if (!value) 
            setActiveOtpIndex(currentOtpIndex - 1);
        else if (value < '0' || value > '9') 
            return;
        else 
            setActiveOtpIndex(currentOtpIndex + 1);
        setOtp(newOTP);

        const concatenatedString = newOTP.reduce((accumulator, currentValue) => accumulator + currentValue, '');
        if (currentOtpIndex === 5)
            parentCallbackData(concatenatedString); //send string to parent component

    }

    const handleOnKeyDown = ({key}: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        currentOtpIndex = index;
        if (key === 'Backspace' ) {
            setActiveOtpIndex(currentOtpIndex - 1);
        }
        else if (key === 'Enter' && index === 5) {
            parentCallbackEnter();
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
                            inputMode="numeric"
                            className={`  w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl
                            border-gray-4-- focus:border-gray-700 focus:text-gray-700 text-gray-400 focus-visible:animate-pulse `}
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
