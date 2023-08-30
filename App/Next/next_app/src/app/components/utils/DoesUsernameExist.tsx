
const DoesUserNameExist = async (username: string) => {
	try {
		const response = await fetch(`${process.env.BACK_URL}/users/usernameExist/${username}`, {
			credentials: "include",
			method: "GET",
		});
		const data = await response.json();
		return (data);
	} catch (error) {
		console.log(error);
	}

}

export default DoesUserNameExist;