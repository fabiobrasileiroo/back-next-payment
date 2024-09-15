// validation.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  // Adicione outras validações conforme necessário
});

export const paymentDataSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  // Adicione outras validações conforme necessário
});
