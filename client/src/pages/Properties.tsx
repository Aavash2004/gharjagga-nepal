import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

interface Property {
  id: number
  title: string
  price: number
  type: string
  listingType: string
  district: string
  municipality: string
  area: number
  areaUnit: string
  road: boolean
  water: boolean
  electricity: boolean
  verified: boolean
  images: string[]
  owner: {
    name: string
    phone: string
  }
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    district: '',
    type: '',
    listingType: ''
  })

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filters.district) params.district = filters.district
      if (filters.type) params.type = filters.type
      if (filters.listingType) params.listingType = filters.listingType

      const res = await axios.get('http://localhost:5000/api/properties', { params })
      setProperties(res.data.properties)
    } catch (error) {
      console.error('Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(1)} Crore`
    if (price >= 100000) return `Rs. ${(price / 100000).toFixed(1)} Lakh`
    return `Rs. ${price.toLocaleString()}`
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        padding: '32px',
        borderBottom: '1px solid var(--border)'
      }}>
        <h1 style={{
          fontFamily: 'Mukta, sans-serif',
          fontSize: '32px',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Properties
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Browse land and houses across Nepal
        </p>
      </div>

      {/* Filters */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <select
          className="input"
          style={{ maxWidth: '180px' }}
          value={filters.district}
          onChange={e => setFilters({ ...filters, district: e.target.value })}
        >
          <option value="">All Districts</option>
          <option value="Kathmandu">Kathmandu</option>
          <option value="Lalitpur">Lalitpur</option>
          <option value="Bhaktapur">Bhaktapur</option>
          <option value="Pokhara">Pokhara</option>
          <option value="Chitwan">Chitwan</option>
        </select>

        <select
          className="input"
          style={{ maxWidth: '160px' }}
          value={filters.listingType}
          onChange={e => setFilters({ ...filters, listingType: e.target.value })}
        >
          <option value="">Buy & Rent</option>
          <option value="BUY">Buy</option>
          <option value="RENT">Rent</option>
        </select>

        <select
          className="input"
          style={{ maxWidth: '160px' }}
          value={filters.type}
          onChange={e => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="HOUSE">House</option>
          <option value="LAND">Land</option>
          <option value="FLAT">Flat</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>

        <button className="btn-primary" onClick={fetchProperties}>
          Search
        </button>
      </div>

      {/* Property Grid */}
      <div style={{ padding: '32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '64px' }}>
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '64px' }}>
            No properties found.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {properties.map(property => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="property-card" style={{
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}>
                  {/* Image placeholder */}
                  <div style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '6px',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: 'var(--text-muted)',
                    fontSize: '13px'
                  }}>
                    {property.images.length > 0 ? (
                      <img src={property.images[0]} alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      'No image available'
                    )}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <span style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--accent)',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {property.type}
                    </span>
                    <span style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      {property.listingType === 'BUY' ? 'For Sale' : 'For Rent'}
                    </span>
                    {property.verified && (
                      <span style={{
                        background: '#1A3A2A',
                        color: '#4CAF50',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px'
                      }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'Mukta, sans-serif',
                    fontSize: '17px',
                    color: 'var(--text-primary)',
                    marginBottom: '6px'
                  }}>
                    {property.title}
                  </h3>

                  {/* Location */}
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    marginBottom: '12px'
                  }}>
                    📍 {property.municipality}, {property.district}
                  </p>

                  {/* Area + Price */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '13px',
                      color: 'var(--text-muted)'
                    }}>
                      {property.area} {property.areaUnit}
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '16px',
                      color: 'var(--accent)',
                      fontWeight: '500'
                    }}>
                      {formatPrice(property.price)}
                    </span>
                  </div>

                  {/* Amenities */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border)'
                  }}>
                    {property.road && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🛣️ Road</span>}
                    {property.water && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>💧 Water</span>}
                    {property.electricity && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>⚡ Electricity</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}