
const getStatsLeaderBoard = async ( {userId}: {userId: number} ) => {
    try {
        if (userId === undefined)
            return null;
        const response = await fetch(`${process.env.BACK_URL}/userstats/info/leaderBoard/${userId}`, {
            credentials: "include",
            method: "GET",
        })
        const stats = await response.json();
        return await stats;
    } catch(error) {
        console.log("Error response when fetching LeaderBoard", error);
        return (error);
    }
}

export default getStatsLeaderBoard;