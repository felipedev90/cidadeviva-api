import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'
import { authenticate } from '../middlewares/authenticate.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authenticate, getMe)
export default router
