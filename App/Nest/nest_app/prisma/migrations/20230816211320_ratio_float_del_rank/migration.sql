/*
  Warnings:

  - You are about to drop the column `rank` on the `UserStats` table. All the data in the column will be lost.
  - Changed the type of `gameDuration` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "gameDuration",
ADD COLUMN     "gameDuration" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserStats" DROP COLUMN "rank",
ALTER COLUMN "ratio" SET DEFAULT 0,
ALTER COLUMN "ratio" SET DATA TYPE DOUBLE PRECISION;
