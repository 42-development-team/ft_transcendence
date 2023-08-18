/*
  Warnings:

  - You are about to drop the column `drew` on the `Game` table. All the data in the column will be lost.
  - Made the column `gameLosedId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameWonId` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_gameLosedId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_gameWonId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "drew",
ADD COLUMN     "loserScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winnerScore" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "gameLosedId" SET NOT NULL,
ALTER COLUMN "gameWonId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameLosedId_fkey" FOREIGN KEY ("gameLosedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameWonId_fkey" FOREIGN KEY ("gameWonId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
