/*
  Warnings:

  - You are about to drop the `_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendRequestGot" INTEGER[],
ADD COLUMN     "friendRequestSent" INTEGER[],
ADD COLUMN     "friends" INTEGER[];

-- DropTable
DROP TABLE "_friends";
