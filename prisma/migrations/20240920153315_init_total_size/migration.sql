/*
  Warnings:

  - Added the required column `totalSize` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "totalSize" INTEGER NOT NULL;
