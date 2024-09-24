/*
  Warnings:

  - Added the required column `proposalValue` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "proposalValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitId" INTEGER;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
