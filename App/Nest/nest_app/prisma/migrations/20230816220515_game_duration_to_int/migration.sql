/*
  Warnings:

  - You are about to drop the column `userId` on the `UserStats` table. All the data in the column will be lost.
  - Changed the type of `gameDuration` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- DropIndex
DROP INDEX "UserStats_userId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "gameDuration",
ADD COLUMN     "gameDuration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserStats" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "UserStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
