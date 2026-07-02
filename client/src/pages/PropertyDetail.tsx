import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, MapPin, Phone, MessageCircle, Droplets, Zap, Wifi, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'

interface Property {
  id: number
  title: string
  description: string
  price: number
  type: string
  listingType: string
  district: string
  municipality: string
  ward: string
  address: string
  latitude: number
  longitude: number
  area: number
  areaUnit: string
  road: boolean
  facing: string
  water: boolean
  electricity: boolean
  internet: boolean
  verified: boolean
  images: string[]
  createdAt: string
  owner: {
    id: number
    name: string
    phone: string
    email: string
  }
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
const [selectedImage, setSelectedImage] = useState(0)
  const [showBooking, setShowBooking] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`)
        setProperty(res.data.property)
      } catch (error) {
        navigate('/properties')
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(1)} Crore`
    if (price >= 100000) return `Rs. ${(price / 100000).toFixed(1)} Lakh`
    return `Rs. ${price.toLocaleString()}`
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setBookingLoading(true)
    setBookingError('')

    try {
      await axios.post(
        'http://localhost:5000/api/appointments',
        { propertyId: property!.id, date: bookingDate, message: bookingMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBookingSuccess(true)
      setBookingDate('')
      setBookingMessage('')
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Failed to book appointment')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    </div>
  )

  if (!property) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/properties')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '24px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={16} /> Back to Properties
        </button>

       {/* Image Gallery */}
<div style={{ marginBottom: '24px' }}>
  {property.images.length > 0 ? (
    <div>
      {/* Main Image */}
      <div style={{
        borderRadius: '12px',
        height: '360px',
        overflow: 'hidden',
        marginBottom: '8px',
        border: '1px solid var(--border)'
      }}>
        <img
          src={property.images[selectedImage]}
          alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Thumbnails */}
      {property.images.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {property.images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              style={{
                width: '80px',
                height: '60px',
                borderRadius: '6px',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0,
                border: selectedImage === index
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
                opacity: selectedImage === index ? 1 : 0.7,
                transition: 'all 0.2s'
              }}
            >
              <img
                src={img}
                alt={`Photo ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '12px',
      height: '320px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontSize: '14px',
      border: '1px solid var(--border)'
    }}>
      No images uploaded yet
    </div>
  )}
</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

          {/* Left — Property Info */}
          <div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                background: 'var(--bg-surface)',
                color: 'var(--accent)',
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {property.type}
              </span>
              <span style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-muted)',
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '4px'
              }}>
                {property.listingType === 'BUY' ? 'For Sale' : 'For Rent'}
              </span>
              {property.verified && (
                <span style={{
                  background: '#1A3A2A',
                  color: '#4CAF50',
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '4px'
                }}>
                  Verified
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'Mukta, sans-serif',
              fontSize: '28px',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              {property.title}
            </h1>

            {/* Location */}
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <MapPin size={14} />
              {property.address}, Ward {property.ward}, {property.municipality}, {property.district}
            </p>

            {/* Price */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: '0 8px 8px 0',
              padding: '16px 20px',
              marginBottom: '24px'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>
                {property.listingType === 'BUY' ? 'Sale Price' : 'Monthly Rent'}
              </p>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '28px',
                color: 'var(--accent)',
                fontWeight: '500'
              }}>
                {formatPrice(property.price)}
              </p>
            </div>

            {/* Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {[
                { label: 'Area', value: `${property.area} ${property.areaUnit}` },
                { label: 'Facing', value: property.facing || 'N/A' },
                { label: 'Road Access', value: property.road ? 'Yes' : 'No' },
                { label: 'Water', value: property.water ? 'Available' : 'No', icon: <Droplets size={14} /> },
                { label: 'Electricity', value: property.electricity ? 'Available' : 'No', icon: <Zap size={14} /> },
                { label: 'Internet', value: property.internet ? 'Available' : 'No', icon: <Wifi size={14} /> },
              ].map(detail => (
                <div key={detail.label} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>
                    {detail.label}
                  </p>
                  <p style={{
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontFamily: 'JetBrains Mono, monospace',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {detail.icon && <span style={{ color: 'var(--accent)' }}>{detail.icon}</span>}
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            {property.description && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <h3 style={{
                  fontFamily: 'Mukta, sans-serif',
                  fontSize: '16px',
                  marginBottom: '10px',
                  color: 'var(--text-primary)'
                }}>
                  Description
                </h3>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  lineHeight: '1.7'
                }}>
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Right — Contact Card */}
          <div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              position: 'sticky',
              top: '80px'
            }}>
              <h3 style={{
                fontFamily: 'Mukta, sans-serif',
                fontSize: '16px',
                marginBottom: '16px',
                color: 'var(--text-primary)'
              }}>
                Listed by
              </h3>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  fontFamily: 'Mukta, sans-serif',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {property.owner.name.charAt(0)}
                </div>
                <div>
                  <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: '500' }}>
                    {property.owner.name}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    Property Owner
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                <a href={`tel:${property.owner.phone}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <Phone size={16} /> Call {property.owner.phone}
                  </button>
                </a>
                <a href={`https://wa.me/977${property.owner.phone}`} target="_blank" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                </a>
              </div>

              {/* Schedule Visit Button */}
              <button
                onClick={() => setShowBooking(!showBooking)}
                className="btn-outline"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Calendar size={16} /> Schedule Visit
              </button>

              {/* Booking Form */}
              {showBooking && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)'
                }}>
                  {bookingSuccess ? (
                    <div style={{
                      background: '#1A3A2A',
                      color: '#4CAF50',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      textAlign: 'center'
                    }}>
                      Appointment requested! The owner will respond soon.
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit}>
                      {bookingError && (
                        <div style={{
                          background: '#2A1A18',
                          color: 'var(--danger)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          marginBottom: '12px'
                        }}>
                          {bookingError}
                        </div>
                      )}
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginBottom: '6px'
                      }}>
                        Preferred Date & Time
                      </label>
                      <input
                        className="input"
                        type="datetime-local"
                        value={bookingDate}
                        onChange={e => setBookingDate(e.target.value)}
                        required
                        style={{ marginBottom: '12px', fontSize: '13px' }}
                      />
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginBottom: '6px'
                      }}>
                        Message (optional)
                      </label>
                      <textarea
                        className="input"
                        placeholder="Any specific questions or notes..."
                        value={bookingMessage}
                        onChange={e => setBookingMessage(e.target.value)}
                        rows={3}
                        style={{ marginBottom: '12px', fontSize: '13px', resize: 'vertical' }}
                      />
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={bookingLoading}
                        style={{ width: '100%' }}
                      >
                        {bookingLoading ? 'Sending...' : 'Confirm Request'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>        
  )
} 
