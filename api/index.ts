import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import MongoServer from './db/db'
import car from './routes/car'
dotenv.config()

MongoServer()
const app = express()
const port = process.env.PORT || 3900

app.use(cors())
app.use(express.urlencoded({ extended: true })) //permite acentos na URL
app.use(express.json()) // Irá fazer o parse de arquivos JSON
//Configura o favicon
app.use('/favicon.ico', express.static('public/favicon.ico'))
//Rotas de conteúdo público
app.use('/', express.static('public'))
// Rotas do app
app.use('/api/v1/car', car)

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'API Fatec Mobile 100% funcional🖐',
    version: '1.0.0'
  })
})
//Rota para tratar erros - deve ser sempre a última!
app.use(function (req, res) {
  res.status(404).json({
    errors: [
      {
        value: `${req.originalUrl}`,
        msg: `A rota ${req.originalUrl} não existe nesta API!`,
        param: 'invalid route'
      }
    ]
  })
})
app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}!🚀`)
})
