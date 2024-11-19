import express from 'express'
import { createPayment } from '../controllers/paymentController'
import { checkPaymentStatus, webHook } from '@/controllers/hook.payment.controller'

const router = express.Router()

// Route for creating a payment
router.post('/', createPayment)

router.post('/webhook', webHook)

// Endpoint para verificar o status do pagamento
router.get('/check-payment-status/:paymentId', checkPaymentStatus);

export default router
