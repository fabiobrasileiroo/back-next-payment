import type { PaymentData } from '@/@types/PaymentData'
import type { Request, Response } from 'express'
import * as paymentService from '../services/paymentService'

export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentData = req.body
    console.log(req.body)

    if (paymentData.transaction_amount < 1.0) {
      return res.status(400).json('Valor deve ser maior que 1 real') // Added return here
    }

    console.log('🚀 ~ createPayment ~ paymentData:', paymentData)
    const paymentResponse = await paymentService.createPayment(paymentData)
    return res.status(201).json(paymentResponse) // Ensure you return after sending a response
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message }) // Added return here too
  }
}
