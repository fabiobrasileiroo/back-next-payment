import type { PaymentData } from '../@types/PaymentData';
import { payment } from '../config/mercadoPagoConfig';

// Service function to create a payment
export const createPayment = async (paymentData: PaymentData) => {
  try {
    const response = await payment.create({
      body: paymentData,
    });
    console.log("🚀 ~ createPayment ~ response:", response)
    return response;
  } catch (error: any) {
    console.error('Erro ao criar pagamento:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response); // Log detailed error response if available
    }
    throw new Error(`Error creating payment: ${(error as Error).message}`);
  }
};
