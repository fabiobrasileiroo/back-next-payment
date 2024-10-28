import express from 'express'
import { getAllCompaniesWithProducts } from '@/controllers/getAllCompaniesWithProducts'

const publicRouter = express.Router()

// Rota pública para listar todas as empresas e seus produtos
publicRouter.get('/companies', async (req, res) => {
  try {
    const companies = await getAllCompaniesWithProducts()
    res.status(200).json(companies)
  } catch (error) {
    console.error('Erro ao buscar empresas e produtos:', error)
    res.status(500).json({ message: 'Erro ao buscar empresas e produtos' })
  }
})

export default publicRouter
