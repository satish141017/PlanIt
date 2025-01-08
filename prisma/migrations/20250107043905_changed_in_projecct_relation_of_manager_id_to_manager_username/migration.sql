/*
  Warnings:

  - You are about to drop the column `managerId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `managerUsername` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_managerId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "managerId",
ADD COLUMN     "managerUsername" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_managerUsername_fkey" FOREIGN KEY ("managerUsername") REFERENCES "Manager"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
