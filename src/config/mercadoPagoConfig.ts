import 'dotenv/config';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Check if the environment is production
const isProduction = process.env.ENVIRONMENT === 'production';

// Obtain the correct accessToken based on environment
const accessToken: string = isProduction 
  ? (process.env.PROD_ACCESS_TOKEN as string)
  : (process.env.SANDBOX_ACCESS_TOKEN as string);

// Define the clientSecret, if needed separately
const clientSecret: string = isProduction 
  ? (process.env.PROD_CLIENT_SECRET as string) 
  : '';

// Create the MercadoPagoConfig instance with only the accessToken
const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  },
});

// Pass only the mercadoPagoConfig to the Payment constructor
export const payment = new Payment(mercadoPagoConfig);
