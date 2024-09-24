import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import productRoutes from './routes/productRoutes.js'
import createUserRouter from './routes/createUserRoutes.js'
import createUnitRouter from './routes/createUnitRoutes.js'

const app = express()

app.use(express.json())

app.use(cors())

app.get('/', (_req, res) => {
  res.send('🚀 Api next payment funcionando')
})

// Defina as rotas para produtos e pagamentos
app.use('/api/products', productRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api', authRoutes) // Adicione '/api' como prefixo para as rotas de autenticação
app.use('/api', createUserRouter) // Adicione '/api' como prefixo para as rotas de autenticação
app.use('/api', createUnitRouter) // Adicione '/api' como prefixo para as rotas de autenticação


export default app
