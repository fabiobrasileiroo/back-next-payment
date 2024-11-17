import dotenv from 'dotenv'
import app from './app'

dotenv.config()

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    // Alterar para '0.0.0.0'
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`)
    })
  } catch (error) {
    console.error(`Error starting server: ${(error as Error).message}`)
  }
}

startServer()
