"use client";

export const IsQueued = async (userId: number) : Promise<boolean> => {
	try {
		if (!userId)
			return false;
		let isQueued = false;
		const response = await fetch(`${process.env.BACK_URL}/game/infoQueued/${userId}`, {
			credentials: "include",
			method: "GET",
		});
		const data = await response.json();
		if (data) {
			isQueued = data.isQueued;
		}
		return isQueued;

	} catch (error) {
		console.log(error);
		return false;
	}
}