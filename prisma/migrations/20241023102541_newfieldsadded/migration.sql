/*
  Warnings:

  - You are about to drop the column `backgroundImgurl` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `originalImgurl` on the `Image` table. All the data in the column will be lost.
  - Added the required column `originalImgPublicId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "backgroundImgurl",
DROP COLUMN "originalImgurl",
ADD COLUMN     "backgroundImgPublicId" TEXT,
ADD COLUMN     "originalImgPublicId" TEXT NOT NULL;
