import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth.middleware'
import { Request } from 'express'

const prisma = new PrismaClient()

// Create or update Lekhapadhi profile
export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { officeName, officeAddress, district, experience, services, bio, availability, avatar } = req.body

    const existing = await prisma.lekhapadhiProfile.findUnique({
      where: { userId: req.user!.id }
    })

    let profile
    if (existing) {
      profile = await prisma.lekhapadhiProfile.update({
        where: { userId: req.user!.id },
        data: { officeName, officeAddress, district, experience: parseInt(experience), services, bio, availability, avatar }
      })
    } else {
      profile = await prisma.lekhapadhiProfile.create({
        data: {
          userId: req.user!.id,
          officeName, officeAddress, district,
          experience: parseInt(experience),
          services, bio, availability, avatar
        }
      })
    }

    res.status(201).json({ message: 'Profile saved successfully', profile })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all Lekhapadhi officers (directory)
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const { district } = req.query

    const filters: any = {}
    if (district) filters.district = district

    const profiles = await prisma.lekhapadhiProfile.findMany({
      where: filters,
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } }
      },
      orderBy: { experience: 'desc' }
    })

    res.json({ profiles })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get single profile
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const profile = await prisma.lekhapadhiProfile.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } }
      }
    })

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.json({ profile })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get my own profile (for Lekhapadhi user)
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.lekhapadhiProfile.findUnique({
      where: { userId: req.user!.id }
    })

    res.json({ profile })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Book a consultation
export const bookConsultation = async (req: AuthRequest, res: Response) => {
  try {
    const { lekhapadhiId, service, message } = req.body

    const consultation = await prisma.consultation.create({
      data: {
        lekhapadhiId: parseInt(lekhapadhiId),
        clientId: req.user!.id,
        service,
        message
      }
    })

    res.status(201).json({ message: 'Consultation requested successfully', consultation })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}