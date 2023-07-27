
const isTwoFAActive = async (userIdStorage: string) : Promise<any> => {
	try {
		const response = await fetch(`${process.env.BACK_URL}/2fa/isTwoFAActive/${userIdStorage}`);
		const data = await response.json();
		return (data);
	} catch (error) {
		console.log(error);
		return true;
	}
}

export default isTwoFAActive;