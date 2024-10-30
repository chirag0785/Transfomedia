/*
  Warnings:

  - You are about to drop the column `currentSubscription` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `paid_subscription` on the `User` table. All the data in the column will be lost.
  - Added the required column `subscription_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "plans" AS ENUM ('free', 'pro', 'standard');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentSubscription",
DROP COLUMN "paid_subscription",
ADD COLUMN     "subscription_id" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Subscription";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "planName" "plans" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "creditsIssued" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "features" JSONB NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
