-- CreateTable
CREATE TABLE "QuestionUpvotes" (
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionUpvotes_pkey" PRIMARY KEY ("questionId","userId")
);

-- AddForeignKey
ALTER TABLE "QuestionUpvotes" ADD CONSTRAINT "QuestionUpvotes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
