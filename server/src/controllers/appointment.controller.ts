import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth.middleware'

const prisma = new PrismaClient()

// Buyer creates an appointment request
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, date, message } = req.body

    const property = await prisma.property.findUnique({
      where: { id: parseInt(propertyId) }
    })

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const appointment = await prisma.appointment.create({
      data: {
        propertyId: parseInt(propertyId),
        buyerId: req.user!.id,
        date: new Date(date),
        message
      },
      include: {
        property: { select: { title: true, ownerId: true } },
        buyer: { select: { name: true, phone: true } }
      }
    })

    res.status(201).json({ message: 'Appointment requested successfully', appointment })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get appointments where I'm the buyer
export const getMyAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { buyerId: req.user!.id },
      include: {
        property: { select: { id: true, title: true, district: true, municipality: true, images: true } }
      },
      orderBy: { date: 'asc' }
    })

    res.json({ appointments })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get appointments for properties I own (seller side)
export const getReceivedAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        property: { ownerId: req.user!.id }
      },
      include: {
        property: { select: { id: true, title: true, district: true, municipality: true } },
        buyer: { select: { id: true, name: true, phone: true, email: true } }
      },
      orderBy: { date: 'asc' }
    })

    res.json({ appointments })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Seller accepts/declines/reschedules
export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status, date } = req.body

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: { property: true }
    })

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    if (appointment.property.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        status,
        ...(date && { date: new Date(date) })
      }
    })

    res.json({ message: 'Appointment updated', appointment: updated })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}