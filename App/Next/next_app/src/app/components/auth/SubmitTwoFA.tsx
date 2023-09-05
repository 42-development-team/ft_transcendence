"user client";

import OtpInput from "./OtpInput";
import SubmitBtn from "./SubmitBtn";

const Submit2FA = (
	{
		children,
		displayBox=false,
		handleOnKeyDown=() => {},
		handleSubmit=() => {},
		handleCallbackData=() => {},
		handleCallbackEnter=() => {},
		parentCallbackData=() => {},
		parentCallbackEnter=() => {},
		isVisible=false,
		message='',
		colorText='text-red-700',
	}
	:
	{
		children: any,
		displayBox: Boolean,
		handleOnKeyDown: any,
		handleSubmit: any,
		handleCallbackData: any,
		handleCallbackEnter: any,
		parentCallbackData?: any,
		parentCallbackEnter?: any,
		isVisible: Boolean,
		message: string,
		colorText: string,
	}) =>
{
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
			<div className={` ${colorText} text-center`}>
				{isVisible && <p>{message}</p>}
			</div>
			<div className=" active:duration-500 flex flex-col items-center">
				<SubmitBtn displayBox={displayBox} handleOnKeyDown={handleOnKeyDown} handleSubmit={handleSubmit}>Submit</SubmitBtn>
			</div>
		</div>
	)
}

export default Submit2FA;