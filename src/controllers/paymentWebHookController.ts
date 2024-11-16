import 'dotenv/config';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import type { Request, Response } from 'express';
import { accessToken } from '@/config/mercadoPagoConfig';

const prisma = new PrismaClient();

// Função para validar a assinatura do webhook
const verifyWebhookSignature = (req: Request): boolean => {
  const secret = process.env.WEBHOOK_SECRET;
  console.log("🚀 ~ verifyWebhookSignature ~ secret:", secret)
  const payload = JSON.stringify(req.body);
  const signature = req.headers['x-mercadopago-signature'] as string;
  console.log("🚀 ~ verifyWebhookSignature ~ signature:", signature)

  if (!secret || !signature) {
    console.error('Assinatura ou segredo ausentes');
    return false;
  }

  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return hash === signature;
};

// Função para buscar detalhes do pagamento pelo ID
const getPaymentDetails = async (paymentId: string) => {
  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('Detalhes do pagamento:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do pagamento:', (error as any).response?.data || (error as Error).message);
    throw new Error('Erro ao buscar detalhes do pagamento');
  }
};

// Função principal do webhook
export const webHook = async (req: Request, res: Response) => {
  try {
    // Validação da assinatura
    if (!verifyWebhookSignature(req)) {
      return res.status(403).send('Assinatura inválida');
    }

    const notification = req.body;
    console.log('Notificação recebida:', notification);

    // Confirma recebimento para o Mercado Pago
    res.status(200).send('OK');

    // Processar a notificação recebida de forma assíncrona
    processNotification(notification).catch((err) =>
      console.error('Erro ao processar notificação:', err)
    );
  } catch (error) {
    console.error('Erro ao processar notificação:', (error as Error).message);
    res.status(500).send('Erro ao processar notificação');
  }
};

// Função para processar as notificações recebidas
const processNotification = async (notification: any) => {
  const { type, id } = notification;

  if (type === 'payment') {
    // Obtém os detalhes do pagamento usando o `id`
    const paymentDetails = await getPaymentDetails(id);

    // Atualiza o status no banco de dados
    await updatePaymentStatus(paymentDetails);
  } else {
    console.log(`Tipo de notificação não suportado: ${type}`);
  }
};

// Função para atualizar o status do pagamento no banco de dados
const updatePaymentStatus = async (paymentDetails: any) => {
  try {
    const { id, status, transaction_amount, payer, payment_type_id } = paymentDetails;

    await prisma.payment.upsert({
      where: { payment_id: id },
      update: { status, transaction_amount },
      create: {
        payment_id: id,
        status,
        transaction_amount,
        payer_email: payer.email,
        payment_method: payment_type_id,
      },
    });

    console.log('Status do pagamento atualizado no banco');
  } catch (error) {
    console.error('Erro ao atualizar status no banco:', (error as Error).message);
    throw new Error('Erro ao atualizar status do pagamento no banco');
  }
};
