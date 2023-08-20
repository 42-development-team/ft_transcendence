import { PrismaClient, Prisma } from "@prisma/client";
import { users } from '../seeds/seeds_users'
import { chatRooms } from '../seeds/seeds_chatrooms'
import { messages } from '../seeds/seeds_messages'
import { games } from "../seeds/seeds_games";
import { UserStats } from "../seeds/seeds_userstats";
import { MemberShips } from "../seeds/seeds_memberships";

const prisma = new PrismaClient()

async function seedFeeding() {
    await seedUsers();
    await seedChatRooms();
    await seedMessages();
    await seedUserStats();
    await seedGames();
	await seedMemberShips();
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

async function seedMemberShips() {
    for (let chatRoom of chatRooms) {
      await prisma.chatRoom.create({
        data: chatRoom,
      });
    }
  }

async function seedGames() {
    for (let game of games) {
        await prisma.game.create({
            data: game,
        });
    }
}

async function seedUserStats() {
    for (let userStats of UserStats) {
        await prisma.userStats.create({
            data: userStats,
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
