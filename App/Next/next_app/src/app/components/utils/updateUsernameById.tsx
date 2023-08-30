
const UpdateUsernameById = async ( newUserName: string, userId: string  ) => {
	try {
		const response = await fetch(`${process.env.BACK_URL}/users/update_username/${userId}`, {	
			credentials: "include",
			method: "PUT",
			body: JSON.stringify({username: newUserName}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
	} catch (error) {
		console.log(error);
	}
}
export default UpdateUsernameById;