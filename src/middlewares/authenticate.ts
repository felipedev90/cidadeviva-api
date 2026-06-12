import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { Request, Response, NextFunction } from 'express'

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({
      status: 'error',
      message: 'Token de autenticação não fornecido',
    })
    return
  }

  const token = authHeader.split(' ')[1]
  if (!authHeader.startsWith('Bearer ') || !token) {
    res.status(401).json({
      status: 'fail',
      message: 'Formato de token inválido',
    })
    return
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string }
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({
      status: 'error',
      message: 'Token de autenticação inválido',
    })
  }
}
