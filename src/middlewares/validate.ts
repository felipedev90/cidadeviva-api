import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export const validate =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        status: 'fail',
        message: 'Dados inválidos',
        errors: z.treeifyError(result.error),
      })
      return
    }

    req.body = result.data
    next()
  }
