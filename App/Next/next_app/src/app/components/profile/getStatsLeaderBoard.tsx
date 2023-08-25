
const getStatsLeaderBoard = async ( {userId}: {userId: number} ) => {
    try {
        const response = await fetch(`${process.env.BACK_URL}/userstats/info`, {
            credentials: "include",
            method: "GET",
        })
        const stats = await response.json();
        return await stats;
    } catch(error) {
        console.log("Error response when fetching userstats/info/userId:", error);
        return (error);
    }
}

export default getStatsLeaderBoard;