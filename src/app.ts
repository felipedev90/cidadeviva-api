import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config/env.js'

const app = express()

// SEGURANÇA **
app.use(helmet())
app.use(cors({ origin: env.NODE_ENV === 'development' ? '*' : [] }))

// PARSING DE JSON
app.use(express.json())

// ROTA DE HEALTH CHECK
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'API online ✌️' })
})

export { app }
