-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('CREDENTIALS', 'GOOLE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleId" TEXT DEFAULT '',
ADD COLUMN     "provide" "Provider" NOT NULL DEFAULT 'CREDENTIALS';
