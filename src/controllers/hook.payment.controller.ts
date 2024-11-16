import 'dotenv/config';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import type { Request, Response } from 'express';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();

// Middleware para capturar o raw body
const captureRawBody = bodyParser.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf.toString(); // Captura o corpo bruto da requisição
  },
});

// Função para validar a assinatura do webhook
const verifyWebhookSignature = (req: any): boolean => {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.error('Segredo (WEBHOOK_SECRET) ausente no ambiente.');
    return false;
  }

  const signatureHeader = req.headers['x-signature'] as string;
  const xRequestId = req.headers['x-request-id'] as string;
  if (!signatureHeader || !xRequestId) {
    console.error('Cabeçalhos x-signature ou x-request-id ausentes.');
    return false;
  }

  console.log('🚀 ~ verifyWebhookSignature ~ signatureHeader:', signatureHeader);

  const match = signatureHeader.match(/ts=(\d+),v1=([a-f0-9]+)/);
  if (!match) {
    console.error('Formato inválido no cabeçalho x-signature.');
    return false;
  }

  const [, timestamp, receivedHash] = match;
  const rawBody = req.rawBody || JSON.stringify(req.body);

  const manifest = `id:${req.query['data.id']};request-id:${xRequestId};ts:${timestamp};${rawBody}`;
  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  console.log('🚀 ~ verifyWebhookSignature ~ calculatedHash:', calculatedHash);

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
    if (!accessToken) {
      throw new Error('Access token não configurado.');
    }

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
    const paymentDetails = await getPaymentDetails(id);
    await updatePaymentStatus(paymentDetails);
  } else if (type === 'merchant_order') {
    console.log('Notificação de merchant order recebida:', notification);
    // Processar a lógica de merchant_order aqui, se necessário
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

// Exportar o middleware para capturar o raw body
export { captureRawBody };
