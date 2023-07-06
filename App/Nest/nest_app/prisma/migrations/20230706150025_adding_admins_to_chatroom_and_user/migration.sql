-- CreateTable
CREATE TABLE "_chatAdmins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_chatAdmins_AB_unique" ON "_chatAdmins"("A", "B");

-- CreateIndex
CREATE INDEX "_chatAdmins_B_index" ON "_chatAdmins"("B");

-- AddForeignKey
ALTER TABLE "_chatAdmins" ADD CONSTRAINT "_chatAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatAdmins" ADD CONSTRAINT "_chatAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
