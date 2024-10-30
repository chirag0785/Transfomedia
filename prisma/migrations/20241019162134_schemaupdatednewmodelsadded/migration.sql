/*
  Warnings:

  - You are about to drop the column `reelTransformed` on the `Video` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Subscription" AS ENUM ('free', 'pro', 'standard');

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "reelTransformed";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileImg" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 10,
    "tranformationsDone" INTEGER NOT NULL DEFAULT 0,
    "currentSubscription" "Subscription" NOT NULL DEFAULT 'free',
    "paid_subscription" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "originalImgurl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
