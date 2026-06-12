import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'O conteúdo do comentário é obrigatório')
    .max(500, 'O comentário deve conter no máximo 500 caracteres'),
})

export const updateCommentSchema = createCommentSchema.partial()

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
