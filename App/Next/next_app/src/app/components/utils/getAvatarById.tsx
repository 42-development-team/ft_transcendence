"use client";

const getAvatarById = async ( userId: string ) => {
    try {
        const response = await fetch(`${process.env.BACK_URL}/avatars/${userId}`, {
            credentials: "include",
            method: "GET",
        });
        const data = await response.json();
        return (data.avatar);
    } catch (error) {
        console.log("Error response when fetching userstats/info:", error);
        return (null);
    }
}

export default getAvatarById;