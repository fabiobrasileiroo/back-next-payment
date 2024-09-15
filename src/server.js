import app from './app.js'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    // Conectar ao banco de dados PostgreSQL (se for necessário conectar a um banco local para testes)
    // await mongoose.connect(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(`Error starting server: ${error.message}`)
  }
}

startServer()
