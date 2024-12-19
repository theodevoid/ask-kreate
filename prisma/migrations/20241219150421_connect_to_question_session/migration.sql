/*
  Warnings:

  - Added the required column `questionSessionId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "questionSessionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionSessionId_fkey" FOREIGN KEY ("questionSessionId") REFERENCES "QuestionSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
