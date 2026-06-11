// Validação Zod da entrada de dados para criar um post
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(5, 'O título deve conter pelo menos 5 caracteres'),
  slug: z.string().min(3, 'O slug deve conter pelo menos 3 caracteres'),
  content: z.string().min(10, 'O conteúdo deve conter pelo menos 10 caracteres'),
  excerpt: z.string().max(300, 'O resumo deve conter no máximo 300 caracteres'),
  category: z.enum(['ciclismo', 'gastronomia', 'cultura', 'eventos']),
  published: z.boolean().optional(),
  author: z.string(),
})

// Esquema para atualização de post, onde todos os campos são opcionais
export const updatePostSchema = createPostSchema.partial()

// Tipos inferidos a partir dos esquemas Zod, para serem usados na validação dos dados de entrada.
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
