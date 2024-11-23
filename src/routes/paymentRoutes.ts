import { UserRole } from '@prisma/client'
import express from 'express'
import { createPayment, getPayments } from '../controllers/paymentController'
// import { checkPaymentStatus, webHook } from '@/controllers/hook.payment.controller'
import authenticate from '../middleware/authenticate' // Middleware de autenticação
import authorize from '../middleware/authorize' // Middleware de autorização

const router = express.Router()

router.use(authenticate)


// Route for creating a payment
router.post('/', createPayment)

// router.post('/webhook', webHook)

router.get('/getPayments', authorize([UserRole.ADMIN]) ,getPayments)

// Endpoint para verificar o status do pagamento
// router.get('/check-payment-status/:paymentId', checkPaymentStatus);

export default router
