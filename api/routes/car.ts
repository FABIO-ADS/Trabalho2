import express from 'express'
const router = express.Router()
import { check, validationResult } from 'express-validator'

import Car from '../db/models/car'

const validaCarro = [
  check('nome', 'O nome do Carro é obrigatório').not().isEmpty(),
  check('marca', 'A marca do Carro é obrigatória').not().isEmpty(),
  check('placa', 'A placa do Carro é obrigatória').not().isEmpty(),
  check('placa', 'Formato de placa inválida').matches(
    /[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/
  ),
  check('chassis', 'O chassis do Carro é obrigatório').not().isEmpty(),
  check('chassis', 'O chassis do Carro tem 11 caracteres').isLength({
    min: 11,
    max: 11
  }),
  check('ano', 'O ano do Carro é obrigatório').not().isEmpty(),
  check('ano', 'O formato do ano é inválido')
    .exists()
    .custom((value: string) => value.length == 4 && !isNaN(parseFloat(value))),
  check('quilometragem', 'A quilometragem do Carro é obrigatória')
    .not()
    .isEmpty(),
  check('foto', 'A foto do Carro é obrigatória').not().isEmpty()
]

router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const car = await Car.find()
    res.json(car)
  } catch (err) {
    res.status(500).send({
      errors: [{ message: 'Não foi possível encontrar carros' }]
    })
  }
})

router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const carro = await Car.findById(req.params.id)
    if (!carro) {
      res.status(500).send({
        errors: [
          {
            message: `Não foi possível obter o Carro com o _id informado ${req.params.id}`
          }
        ]
      })
    }
    res.json(carro)
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message: `Não foi possível obter o Carro com o _id informado ${req.params.id}`
        }
      ]
    })
  }
})

router.get(
  '/nome/:nome',
  async (req: express.Request, res: express.Response) => {
    try {
      const carro = await Car.find({ nome: req.params.nome })
      if (!carro) {
        res.status(500).send({
          errors: [
            {
              message: `Não foi possível obter o Carro com o nome informado ${req.params.nome}`
            }
          ]
        })
      }
      res.json(carro)
    } catch (err) {
      res.status(500).send({
        errors: [
          {
            message: `Não foi possível obter o Carro com o nome informado ${req.params.nome}`
          }
        ]
      })
    }
  }
)

router.post(
  '/',
  validaCarro,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      })
    }
    try {
      const car = new Car(req.body)
      await car.save()
      res.send(car)
    } catch (err: any) {
      return res.status(500).json({
        errors: [{ message: `Erro ao criar o Carro: ${err.message}` }]
      })
    }
  }
)

router.put(
  '/:id',
  validaCarro,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      })
    }
    try {
      const dados = req.body
      await Car.findByIdAndUpdate(req.params.id, { $set: dados }, { new: true })
        .then((Car) => {
          res.send({
            message: `O carro ${Car?.nome} foi alterado com sucesso`
          })
        })
        .catch(() => {
          return res.status(500).send({
            message: `Erro ao alterar o Carro com o Código ${req.params.id}`
          })
        })
    } catch (err: any) {
      return res.status(500).json({
        errors: [{ message: `Erro ao alterar o Carro: ${err.message}` }]
      })
    }
  }
)

router.delete('/:id', async (req: express.Request, res: express.Response) => {
  await Car.findByIdAndRemove(req.params.id)
    .then((car) => {
      res.send({
        message: `O Carro ${car?.nome} foi removido com sucesso`
      })
    })
    .catch(() => {
      return res.status(400).send({
        errors: [
          {
            message: `Não foi possível excluir o Carro com o id digitado ${req.params.id}`
          }
        ]
      })
    })
})

export default router
