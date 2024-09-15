import express from 'express'
import productRoutes from './routes/productRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

const app = express()

app.use(express.json())

// Defina as rotas para produtos e pagamentos
app.use('/api/products', productRoutes)
app.use('/api/payments', paymentRoutes)

export default app

