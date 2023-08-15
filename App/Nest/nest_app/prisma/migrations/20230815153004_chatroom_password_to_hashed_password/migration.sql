/*
  Warnings:

  - You are about to drop the column `password` on the `ChatRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "password",
ADD COLUMN     "hashedPassword" TEXT;
