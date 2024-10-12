-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "transaction_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "payer_email" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
