import mercadoPagoConfig from '../config/mercadoPagoConfig.js'
import { Payment } from 'mercadopago'

const payment = new Payment(mercadoPagoConfig)

export const createPayment = async paymentData => {
  try {
    return await payment.create({ body: paymentData })
  } catch (error) {
    throw new Error(`Error creating payment: ${error.message}`)
  }
}
