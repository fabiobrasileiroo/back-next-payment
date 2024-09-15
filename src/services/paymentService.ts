import mercadoPagoConfig from '../config/mercadoPagoConfig';
import { Payment } from 'mercadopago';

const payment = new Payment(mercadoPagoConfig);

export const createPayment = async (paymentData: any) => {
  try {
    return await payment.create({ body: paymentData });
  } catch (error) {
    throw new Error(`Error creating payment: ${(error as Error).message}`);
  }
};