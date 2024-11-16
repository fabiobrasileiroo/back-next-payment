import type { PaymentData } from '@/@types/PaymentData';
import type { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Controller for creating a payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentData = req.body;
    console.log(req.body);

    // Validation to ensure transaction amount is above a minimum threshold
    // if (paymentData.transaction_amount < 1.0) {
    //   return res.status(400).json('Valor deve ser maior que 1 real');
    // }

    console.log('🚀 ~ createPayment ~ paymentData:', paymentData);

    // Call to the payment service to create a payment
    const paymentResponse = await paymentService.createPayment(paymentData);
    console.log("🚀 ~ createPayment ~ paymentResponse:", paymentResponse)
    return res.status(201).json(paymentResponse);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return res.status(400).json({ message: (error as Error).message });
  }
};

// Function to store payment details in the database
export const storePayment = async (paymentResponse: any) => {
  try {
    const paymentData = {
      transaction_amount: paymentResponse.body.transaction_amount,
      status: paymentResponse.body.status,
      payer_email: paymentResponse.body.payer.email,
      payment_method: paymentResponse.body.payment_method_id,
      payment_id: paymentResponse.body.id,
    };

    // Save payment record to the database
    const paymentRecord = await prisma.payment.create({
      data: paymentData,
    });

    console.log('Pagamento salvo no banco:', paymentRecord);
    return paymentRecord;
  } catch (error) {
    console.error('Erro ao salvar pagamento:', error);
    throw new Error('Erro ao salvar pagamento no banco');
  }
};

// Update function for the PIX key for a specific unit
export const updatePixKey = async (req: Request, res: Response) => {
  const { unitId } = req.params; // ID da unidade
  const { pixKey } = req.body;   // Chave PIX recebida no body da requisição

  try {
    // Update the PIX key for the specified unit
    const updatedUnit = await prisma.unit.update({
      where: { id: Number(unitId) },
      data: { pixKey },
    });

    return res.status(200).json({
      message: 'Chave PIX atualizada com sucesso!',
      unit: updatedUnit,
    });
  } catch (error) {
    console.error('Erro ao atualizar a chave PIX:', error);
    return res.status(500).json({ message: 'Erro ao atualizar a chave PIX' });
  }
};
