-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PUBLIC', 'OPERATOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PUBLIC';
