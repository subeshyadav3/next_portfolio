-- AlterTable
ALTER TABLE "User" ADD COLUMN "authorId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;
