import { Router } from 'express'
import { register, login, getAllUsers } from '../controllers/auth.controller'
import { protect, authorize } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/users', protect, authorize('ADMIN'), getAllUsers)

export default router