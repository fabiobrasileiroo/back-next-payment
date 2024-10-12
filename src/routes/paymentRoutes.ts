import express from 'express'
import { createPayment } from '../controllers/paymentController'

const router = express.Router()

// Route for creating a payment
router.post('/', createPayment)

router.get('/simulate-payment', async (req, res) => {
  try {
    // Chamando a função de simulação de pagamento PIX
    // await simulatePixPayment();
    res.send('Simulação de pagamento com PIX realizada com sucesso!');
  } catch (error) {
    console.error('Erro ao simular o pagamento:', error);
    res.status(500).send('Erro ao simular pagamento');
  }
});


export default router
