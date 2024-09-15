import express from 'express'
import { createPayment } from '../controllers/paymentController'

const router = express.Router()

// Route for creating a payment
router.post('/', createPayment)

export default router
