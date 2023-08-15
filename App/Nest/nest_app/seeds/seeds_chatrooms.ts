export const chatRooms = [
    {
      name: "Public Room 1",
      type: "public",
      hashedPassword: null,
      members: {
        connect: [
          { id: 1 },
          { id: 2 },
        ],
      },
      owner: {
        connect: { id: 1 },
      },
      admins: {
        connect: [
          { id: 1 },
          { id: 2 },
        ],
      },
    },
    {
      name: "Public Room 2",
      type: "public",
      hashedPassword: null,
      members: {
        connect: [
          { id: 3 },
          { id: 2 },
        ],
      },
      owner: {
        connect: { id: 2 },
      },
      admins: {
        connect: [
          { id: 2 },
          { id: 3 },
        ],
      },
    },
    {
      name: "Private Room 1",
      type: "private",
      hashedPassword: "hashPassword123",
      members: {
        connect: [
          { id: 2 },
          { id: 3 },
        ],
      },
      owner: {
        connect: { id: 2 },
      },
      admins: {
        connect: [
          { id: 2 },
        ],
      },
    },
    {
      name: "Private Room 2",
      type: "private",
      hashedPassword: "hashPassword123",
      members: {
        connect: [
          { id: 2 },
          { id: 3 },
        ],
      },
      owner: {
        connect: { id: 2 },
      },
      admins: {
        connect: [
          { id: 2 },
        ],
      },
    },
  ];