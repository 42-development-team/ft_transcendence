
const getUserNameById = async (id: string) =>{
	try {
		const response = await fetch(`${process.env.BACK_URL}/users/${id}`, {
			credentials: "include",
			method: "GET",
		});
		const data = await response.json();
		if (data === undefined) {
			console.log("Error: data is undefined")
			return data;
		}
		return data.username;
			
	}
	catch (error) {
		console.log(error);
	}
}
export default getUserNameById;