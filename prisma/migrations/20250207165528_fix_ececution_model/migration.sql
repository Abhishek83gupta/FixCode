/*
  Warnings:

  - Added the required column `code` to the `CodeExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodeExecution" ADD COLUMN     "code" TEXT NOT NULL;
