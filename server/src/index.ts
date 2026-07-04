import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/auth.routes'
import propertyRoutes from './routes/property.routes'
import appointmentRoutes from './routes/appointment.routes'
import lekhapadhiRoutes from './routes/lekhapadhi.routes'
import uploadRoutes from './routes/upload.routes'
import favoriteRoutes from './routes/favorite.routes'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/lekhapadhi', lekhapadhiRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/favorites', favoriteRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'GharJagga Nepal API is running!' })
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join_room', (roomId: string) => {
    socket.join(roomId)
    console.log(`User joined room: ${roomId}`)
  })

  socket.on('send_message', (data: {
    roomId: string
    message: string
    senderName: string
    senderId: number
    timestamp: string
  }) => {
    io.to(data.roomId).emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})