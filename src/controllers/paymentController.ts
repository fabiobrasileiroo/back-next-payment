import type { PaymentData } from '@/@types/PaymentData'
import type { Request, Response } from 'express'
import * as paymentService from '../services/paymentService'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Controller for creating a payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentData = req.body
    console.log('🚀 ~ createPayment ~ paymentData:', paymentData)

    // Create or fetch the product associated with the payment
    let product = await prisma.product.findFirst({
      where: { name: paymentData.description },
    })

    if (!product) {
      // Create the product if it doesn't exist
      product = await prisma.product.create({
        data: {
          name: paymentData.description,
          price: paymentData.transaction_amount,
          companyId: 1, // Replace with the actual company ID or get it from paymentData
          quantity: 1,
        },
      })
    }

    // Call to the payment service to create a payment
    const paymentResponse: any = await paymentService.createPayment(paymentData)
    console.log('🚀 ~ createPayment ~ paymentResponse:', paymentResponse)

    // Ensure the payment response contains the expected structure
    if (!paymentResponse || typeof paymentResponse !== 'object') {
      throw new Error('Resposta inválida do serviço de pagamento.')
    }

    // Store payment details in the database
    await storePayment(paymentResponse, product.id)

    return res.status(201).json(paymentResponse)
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return res.status(400).json({ message: (error as Error).message })
  }
}

// Function to store payment details in the database
export const storePayment = async (paymentResponse: any, productId: number) => {
  try {
    // Validate and map payment data
    const transactionAmount = paymentResponse.transaction_amount || 0
    const status = paymentResponse.status || 'unknown'
    const payerEmail = paymentResponse.payer?.email || ''
    const paymentMethod = paymentResponse.payment_method_id || ''
    const paymentId = BigInt(paymentResponse.id || 0) // Convert to BigInt

    if (!paymentId) {
      throw new Error('ID do pagamento ausente na resposta.')
    }

    const paymentData = {
      transaction_amount: transactionAmount,
      status,
      payer_email: payerEmail,
      payment_method: paymentMethod,
      payment_id: paymentId, // Store as BigInt
      productId, // Associate the payment with the product
    }

    // Save payment record to the database
    const paymentRecord = await prisma.payment.create({
      data: paymentData,
    })

    console.log('Pagamento salvo no banco:', paymentRecord)
    return paymentRecord
  } catch (error) {
    console.error('Erro ao salvar pagamento:', error)
    throw new Error('Erro ao salvar pagamento no banco')
  }
}
// Extensão do BigInt para TypeScript
declare global {
  interface BigInt {
    toJSON: () => string;
  }
}
export const getPayments = async (req: Request, res: Response) => {
  // Corrigindo a serialização do BigInt para JSON
  BigInt.prototype.toJSON = function () {
    // Convertendo BigInt para string para evitar perda de dados
    return this.toString();
  };

  try {
    // Obtendo os pagamentos
    const products = await paymentService.getPayments();
    console.log("🚀 ~ getPayments ~ products:", products);

    // Convertendo o campo 'payment_id' (assumindo que seja BigInt) para string dentro de cada item
    const productsString = products.map((product: any) => ({
      ...product,
      payment_id: product.payment_id.toString(), // Convertendo explicitamente
    }));

    console.log("🚀 ~ getPayments ~ productsString:", productsString);

    // Enviando a resposta
    res.status(200).json(productsString);
  } catch (error) {
    // Tratando erros de forma genérica
    console.error("Erro ao obter os pagamentos:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};
