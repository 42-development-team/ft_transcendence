

const createStats = async ( {userId}: {userId: number} ) => {
    try {
        if (userId === undefined)
            return null;
        const data = await fetch(`${process.env.BACK_URL}/userstats/create`, {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({userId: userId}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const response = await data.json();
        if (response.BAD_REQUEST)
            console.log("Error during Stats creation");
        return await response;
    } catch(error) {
        console.log("Error response when fetching LeaderBoard", error);
        return (error);
    }
}

export default createStats;