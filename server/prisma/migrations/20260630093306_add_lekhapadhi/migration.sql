-- CreateTable
CREATE TABLE "LekhapadhiProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "officeName" TEXT NOT NULL,
    "officeAddress" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "services" TEXT[],
    "bio" TEXT,
    "availability" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LekhapadhiProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" SERIAL NOT NULL,
    "lekhapadhiId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "message" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LekhapadhiProfile_userId_key" ON "LekhapadhiProfile"("userId");

-- AddForeignKey
ALTER TABLE "LekhapadhiProfile" ADD CONSTRAINT "LekhapadhiProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_lekhapadhiId_fkey" FOREIGN KEY ("lekhapadhiId") REFERENCES "LekhapadhiProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
