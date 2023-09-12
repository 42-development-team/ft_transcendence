/*
  Warnings:

  - You are about to drop the column `friendRequestGot` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `friendRequestSent` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "friendRequestGot",
DROP COLUMN "friendRequestSent";
