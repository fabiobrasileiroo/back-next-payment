import 'dotenv/config'
import { MercadoPagoConfig, Payment } from 'mercadopago'
export async function authPayment() {
  const client = new MercadoPagoConfig({
    accessToken: process.env.accessToken,
    options: {
      timeout: 5000,
    },
  })

  const payment = new Payment(client)

  return payment
}
