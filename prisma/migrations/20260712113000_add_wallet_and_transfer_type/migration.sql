-- CreateEnum
CREATE TYPE "monmon_whethertie"."WalletType" AS ENUM ('cash', 'bank', 'ewallet', 'other');

-- AlterEnum
ALTER TYPE "monmon_whethertie"."TransactionType" ADD VALUE 'transfer';

-- AlterTable
ALTER TABLE "monmon_whethertie"."Transaction" ADD COLUMN "walletId" TEXT;

-- CreateTable
CREATE TABLE "monmon_whethertie"."Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "monmon_whethertie"."WalletType" NOT NULL,
    "icon" TEXT,
    "colorHex" TEXT,
    "initialBalance" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "monmon_whethertie"."Wallet"("userId");

-- CreateIndex
CREATE INDEX "Transaction_walletId_idx" ON "monmon_whethertie"."Transaction"("walletId");

-- AddForeignKey
ALTER TABLE "monmon_whethertie"."Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "monmon_whethertie"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monmon_whethertie"."Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "monmon_whethertie"."Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
