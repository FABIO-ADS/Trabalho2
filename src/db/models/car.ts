import mongoose from 'mongoose'

const CarSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },

  marca: {
    type: String,
    required: true
  },

  placa: {
    type: String,
    required: true
  },

  chassis: {
    type: String,
    required: true
  },

  ano: {
    type: Number,
    require: true
  },

  quilometragem: {
    type: String,
    require: true
  },

  foto: {
    type: String,
    require: true
  }
})

export default mongoose.model('car', CarSchema)
