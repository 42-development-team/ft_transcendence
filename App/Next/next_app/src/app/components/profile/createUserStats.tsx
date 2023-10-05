"use client";

const createStats = async ( {userId}: {userId: number} ) => {
    try {
        if (userId === undefined || userId === null)
            return null;
        const data = await fetch(`${process.env.BACK_URL}/userstats/create`, {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({userId: userId}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return (data);
    } catch(error) {
        console.log("Error response when fetching LeaderBoard", error);
        return (error);
    }
}

export default createStats;