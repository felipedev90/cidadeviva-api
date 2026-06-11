import mongoose from 'mongoose'
import { env } from './env.js'

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.DATABASE_URL, { family: 4 })
  console.log('Banco de dados conectado com sucesso! 🫡')
}
