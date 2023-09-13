-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "favorites" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
