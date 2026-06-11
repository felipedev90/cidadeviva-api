import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve conter pelo menos 2 caracteres'),
  email: z.email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres'),
})

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
