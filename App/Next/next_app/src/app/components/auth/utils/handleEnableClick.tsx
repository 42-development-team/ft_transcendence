import generateTwoFA from "./generateTwoFA"

const handleEnableClick = async (
	url: string, 
	userId: string, 
	setImageUrl: React.Dispatch<React.SetStateAction<string>>,
	setCancelActive: React.Dispatch<React.SetStateAction<boolean>>,
	setEnableActive: React.Dispatch<React.SetStateAction<boolean>>,
	setDisplayBox: React.Dispatch<React.SetStateAction<Boolean>>,
	setColor : React.Dispatch<React.SetStateAction<string>>,
	setColorCancel: React.Dispatch<React.SetStateAction<string>>) => 
	{
	generateTwoFA(`${process.env.BACK_URL}/2fa/turn-on/`, userId, setImageUrl);
}

export { handleEnableClick };