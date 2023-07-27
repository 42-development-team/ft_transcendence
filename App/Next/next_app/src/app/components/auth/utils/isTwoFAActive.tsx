
const isTwoFAActive = async () : Promise<any> => {
	try {
		const response = await fetch(`${process.env.BACK_URL}/2fa/isTwoFAActive/${userIdStorage}`);
		const data = await response.json();
		return (data);
	} catch (error) {
		console.log(error);
	}
}

export default isTwoFAActive;