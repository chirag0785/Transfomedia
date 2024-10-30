/*
  Warnings:

  - You are about to drop the column `backgroundImgPublicId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `originalImgPublicId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `originalImgurl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "backgroundImgPublicId",
DROP COLUMN "originalImgPublicId",
ADD COLUMN     "backgroundImgurl" TEXT,
ADD COLUMN     "originalImgurl" TEXT NOT NULL;
