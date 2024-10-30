-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileImg" TEXT NOT NULL,
    "occupation" TEXT,
    "hallOfFame" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "canBePubliclyShown" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);
