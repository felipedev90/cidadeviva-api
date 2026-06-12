import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env.js'
import postRoutes from './routes/post.routes.js'
import authRoutes from './routes/auth.routes.js'

import './models/user.model.js'
import './models/post.model.js'

const app = express()

// SEGURANÇA **
app.use(helmet())
app.use(cors({ origin: env.NODE_ENV === 'development' ? '*' : [] }))

// PARSING DE JSON
app.use(express.json())

// ROTAS
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use('/api/v1', postRoutes)
app.use('/api/v1/auth', authRoutes)

// ROTA DE HEALTH CHECK
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'API online ✌️' })
})

export { app }
