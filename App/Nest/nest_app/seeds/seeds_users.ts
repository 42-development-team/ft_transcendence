export const users = [
    {
        login: "dfbusrain",
        username: "dfbsurain",
        avatar: "noavatar.jpg",
        currentStatus: "online",
		friends: { connect: [ { id: 2 }, { id: 3 } ] },
        blockedBy: { connect: { id: 4 } },
    },
    {
        login: "fmjsaune",
        username: "fmsjaune",
        avatar: "noavatar.jpg",
        currentStatus: "online",
		friends: { connect: [ { id: 1 }, { id: 3 } ] },
        blockedBy: { connect: { id: 4 } },
    },
    {
        login: "frchsateau",
        username: "rchfsateau",
        avatar: "noavatar.jpg",
        currentStatus: "online",
		friends: { connect: [ { id: 2 }, { id: 1 } ] },
        blockedBy: { connect: { id: 4 } },
    },
	{
        login: "frchsateau",
        username: "rchfsateau",
        avatar: "noavatar.jpg",
        currentStatus: "online",
		friends: { connect: [ ] },
        blockedBy: { connect: { } },
    },
];
