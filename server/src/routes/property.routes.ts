import { Router } from 'express'
import {
  createProperty,
  getProperties,
  getPropertyById,
  deleteProperty,
  verifyProperty
} from '../controllers/property.controller'
import { protect, authorize } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getProperties)
router.get('/:id', getPropertyById)
router.post('/', protect, authorize('SELLER', 'AGENT', 'ADMIN'), createProperty)
router.delete('/:id', protect, deleteProperty)
router.patch('/:id/verify', protect, authorize('ADMIN'), verifyProperty)

export default router