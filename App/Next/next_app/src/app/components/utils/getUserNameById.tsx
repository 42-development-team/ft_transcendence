
const getUserNameById = async (id: string) => {
	try {
		const response = await fetch(`${process.env.BACK_URL}/users/${id}`, {
			credentials: "include",
			method: "GET",
		});
		const data = await response.json();
		if (data.username === undefined)
			throw new Error("Username not found");
		return (data.username);
	}
	catch (error) {
		console.log(error);
	}
}
export default getUserNameById;