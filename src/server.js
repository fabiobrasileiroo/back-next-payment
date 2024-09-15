import app from './app.js'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(`Error starting server: ${error.message}`)
  }
}

startServer()
