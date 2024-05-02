-- CreateEnum
CREATE TYPE "BaseImages" AS ENUM ('Python', 'React');

-- CreateEnum
CREATE TYPE "ContainerStatus" AS ENUM ('NA', 'Running', 'Closed', 'Frozen', 'Error');

-- CreateTable
CREATE TABLE "Deployments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "baseImage" "BaseImages" NOT NULL,
    "containerId" TEXT,
    "containerCreatedAt" TIMESTAMP(3),
    "containerStatus" "ContainerStatus",

    CONSTRAINT "Deployments_pkey" PRIMARY KEY ("id")
);
