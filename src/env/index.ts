import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  accessToken: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  IMGBB_API_KEY: z.string(),
  PORT: z.coerce.number().default(3000),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('🚨❗ Invalid enviroment variable')
  throw new Error('Invalid environment variables')
}

export const env = _env.data
