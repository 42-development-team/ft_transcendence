import { PrismaClient } from "@prisma/client";
import { users } from '../seeds/seeds_users'
import { messages } from '../seeds/seeds_messages'

const prisma = new PrismaClient()

async function seedFeeding {
    async seedUsers();
    async seedMessages();
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

seedFeeding().catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})