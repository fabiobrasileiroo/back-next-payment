import express from 'express'
import productRoutes from './routes/productRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

const app = express()

app.use(express.json())

// Defina as rotas para produtos e pagamentos
app.use('/api/products', productRoutes)
app.use('/api/payments', paymentRoutes)

export default app

// import 'dotenv/config'
// import { MercadoPagoConfig, Payment } from 'mercadopago'

// const client = new MercadoPagoConfig({
//   accessToken: process.env.accessToken,
//   options: {
//     timeout: 5000,
//   },
// })

// const payment = new Payment(client)

// const body = {
//   transaction_amount: 30.5,
//   description: 'Teste api pix V2',
//   payment_method_id: 'pix',
//   payer: {
//     email: 'fabio.h591@gmail.com',
//   },
// }

// payment.create({ body }).then(console.log).catch(console.log)
