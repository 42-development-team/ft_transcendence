
const getGames = async ({userId}: {userId: number}) => {
    try {
        const response = await fetch(`${process.env.BACK_URL}/game/infoGames/${userId}`, {
            credentials: "include",
            method: "GET",
        });
        const games = await response.json();
        return games;
    } catch(error) {
        console.log("Error response when fetching userstats/info/userId:", error);
        return (error);
    }
}

export default getGames;