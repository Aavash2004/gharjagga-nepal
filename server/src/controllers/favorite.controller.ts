import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth.middleware'

const prisma = new PrismaClient()

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.body

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user!.id,
        propertyId: parseInt(propertyId)
      }
    })

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      return res.json({ message: 'Removed from favorites', favorited: false })
    }

    await prisma.favorite.create({
      data: {
        userId: req.user!.id,
        propertyId: parseInt(propertyId)
      }
    })

    res.json({ message: 'Added to favorites', favorited: true })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getMyFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      include: {
        property: {
          include: {
            owner: { select: { id: true, name: true, phone: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ favorites })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const checkFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user!.id,
        propertyId: parseInt(propertyId)
      }
    })

    res.json({ favorited: !!existing })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}