/*
  Warnings:

  - A unique constraint covering the columns `[fullPhone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullPhone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_fullPhone_key" ON "User"("fullPhone");
