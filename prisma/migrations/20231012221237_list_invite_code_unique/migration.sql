/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `lists` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lists_inviteCode_key" ON "lists"("inviteCode");
