import { PrismaClient, Prisma } from "@prisma/client";
import { users } from '../seeds/seeds_users'
import { chatRooms } from '../seeds/seeds_chatrooms'
import { messages } from '../seeds/seeds_messages'

const prisma = new PrismaClient()

async function seedFeeding() {
    await seedUsers();
    await seedChatRooms();
    await seedMessages();
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

async function seedChatRooms() {
    for (let chatRoom of chatRooms) {
      await prisma.chatRoom.create({
        data: chatRoom,
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