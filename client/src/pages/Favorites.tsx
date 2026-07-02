import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapPin, Heart } from 'lucide-react'
import Navbar from '../components/Navbar'

interface Favorite {
  id: number
  property: {
    id: number
    title: string
    price: number
    type: string
    listingType: string
    district: string
    municipality: string
    area: number
    areaUnit: string
    images: string[]
    verified: boolean
    owner: { name: string; phone: string }
  }
}

export default function Favorites() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) {
      navigate('/login')
      return
    }
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get('http://localhost:5000/api/favorites/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFavorites(res.data.favorites)
    } catch (error) {
      console.error('Failed to fetch favorites')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (propertyId: number) => {
    const token = localStorage.getItem('token')
    try {
      await axios.post(
        'http://localhost:5000/api/favorites/toggle',
        { propertyId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setFavorites(prev => prev.filter(f => f.property.id !== propertyId))
    } catch (error) {
      console.error('Failed to remove favorite')
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(1)} Crore`
    if (price >= 100000) return `Rs. ${(price / 100000).toFixed(1)} Lakh`
    return `Rs. ${price.toLocaleString()}`
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Saved Properties
          </p>
          <h1 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '32px',
            color: 'var(--text-primary)'
          }}>
            My Favorites
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px' }}>
            <Heart size={48} style={{ color: 'var(--border)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '16px' }}>
              No saved properties yet
            </p>
            <Link to="/properties">
              <button className="btn-primary">Browse Properties</button>
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {favorites.map(fav => (
              <div key={fav.id} className="property-card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Image */}
                <Link to={`/properties/${fav.property.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    height: '160px',
                    background: 'var(--bg-surface)',
                    overflow: 'hidden'
                  }}>
                    {fav.property.images.length > 0 ? (
                      <img
                        src={fav.property.images[0]}
                        alt={fav.property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '13px'
                      }}>
                        No image
                      </div>
                    )}
                  </div>
                </Link>

                <div style={{ padding: '16px' }}>
                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <span style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--accent)',
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {fav.property.type}
                    </span>
                    {fav.property.verified && (
                      <span style={{
                        background: '#1A3A2A',
                        color: '#4CAF50',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <Link to={`/properties/${fav.property.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{
                      fontFamily: 'Mukta, sans-serif',
                      fontSize: '15px',
                      color: 'var(--text-primary)',
                      marginBottom: '6px'
                    }}>
                      {fav.property.title}
                    </h3>
                  </Link>

                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: '10px'
                  }}>
                    <MapPin size={12} /> {fav.property.municipality}, {fav.property.district}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '15px',
                      color: 'var(--accent)',
                      fontWeight: '500'
                    }}>
                      {formatPrice(fav.property.price)}
                    </span>
                    <button
                      onClick={() => removeFavorite(fav.property.id)}
                      style={{
                        background: '#2A1A1A',
                        border: '1px solid #C0614A',
                        color: '#C0614A',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Heart size={12} fill="#C0614A" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}