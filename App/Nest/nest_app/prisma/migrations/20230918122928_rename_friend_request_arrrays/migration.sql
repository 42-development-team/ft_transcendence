/*
  Warnings:

  - You are about to drop the column `pendingFriendInvite` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pendingFriendRequest` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pendingFriendInvite",
DROP COLUMN "pendingFriendRequest",
ADD COLUMN     "receivedFriendRequest" INTEGER[],
ADD COLUMN     "sentFriendRequest" INTEGER[];
