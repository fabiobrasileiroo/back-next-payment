import 'dotenv/config'
import { MercadoPagoConfig } from 'mercadopago'

const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: process.env.SANDBOX_ACCESS_TOKEN || '', // Use o token de sandbox aqui
  options: {
    timeout: 5000,
  },
})

export default mercadoPagoConfig
