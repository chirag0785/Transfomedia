/*
  Warnings:

  - Added the required column `userId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "transcriptId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;
