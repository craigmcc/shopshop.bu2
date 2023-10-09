-- CreateIndex
CREATE INDEX "lists_profileId_idx" ON "lists"("profileId");

-- CreateIndex
CREATE INDEX "members_listId_idx" ON "members"("listId");

-- CreateIndex
CREATE INDEX "members_profileId_idx" ON "members"("profileId");
