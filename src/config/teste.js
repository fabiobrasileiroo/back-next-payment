import 'dotenv/config'
import { MercadoPagoConfig } from 'mercadopago'

// Verifique o ambiente
const isProduction = process.env.ENVIRONMENT === 'production'
console.log(isProduction)
const accessToken = isProduction
  ? process.env.PROD_ACCESS_TOKEN
  : process.env.SANDBOX_ACCESS_TOKEN
console.log(accessToken)
