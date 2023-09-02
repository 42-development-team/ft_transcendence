-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_gameLosedId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_gameWonId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "gameLosedId" DROP NOT NULL,
ALTER COLUMN "gameWonId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameLosedId_fkey" FOREIGN KEY ("gameLosedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameWonId_fkey" FOREIGN KEY ("gameWonId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
