import 'dotenv/config'
import axios from 'axios'
import * as crypto from 'crypto'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Function to validate the webhook signature
const verifyWebhookSignature = (req: Request): boolean => {
  console.log('aqui?')
  console.log("🚀 ~ verifyWebhookSignature ~ req:", req);

  const secret = process.env.WEBHOOK_SECRET
  if (!secret) {
    console.error('Segredo (WEBHOOK_SECRET) ausente no ambiente.')
    return false
  }

  const signatureHeader = req.headers['x-signature'] as string
  const xRequestId = req.headers['x-request-id'] as string

  if (!signatureHeader || !xRequestId) {
    console.error('Cabeçalhos x-signature ou x-request-id ausentes.')
    return false
  }

  // Extract ts and v1 from x-signature header
  const match = signatureHeader.match(/^ts=(\d+),v1=([a-f0-9]+)$/)
  if (!match) {
    console.error('Formato inválido no cabeçalho x-signature.')
    return false
  }

  const [, timestamp, receivedHash] = match
  const notificationId = req.query['id'] || req.query['data.id'] || req.body.id
  if (!notificationId) {
    console.error('notificationId ausente.')
    return false
  }

  console.log('🚀 ~ verifyWebhookSignature ~ notificationId:', notificationId)
  console.log('🚀 ~ verifyWebhookSignature ~ xRequestId:', xRequestId)

  // Timestamp validation (optional)
  // const TOLERANCE_IN_SECONDS = 300; // 5 minutos
  // const currentTimestamp = Math.floor(Date.now() / 1000); // Em segundos
  // if (Math.abs(currentTimestamp - parseInt(timestamp, 10)) > TOLERANCE_IN_SECONDS) {
  //   console.error('Timestamp fora do intervalo de tolerância.');
  //   return false;
  // }

  // Compose the manifest string for validation
  const manifest = `id:${notificationId};request-id:${xRequestId};ts:${timestamp};`
  console.log('🚀 ~ verifyWebhookSignature ~ manifest:', manifest)

  // Generate the HMAC hash
  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  console.log('Calculated Hash:', calculatedHash)
  console.log('Received Hash:', receivedHash)

  console.log(calculatedHash === receivedHash)
  return calculatedHash === receivedHash
}

// Function to fetch payment details by ID
const getPaymentDetails = async (paymentId: string) => {
  try {
    const accessToken = process.env.PROD_ACCESS_TOKEN
    if (!accessToken) {
      throw new Error('Access token não configurado.')
    }

    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn(`Pagamento ${paymentId} não encontrado.`)
        return null // Retornar null se não encontrado
      }
      console.error(
        'Erro Axios ao buscar detalhes do pagamento:',
        error.response?.data || error.message
      )
    } else {
      console.error('Erro desconhecido ao buscar detalhes do pagamento:', error)
    }
    throw new Error('Erro ao buscar detalhes do pagamento')
  }
}

// Webhook handler
export const webHook = async (req: Request, res: Response) => {
  console.log('aqui?1')
  try {
    if (!verifyWebhookSignature(req)) {
      return res.status(403).send('Assinatura inválida')
    }

    const notification = req.body
    console.log('Notificação recebida:', notification)

    res.status(200).send('OK') // Confirm receipt

    processNotification(notification).catch(err =>
      console.error('Erro ao processar notificação:', err)
    )
  } catch (error) {
    console.error(
      'Erro ao processar notificação:',
      error instanceof Error ? error.message : error
    )
    res.status(500).send('Erro ao processar notificação')
  }
}

// Process notification
const processNotification = async (notification: any) => {
  try {
    const notificationId = notification.data.id
    const topic = notification.type
    console.log('127 - 🚀 ~ processNotification ~ topic:', topic)

    if (!notificationId || !topic) {
      throw new Error('Notificação incompleta: ID ou tipo ausente.')
    }

    if (topic === 'payment') {
      const paymentDetails = await getPaymentDetails(notificationId)
      if (paymentDetails) {
        await updatePaymentStatus(paymentDetails)
      } else {
        console.warn(
          `Detalhes do pagamento não encontrados para ID: ${notificationId}`
        )
      }
    } else if (topic === 'merchant_order') {
      console.log('Notificação de merchant order recebida:', notification)
      // Custom logic for merchant orders
    } else {
      console.warn(`Tipo de notificação não suportado: ${topic}`)
    }
  } catch (error) {
    console.error(
      'Erro ao processar notificação:',
      error instanceof Error ? error.message : error
    )
    throw error // Repassar erro para logs adicionais
  }
}

const updatePaymentStatus = async (paymentDetails: any) => {
  try {
    const {
      id: paymentId,
      status,
      transaction_amount,
      payer,
      payment_type_id,
    } = paymentDetails

    console.log('Atualizando status no banco:', {
      payment_id: paymentId,
      status,
      transaction_amount,
      payer_email: payer?.email || 'N/A',
      payment_method: payment_type_id,
    })

    // Verificar se o pagamento já existe no banco
    const existingPayment = await prisma.payment.findUnique({
      where: { payment_id: BigInt(paymentId) }, // Converter o id recebido para BigInt
    })

    if (existingPayment) {
      // Atualizar pagamento existente
      await prisma.payment.update({
        where: { payment_id: BigInt(paymentId) },
        data: {
          status,
          transaction_amount,
          payer_email: payer?.email || 'N/A',
          payment_method: payment_type_id,
        },
      })
      console.log(`Pagamento ${paymentId} atualizado com sucesso.`)
    } else {
      // Criar novo registro de pagamento
      await prisma.payment.create({
        data: {
          payment_id: BigInt(paymentId), // Certifique-se de salvar como BigInt
          status,
          transaction_amount,
          payer_email: payer?.email || 'N/A',
          payment_method: payment_type_id,
        },
      })
      console.log(`Pagamento ${paymentId} criado com sucesso.`)
    }
  } catch (error) {
    console.error(
      'Erro ao atualizar ou criar pagamento no banco:',
      error instanceof Error ? error.message : error
    )
    throw new Error('Erro ao atualizar ou criar pagamento no banco.')
  }
}

export const checkPaymentStatus = async (req:Request, res: Response) => {
  const paymentId = req.params.paymentId;
  const accessToken = process.env.PROD_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ error: 'Access token não configurado.' });
  }

  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Retorna o status do pagamento para o frontend
    const { status, status_detail } = response.data;
    res.json({ status, status_detail });
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', (error as Error).message);
    res.status(500).json({ error: 'Erro ao verificar status do pagamento.' });
  }
}