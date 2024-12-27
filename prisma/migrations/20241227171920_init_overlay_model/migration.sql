-- CreateTable
CREATE TABLE "OverlaySettings" (
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "OverlaySettings_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "OverlaySettings_key_key" ON "OverlaySettings"("key");

-- CreateIndex
CREATE INDEX "OverlaySettings_key_idx" ON "OverlaySettings"("key");

-- AddForeignKey
ALTER TABLE "OverlaySettings" ADD CONSTRAINT "OverlaySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
