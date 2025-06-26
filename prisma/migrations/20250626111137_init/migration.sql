/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `signup_code` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Favourite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hotel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favourite" DROP CONSTRAINT "Favourite_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "Favourite" DROP CONSTRAINT "Favourite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_operatorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
DROP COLUMN "signup_code";

-- DropTable
DROP TABLE "Favourite";

-- DropTable
DROP TABLE "Hotel";

-- DropTable
DROP TABLE "Message";

-- DropEnum
DROP TYPE "Role";
