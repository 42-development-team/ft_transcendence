/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "socketId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_socketId_key" ON "User"("socketId");
