-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "builtYear" INTEGER,
ADD COLUMN     "floorNumber" INTEGER,
ADD COLUMN     "floors" INTEGER,
ADD COLUMN     "furnished" TEXT,
ADD COLUMN     "lift" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parking" BOOLEAN NOT NULL DEFAULT false;
