import mercadoPagoConfig from '../config/mercadoPagoConfig';
import { Payment } from 'mercadopago';
import type { PaymentData } from '../@types/PaymentData';

const payment = new Payment(mercadoPagoConfig);

export const createPayment = async (paymentData: PaymentData) => {
  try {
    return await payment.create({ body: paymentData });
  } catch (error) {
    throw new Error(`Error creating payment: ${(error as Error).message}`);
  }
};
