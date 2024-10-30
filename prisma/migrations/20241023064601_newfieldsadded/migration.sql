/*
  Warnings:

  - Added the required column `typeOfTransformation` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "aspectRatio" TEXT,
ADD COLUMN     "backgroundImgurl" TEXT,
ADD COLUMN     "typeOfTransformation" TEXT NOT NULL;
