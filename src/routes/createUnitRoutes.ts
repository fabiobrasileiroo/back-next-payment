import express from 'express'
import { createUnitInCompany } from '@/controllers/createUnitInCompany'
import authenticate from '../middleware/authenticate'
import authorize from '../middleware/authorize'

const createUnitRouter = express.Router()

// Rota protegida para criar unidades dentro da empresa do administrador
createUnitRouter.post(
  '/create-unit',
  authenticate,
  authorize(['ADMIN']),
  createUnitInCompany
)

export default createUnitRouter
