import { Router } from 'express'
import multer from 'multer'
import { uploadImages } from '../controllers/upload.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
})

router.post('/', protect, upload.array('images', 10), uploadImages)

export default router