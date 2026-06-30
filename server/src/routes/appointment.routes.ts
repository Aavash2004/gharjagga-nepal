import { Router } from 'express'
import {
  createAppointment,
  getMyAppointments,
  getReceivedAppointments,
  updateAppointmentStatus
} from '../controllers/appointment.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.post('/', protect, createAppointment)
router.get('/my', protect, getMyAppointments)
router.get('/received', protect, getReceivedAppointments)
router.patch('/:id', protect, updateAppointmentStatus)

export default router