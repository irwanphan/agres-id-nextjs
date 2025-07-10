-- DropForeignKey
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_orderId_fkey";

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
