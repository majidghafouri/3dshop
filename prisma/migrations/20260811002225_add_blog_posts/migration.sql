-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT,
    "readingTime" INTEGER DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPostTranslation" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "tag" TEXT,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,

    CONSTRAINT "BlogPostTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_isPublished_publishedAt_idx" ON "BlogPost"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_isTrending_idx" ON "BlogPost"("isTrending");

-- CreateIndex
CREATE INDEX "BlogPost_category_idx" ON "BlogPost"("category");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPostTranslation_postId_locale_key" ON "BlogPostTranslation"("postId", "locale");

-- AddForeignKey
ALTER TABLE "BlogPostTranslation" ADD CONSTRAINT "BlogPostTranslation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
