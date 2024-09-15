import express from 'express'
import { createPayment } from '../controllers/paymentController.js'

const router = express.Router()

// Rota para criar um novo pagamento
router.post('/', createPayment)

export default router
