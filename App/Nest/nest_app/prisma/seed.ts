import { PrismaClient, Prisma } from "@prisma/client";
import { users } from '../seeds/seeds_users'
import { chatRooms } from '../seeds/seeds_chatrooms'
import { messages } from '../seeds/seeds_messages'

const prisma = new PrismaClient()

async function seedFeeding() {
    await seedUsers();
    await seedMessages();
    await seedChatRooms();
}

async function seedUsers() {
    for (let user of users) {
        await prisma.user.create({
            data: user,
        });
    }
}

async function seedMessages() {
    for (let message of messages) {
        await prisma.message.create({
            data: message,
        });
    }
}

// async function seedMessages() {
//     for (let message of messages) {
//         const { sender, receiver, ...messageData } = message;
//         const senderUser = await prisma.user.findUnique({
//             where: { login: sender.connect.login },
//         });
//         const receiverUser = await prisma.user.findUnique({
//             where: { login: receiver.connect.login },
//         });
//         await prisma.message.create({
//             data: {
//                 ...messageData,
//                 senderId: senderUser.id,
//                 receiverId: receiverUser.id,
//             },
//         });
//     }
// }

async function seedChatRooms() {
    for (let chatRoom of chatRooms) {
      await prisma.chatRoom.create({
        data: chatRoom as Prisma.ChatRoomCreateInput, // Explicitly define the type
      });
    }
  }
  

seedFeeding().catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})