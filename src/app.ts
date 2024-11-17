import publicRouter from './routes/productRoutesPublic.js'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import productRoutes from './routes/productRoutes.js'
import createUserRouter from './routes/createUserRoutes.js'
import createUnitRouter from './routes/createUnitRoutes.js'
import proposalRoutes from './routes/proposalRoutes.js'
import validateToken from './routes/validateToken.js'

const app = express()

app.use(express.json())

app.use(cors())

// Middleware para rastrear requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Middleware para rastrear respostas
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${res.statusCode} ${req.method} ${req.url}`
    )
  })
  next()
})

app.get('/', (_req, res) => {
  res.send('🚀 Api next payment funcionando atualizado?')
})

app.head('/', (req, res) => {
  res.send(res)
})

// Defina as rotas para produtos e pagamentos
app.use('/api/products', productRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/auth', authRoutes) // Adicione '/api' como prefixo para as rotas de autenticação
app.use('/api', createUserRouter) // Adicione '/api' como prefixo para as rotas de autenticação
app.use('/api', createUnitRouter) // Adicione '/api' como prefixo para as rotas de autenticação
app.use('/proposal', proposalRoutes) // Adicione '/api' como prefixo para as rotas de autenticação
app.use('/auth', validateToken) // Adicione '/api' como prefixo para as rotas de autenticação
app.use('/all', publicRouter) // Adicione '/api' como prefixo para as rotas de autenticação
// nrok teste webHook
// app.user('/api',)

// Importações necessárias
import { PrismaClient } from '@prisma/client'

// Inicialize o Prisma Client
const prisma = new PrismaClient()

// Rota para testar a conexão com o banco de dados
app.get('/test-db', async (req, res) => {
  try {
    // Tente realizar uma consulta simples para verificar a conexão
    await prisma.$connect()
    res
      .status(200)
      .json({ message: 'Conexão com o banco de dados foi bem-sucedida!' })
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error)
    res.status(500).json({
      message: 'Falha na conexão com o banco de dados.',
      error: (error as Error).message,
    })
  } finally {
    // Feche a conexão do Prisma
    await prisma.$disconnect()
  }
})

export default app
