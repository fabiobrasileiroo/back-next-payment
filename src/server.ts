import dotenv from 'dotenv'
import app from './app'

dotenv.config()

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(`Error starting server: ${(error as Error).message}`)
  }
}

startServer()
