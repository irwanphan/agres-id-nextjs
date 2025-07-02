/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `PaymentTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_orderId_key" ON "PaymentTransaction"("orderId");
