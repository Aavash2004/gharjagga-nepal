import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { uploadToCloudinary } from '../utils/cloudinary'

export const uploadImages = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    const uploadPromises = files.map(file => uploadToCloudinary(file.buffer))
    const urls = await Promise.all(uploadPromises)

    res.json({ message: 'Images uploaded successfully', urls })
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' })
  }
}