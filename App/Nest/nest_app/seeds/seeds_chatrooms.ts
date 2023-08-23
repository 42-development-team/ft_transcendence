export const chatRooms = [
    {
      name: "Public Room 1",
      type: "public",
      hashedPassword: null,
      owner: {
        connect: { id: 1 },
      },
    },
    {
      name: "Public Room 2",
      type: "public",
      hashedPassword: null,
      owner: {
        connect: { id: 2 },
      },
    },
    {
      name: "Protected Room 1",
      type: "protected",
      hashedPassword: "hashPassword123",
      owner: {
        connect: { id: 2 },
      },
    },
    {
      name: "Protected Room 2",
      type: "protected",
      hashedPassword: "hashPassword123",
      owner: {
        connect: { id: 2 },
      },
    },
    {
      name: "Private Room 1",
      type: "private",
      hashedPassword: "hashPassword123",
      owner: {
        connect: { id: 2 },
      },
    },
  ];