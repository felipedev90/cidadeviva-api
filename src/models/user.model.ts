import { Schema, model } from 'mongoose'

type UserRole = 'author' | 'admin'

type UserDocument = {
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      minlength: [2, 'O nome deve conter pelo menos 2 caracteres'],
      maxlength: [100, 'O nome deve conter no máximo 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [8, 'A senha deve conter pelo menos 8 caracteres'],
      select: false,
    },
    role: {
      type: String,
      enum: ['author', 'admin'],
      default: 'author',
    },
  },
  { timestamps: true },
)

export const User = model<UserDocument>('User', userSchema)
