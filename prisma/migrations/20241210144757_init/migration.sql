-- CreateTable
CREATE TABLE "Profile" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");
