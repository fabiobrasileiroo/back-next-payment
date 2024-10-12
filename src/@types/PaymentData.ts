export interface PaymentData {
  document: string | undefined;
  last_name: string | undefined;
  first_name: string | undefined;
  email: string | undefined;
  transaction_amount: number; // Valor da transação
  description: string; // Descrição do pagamento
  payment_method_id: string; // ID do método de pagamento (ex: 'pix')
  payer: {
    email: string; // Email do pagador
    first_name: string; // Primeiro nome do pagador
    last_name: string; // Sobrenome do pagador
    identification: {
      type: string; // Tipo de documento (ex: 'CPF' ou 'CNPJ')
      number: string; // Número do documento (CPF ou CNPJ)
    };
  };
  notification_url?: string; // URL de notificação opcional para callbacks de status do pagamento
  external_reference?: string; // Referência externa opcional, útil para rastrear pedidos no seu sistema

  // Add the productId property here
  productId: number; // ID of the associated product
}
