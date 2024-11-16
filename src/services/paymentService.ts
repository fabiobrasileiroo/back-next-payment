import type { PaymentData } from '../@types/PaymentData';
import { payment } from '../config/mercadoPagoConfig';

// Service function to create a payment
export const createPayment = async (paymentData: PaymentData) => {
  try {
    const notification_url="https://back-next-payment.onrender.com/api/payments/webhook"
    const paymentDataFinal = { 
      ...paymentData,
      notification_url,
    }
    console.log('----------------------------------------------------------')
    console.log("🚀 ~ createPayment ~ paymentDataFinal:", paymentDataFinal)
    const response = await payment.create({
      body: paymentDataFinal,
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
