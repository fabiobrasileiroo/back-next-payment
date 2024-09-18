export interface PaymentData {
  transaction_amount: number
  description: string
  payment_method_id: string
  payer: {
    email: string
  }
  // Adicione outros campos conforme necessário
}
