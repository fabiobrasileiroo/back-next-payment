export interface PaymentData {
  document: string | undefined // Documento do pagador, caso seja necessário
  last_name: string | undefined // Sobrenome do pagador
  first_name: string | undefined // Primeiro nome do pagador
  email: string | undefined // Email do pagador
  transaction_amount: number // Valor da transação
  description: string // Descrição do pagamento
  payment_method_id: string // ID do método de pagamento (ex: 'pix')

  // Informações do pagador
  payer: {
    email: string // Email do pagador
    first_name: string // Primeiro nome do pagador
    last_name: string // Sobrenome do pagador
    identification: {
      type: string // Tipo de documento (ex: 'CPF' ou 'CNPJ')
      number: string // Número do documento (CPF ou CNPJ)
    }
  }

  notification_url?: string // URL de notificação opcional para callbacks de status do pagamento
  external_reference?: string // Referência externa opcional, útil para rastrear pedidos no seu sistema

  productId: number // ID do produto associado ao pagamento
}
