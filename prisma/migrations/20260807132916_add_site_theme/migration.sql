-- CreateTable
CREATE TABLE "SiteTheme" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "palette" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteTheme_pkey" PRIMARY KEY ("id")
);
