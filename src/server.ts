import { setDefaultResultOrder } from 'dns'
setDefaultResultOrder('ipv4first')
import 'dotenv/config'
import { app } from './app.js'
import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase()
    app.listen(env.PORT, () => {
      console.log(`Servidor rodando na porta ${String(env.PORT)} 🚀`)
    })
  } catch (error) {
    console.error('Erro ao iniciar o servidor 😢:', error)
    process.exit(1)
  }
}

void startServer()
