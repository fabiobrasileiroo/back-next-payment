import * as paymentService from '../services/paymentService';
import type { Request, Response } from 'express';
import type { PaymentData } from '../@types/PaymentData';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentData = req.body;
    const paymentResponse = await paymentService.createPayment(paymentData);
    res.status(201).json(paymentResponse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
