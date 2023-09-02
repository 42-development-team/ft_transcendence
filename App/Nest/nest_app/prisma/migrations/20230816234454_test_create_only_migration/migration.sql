/*
  Warnings:

  - You are about to drop the column `looserId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `loose` on the `UserStats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserStats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameLosedId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameWonId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserStats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "looserId",
DROP COLUMN "winnerId",
ADD COLUMN     "gameLosedId" INTEGER NOT NULL,
ADD COLUMN     "gameWonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserStats" DROP COLUMN "loose",
ADD COLUMN     "lose" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameWonId_fkey" FOREIGN KEY ("gameWonId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameLosedId_fkey" FOREIGN KEY ("gameLosedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
