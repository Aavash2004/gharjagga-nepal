import { Router } from 'express'
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  getMyProfile,
  bookConsultation
} from '../controllers/lekhapadhi.controller'
import { protect, authorize } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getAllProfiles)
router.get('/my-profile', protect, authorize('LEKHAPADHI'), getMyProfile)
router.get('/:id', getProfileById)
router.post('/', protect, authorize('LEKHAPADHI'), createProfile)
router.post('/consultation', protect, bookConsultation)

export default router