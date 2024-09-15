import * as paymentService from '../services/paymentService';
import { Request, Response } from 'express';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentResponse = await paymentService.createPayment(req.body);
    res.status(201).json(paymentResponse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
