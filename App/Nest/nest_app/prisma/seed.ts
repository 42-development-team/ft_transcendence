import { PrismaClient } from "@prisma/client";
import { users } from '../users_seeds'

const prisma = new PrismaClient()

async function main() {
    for (let user of users) {
        await prisma.user.create({
            data: user,
        });
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})