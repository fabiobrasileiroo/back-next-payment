import { Payment } from 'mercadopago'
import type { PaymentData } from '../@types/PaymentData'
import mercadoPagoConfig from '../config/mercadoPagoConfig'

const payment = new Payment(mercadoPagoConfig)

export const createPayment = async (paymentData: PaymentData) => {
  console.log(payment)
  try {
    const response = await payment.create({
      body: paymentData,
    })
    return response
  } catch (error: any) {
    // Logando erro detalhado
    console.error('Erro ao criar pagamento:', error)
    if (error.response) {
      console.error('Detalhes do erro:', error.response) // Loga a resposta do erro, caso exista
    }
    throw new Error(`Error creating payment: ${(error as Error).message}`)
  }
}



