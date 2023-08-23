/*
  Warnings:

  - You are about to drop the `_bannedUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_chatAdmins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_bannedUsers" DROP CONSTRAINT "_bannedUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_bannedUsers" DROP CONSTRAINT "_bannedUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_chatAdmins" DROP CONSTRAINT "_chatAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_chatAdmins" DROP CONSTRAINT "_chatAdmins_B_fkey";

-- DropForeignKey
ALTER TABLE "_members" DROP CONSTRAINT "_members_A_fkey";

-- DropForeignKey
ALTER TABLE "_members" DROP CONSTRAINT "_members_B_fkey";

-- DropTable
DROP TABLE "_bannedUsers";

-- DropTable
DROP TABLE "_chatAdmins";

-- DropTable
DROP TABLE "_members";
