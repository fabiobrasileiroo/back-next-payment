import { MercadoPagoConfig } from 'mercadopago'

const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: process.env.accessToken,
  options: {
    timeout: 5000,
  },
})

export default mercadoPagoConfig
