import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import propertyRoutes from './routes/property.routes'
import appointmentRoutes from './routes/appointment.routes'
import lekhapadhiRoutes from './routes/lekhapadhi.routes'
import uploadRoutes from './routes/upload.routes'
import favoriteRoutes from './routes/favorite.routes'

dotenv.config()

const app = express()
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})