import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth.middleware'

const prisma = new PrismaClient()

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title, description, price, type, listingType,
      district, municipality, ward, address,
      latitude, longitude, area, areaUnit,
      road, facing, water, electricity, internet, images
    } = req.body

    const property = await prisma.property.create({
      data: {
        title, description, price: parseFloat(price),
        type, listingType, district, municipality,
        ward, address, latitude: parseFloat(latitude),
        longitude: parseFloat(longitude), area: parseFloat(area),
        areaUnit, road, facing, water, electricity,
        internet, images: images || [],
        ownerId: req.user!.id
      }
    })

    res.status(201).json({ message: 'Property created successfully', property })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { district, type, listingType, minPrice, maxPrice } = req.query

    const filters: any = {}
    if (district) filters.district = district
    if (type) filters.type = type
    if (listingType) filters.listingType = listingType
    if (minPrice || maxPrice) {
      filters.price = {}
      if (minPrice) filters.price.gte = parseFloat(minPrice as string)
      if (maxPrice) filters.price.lte = parseFloat(maxPrice as string)
    }

    const properties = await prisma.property.findMany({
      where: filters,
      include: {
        owner: {
          select: { id: true, name: true, phone: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ properties })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) },
      include: {
        owner: {
          select: { id: true, name: true, phone: true, email: true }
        }
      }
    })

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res.json({ property })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const propertyId = parseInt(id)

    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    if (property.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Delete related records first to avoid foreign key errors
    await prisma.appointment.deleteMany({ where: { propertyId } })
    await prisma.message.deleteMany({ where: { propertyId } })
    await prisma.favorite.deleteMany({ where: { propertyId } })

    await prisma.property.delete({ where: { id: propertyId } })

    res.json({ message: 'Property deleted successfully' })
  } catch (error: any) {
    console.error('DELETE ERROR:', error)
    res.status(500).json({ message: 'Server error', detail: error.message })
  }
}