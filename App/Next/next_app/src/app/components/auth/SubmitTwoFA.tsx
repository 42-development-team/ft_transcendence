"user client";

import OtpInput from "./OtpInput";
import SubmitBtn from "./SubmitBtn";
import { Alert } from "@material-tailwind/react";
import { AlertErrorIcon } from "../alert/AlertErrorIcon";
import { AlertSuccessIcon } from "../alert/AlertSuccessIcon";
import { useState } from "react";

const Submit2FA = (
	{
		children,
		disabled = false,
		displayBox = false,
		handleOnKeyDown = () => { },
		handleSubmit = () => { },
		handleCallbackData = () => { },
		handleCallbackEnter = () => { },
		parentCallbackData = () => { },
		parentCallbackEnter = () => { },
		isVisible = false,
		message = '',
		error = false,
		colorText = 'text-red-700',
	}
		:
		{
			children: any,
			disabled?: boolean,
			displayBox: Boolean,
			handleOnKeyDown: any,
			handleSubmit: any,
			handleCallbackData: any,
			handleCallbackEnter: any,
			parentCallbackData?: any,
			parentCallbackEnter?: any,
			isVisible: boolean,
			message: string,
			error: boolean,
			colorText: string,
		}) => {


	return (
		<div className="text-center">
			{
				displayBox &&
				<div>
					{children}
				</div>
			}
			{
				displayBox &&
				<div className="flex flex-row items-center">
					{
						displayBox &&
						<OtpInput parentCallbackData={handleCallbackData} parentCallbackEnter={handleCallbackEnter}></OtpInput>
					}
				</div>
			}
			<Alert
				className='mb-4 mt-4 p-2 text-text border-mauve border-[1px] break-all'
				variant='gradient'
				open={isVisible}
				color={ error ? 'red' : 'green'}
				icon={<AlertErrorIcon />}
				animate={{
					mount: { y: 0 },
					unmount: { y: 100 },
				}}>
				{message}
			</Alert>
			<div className=" active:duration-500 flex flex-col items-center">
				<SubmitBtn disabled={disabled} displayBox={displayBox} handleOnKeyDown={handleOnKeyDown} handleSubmit={handleSubmit}>Submit</SubmitBtn>
			</div>
		</div >
	)
}

export default Submit2FA;