-- CreateEnum
CREATE TYPE "License" AS ENUM ('MIT', 'GPLV2', 'GPLV3', 'APACHE2', 'BSD', 'MPL2', 'AGPL', 'OTHER');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WINDOWS', 'MACOS', 'LINUX', 'WEB', 'ANDROID', 'IOS', 'SELF_HOSTED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProprietaryApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProprietaryApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FossAlternative" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "license" "License" NOT NULL,
    "platforms" "Platform"[],
    "repoUrl" TEXT NOT NULL,
    "website" TEXT,
    "stars" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FossAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppAlternative" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "alternativeId" TEXT NOT NULL,
    "fitNotes" TEXT,

    CONSTRAINT "AppAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "proprietaryName" TEXT NOT NULL,
    "alternativeName" TEXT NOT NULL,
    "alternativeRepoUrl" TEXT NOT NULL,
    "categoryGuess" TEXT,
    "description" TEXT NOT NULL,
    "submitterEmail" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AppAlternative_appId_alternativeId_key" ON "AppAlternative"("appId", "alternativeId");

-- AddForeignKey
ALTER TABLE "ProprietaryApp" ADD CONSTRAINT "ProprietaryApp_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppAlternative" ADD CONSTRAINT "AppAlternative_appId_fkey" FOREIGN KEY ("appId") REFERENCES "ProprietaryApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppAlternative" ADD CONSTRAINT "AppAlternative_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "FossAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
