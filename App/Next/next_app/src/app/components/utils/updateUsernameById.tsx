
const UpdateUsernameById = async ( {userData}: any ) => {
	try {
		const response = await fetch(`${process.env.BACK_URL}/users/update_username/${userData.id}`, {	
			credentials: "include",
			method: "PUT",
			body: JSON.stringify({username: userData.newUsername}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		return (data);
	} catch (error) {
		console.log(error);
		return (error);
	}
}
export default UpdateUsernameById;