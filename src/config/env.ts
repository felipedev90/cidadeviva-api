import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(10),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.enum(['1d', '7d', '30d']).default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
})

export const env = envSchema.parse(process.env)
