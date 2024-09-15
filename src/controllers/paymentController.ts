import type { PaymentData } from '@/@types/PaymentData'
import type { Request, Response } from 'express'
import * as paymentService from '../services/paymentService'

export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentData = req.body
    console.log('🚀 ~ createPayment ~ paymentData:', paymentData)
    const paymentResponse = await paymentService.createPayment(paymentData)
    res.status(201).json(paymentResponse)
  } catch (error) {
    res.status(400).json({ message: (error as Error).message })
  }
}
