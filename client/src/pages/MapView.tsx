import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar'

// Fix default marker icon issue with Leaflet + Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const goldIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface Property {
  id: number
  title: string
  price: number
  type: string
  listingType: string
  district: string
  municipality: string
  latitude: number
  longitude: number
  area: number
  areaUnit: string
}

export default function MapView() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/properties')
        setProperties(res.data.properties)
      } catch (error) {
        console.error('Failed to fetch properties')
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(1)} Crore`
    if (price >= 100000) return `Rs. ${(price / 100000).toFixed(1)} Lakh`
    return `Rs. ${price.toLocaleString()}`
  }

  // Default center: Kathmandu
  const defaultCenter: [number, number] = [27.7172, 85.3240]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Explore Visually
          </p>
          <h1 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '32px',
            color: 'var(--text-primary)'
          }}>
            Property Map
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
            Loading map...
          </div>
        ) : (
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            height: '600px'
          }}>
            <MapContainer
              center={defaultCenter}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {properties.map(property => (
                <Marker
                  key={property.id}
                  position={[property.latitude, property.longitude]}
                  icon={goldIcon}
                >
                  <Popup>
                    <div style={{ minWidth: '180px' }}>
                      <p style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                        {property.title}
                      </p>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                        {property.municipality}, {property.district}
                      </p>
                      <p style={{ fontWeight: '600', color: '#B8862E', marginBottom: '8px' }}>
                        {formatPrice(property.price)}
                      </p>
                      <button
                        onClick={() => navigate(`/properties/${property.id}`)}
                        style={{
                          background: '#A67C3D',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  )
}