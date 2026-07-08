import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js'
import { User } from '../models/user.model.js'
import { env } from '../config/env.js'
import { catchAsync } from '../utils/catch-async.js'

export const register = catchAsync(
  async (req: Request<object, object, RegisterInput>, res: Response): Promise<void> => {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({
      email,
    })

    if (existingUser) {
      res.status(409).json({
        status: 'fail',
        message: 'E-mail já cadastrado',
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign({ id: String(newUser._id) }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    })

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      },
    })
  },
)

export const login = catchAsync(
  async (req: Request<object, object, LoginInput>, res: Response): Promise<void> => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      res.status(401).json({
        status: 'fail',
        message: 'Credenciais inválidas',
      })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      res.status(401).json({
        status: 'fail',
        message: 'Credenciais inválidas',
      })
      return
    }

    const token = jwt.sign(
      {
        id: String(user._id),
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN,
      },
    )

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    })
  },
)

export const getMe = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.userId).select('name email')

  if (!user) {
    res.status(404).json({ status: 'fail', message: 'Usuário não encontrado' })
    return
  }

  res.status(200).json({ status: 'success', data: { user } })
})
