export const games = [
    {
        users: {
            connect: [
                { id: 1 },
                { id: 6 },
            ],
        },
        gameDuration: 10,
        winner: {
            connect: { id: 1 },
        },
        loser: {
            connect: { id: 6 },
        },
        winnerScore: 10,
        loserScore: 5,
    },
    {
        users: {
            connect: [
                { id: 6 },
                { id: 4 },
            ],
        },
        winner: {
            connect: { id: 6 },
        },
        loser: {
            connect: { id: 4 },
        },
        gameDuration: 3,
        winnerScore: 2,
        loserScore: 0,
    },
    {
        users: {
            connect: [
                { id: 6 },
                { id: 2 },
            ],
        },
        gameDuration: 5,
        winner: {
            connect: { id: 6 },
        },
        loser: {
            connect: { id: 2 },
        },
    },
    {
        users: {
            connect: [
                { id: 6 },
                { id: 4 },
            ],
        },
        gameDuration: 3,
        winner: {
            connect: { id: 6 },
        },
        loser: {
            connect: { id: 4 },
        },
        winnerScore: 2,
        loserScore: 0,
    },
    {
        users: {
            connect: [
                { id: 6 },
                { id: 3 },
            ],
        },
        gameDuration: 3,
        winner: {
            connect: { id: 3 },
        },
        loser: {
            connect: { id: 6 },
        },
        winnerScore: 2,
        loserScore: 0,
    },
    {
        users: {
            connect: [
                { id: 6 },
                { id: 3 },
            ],
        },
        gameDuration: 10,
        winner: {
            connect: { id: 3 },
        },
        loser: {
            connect: { id: 6 },
        },
        winnerScore: 2,
        loserScore: 0,
    },
];