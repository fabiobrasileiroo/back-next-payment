import 'dotenv/config';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

// Função para validar a assinatura do webhook
const verifyWebhookSignature = (req: Request): boolean => {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.error('Segredo (WEBHOOK_SECRET) ausente no ambiente.');
    return false;
  }

  // Cabeçalho x-signature
  const signatureHeader = req.headers['x-signature'] as string;
  if (!signatureHeader) {
    console.error('Cabeçalho x-signature ausente.');
    return false;
  }

  console.log('🚀 ~ verifyWebhookSignature ~ signatureHeader:', signatureHeader);

  // Extrair timestamp (ts) e hash (v1) do cabeçalho
  const match = signatureHeader.match(/ts=(\d+),v1=([a-f0-9]+)/);
  if (!match) {
    console.error('Formato inválido no cabeçalho x-signature.');
    return false;
  }

  const [, timestamp, receivedHash] = match;

  console.log('🚀 ~ verifyWebhookSignature ~ timestamp:', timestamp);
  console.log('🚀 ~ verifyWebhookSignature ~ receivedHash:', receivedHash);

  // Recalcular o hash
  const payload = JSON.stringify(req.body);
  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(`ts=${timestamp}${payload}`)
    .digest('hex');

  console.log('🚀 ~ verifyWebhookSignature ~ calculatedHash:', calculatedHash);

  // Comparar o hash recebido com o calculado
  const isValid = receivedHash === calculatedHash;
  if (!isValid) {
    console.error('Assinatura inválida. Hash não corresponde.');
  }

  return isValid;
};

// Função para buscar detalhes do pagamento pelo ID
const getPaymentDetails = async (paymentId: string) => {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
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
    console.error(
      'Erro ao buscar detalhes do pagamento:',
      (error as any).response?.data || (error as Error).message
    );
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
