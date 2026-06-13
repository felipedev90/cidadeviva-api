import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/app-error.js'

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
    return
  }

  console.error(err)
  res.status(500).json({
    status: 'error',
    message: 'Algo deu errado. Tente novamente mais tarde.',
  })
}
