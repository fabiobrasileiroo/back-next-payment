-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyDocument" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_userId_key" ON "Proposal"("userId");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
