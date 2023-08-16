export const games = [
    {
        users: {
            connect: [
                { id: 1 },
                { id: 2 },
            ],
        },
        gameDuration: 10,
        winner: {
            user: { connect: { id: 1 } },
        },
        loser: {
            user: { connect: { id: 2 } },
        },
        drew: false,
    },
    {
        users: {
            connect: [
                { id: 4 },
                { id: 1 },
            ],
        },
        gameDuration: 3,
        drew: true,
    },
    {
        users: {
            connect: [
                { id: 3 },
                { id: 2 },
            ],
        },
        gameDuration: 3,
        winner: {
            user: { connect: { id: 3 } },
        },
        loser: {
            user: { connect: { id: 2 } },
        },
        drew: false,
    },
    {
        users: {
            connect: [
                { id: 2 },
                { id: 4 },
            ],
        },
        gameDuration: 3,
        winner: {
            user: { connect: { id: 4 } },
        },
        loser: {
            user: { connect: { id: 2 } },
        },
        drew: false,
    },
];