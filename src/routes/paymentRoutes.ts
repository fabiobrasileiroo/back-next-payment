import express from 'express';
import { createPayment } from '../controllers/paymentController';

const router = express.Router();

// Route to create a new payment
router.post('/', createPayment);

export default router;
