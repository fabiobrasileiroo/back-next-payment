import * as paymentService from '../services/paymentService.js'

export const createPayment = async (req, res) => {
  try {
    const paymentResponse = await paymentService.createPayment(req.body)
    res.status(201).json(paymentResponse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
