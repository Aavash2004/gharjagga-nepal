import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Trash2, CheckCircle, Eye } from 'lucide-react'
import Navbar from '../components/Navbar'

interface Property {
  id: number
  title: string
  price: number
  type: string
  district: string
  verified: boolean
  createdAt: string
  images: string[]
  owner: { name: string; email: string }
}

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  createdAt: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [tab, setTab] = useState<'properties' | 'users'>('properties')
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    setLoading(true)
    try {
      const [propertiesRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/properties'),
        axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      setProperties(propertiesRes.data.properties)
      setUsers(usersRes.data.users)
    } catch (error) {
      console.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    const token = localStorage.getItem('token')
    try {
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete property')
    }
  }

  const verifyProperty = async (id: number) => {
    const token = localStorage.getItem('token')
    try {
      await axios.patch(`http://localhost:5000/api/properties/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProperties(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p))
    } catch (error) {
      console.error('Failed to verify property')
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(1)} Cr`
    if (price >= 100000) return `Rs. ${(price / 100000).toFixed(1)} L`
    return `Rs. ${price.toLocaleString()}`
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  const roleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return { bg: '#2A1A35', color: '#C084FC' }
      case 'SELLER': return { bg: '#1A2A35', color: '#60A5FA' }
      case 'AGENT': return { bg: '#1A2A35', color: '#34D399' }
      case 'LEKHAPADHI': return { bg: '#2A2A1A', color: '#FBBF24' }
      default: return { bg: 'var(--bg-surface)', color: 'var(--text-muted)' }
    }
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Admin Panel
          </p>
          <h1 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '32px',
            color: 'var(--text-primary)'
          }}>
            GharJagga Admin Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Properties', value: properties.length },
            { label: 'Verified', value: properties.filter(p => p.verified).length },
            { label: 'Unverified', value: properties.filter(p => !p.verified).length },
            { label: 'Total Users', value: users.length },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '28px',
                color: 'var(--accent)',
                fontWeight: '500'
              }}>
                {stat.value}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '24px',
          width: 'fit-content'
        }}>
          {(['properties', 'users'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 24px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#FFFFFF' : 'var(--text-muted)',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Properties Tab */}
            {tab === 'properties' && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Property', 'Owner', 'Price', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          fontWeight: '500',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id} style={{
                        borderBottom: '1px solid var(--border)',
                      }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              background: 'var(--bg-surface)',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              {property.images.length > 0 && (
                                <img src={property.images[0]} alt=""
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <p style={{
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              maxWidth: '180px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {property.title}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{property.owner.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{property.owner.email}</p>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '13px',
                            color: 'var(--accent)'
                          }}>
                            {formatPrice(property.price)}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: 'var(--bg-surface)',
                            color: 'var(--text-muted)',
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {property.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: property.verified ? '#1A3A2A' : 'var(--bg-surface)',
                            color: property.verified ? '#4CAF50' : 'var(--text-muted)',
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {property.verified ? '✓ Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                            {formatDate(property.createdAt)}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to={`/properties/${property.id}`}>
                              <button style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                                padding: '6px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}>
                                <Eye size={14} />
                              </button>
                            </Link>
                            {!property.verified && (
                              <button
                                onClick={() => verifyProperty(property.id)}
                                style={{
                                  background: '#1A3A2A',
                                  border: '1px solid #2A5A3A',
                                  color: '#4CAF50',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  cursor: 'pointer'
                                }}>
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteProperty(property.id)}
                              style={{
                                background: '#2A1A18',
                                border: '1px solid #4A2A28',
                                color: 'var(--danger)',
                                padding: '6px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Users Tab */}
            {tab === 'users' && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Name', 'Email', 'Phone', 'Role', 'Joined'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          fontWeight: '500',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const colors = roleColor(u.role)
                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'var(--bg-surface)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent)',
                                fontSize: '14px',
                                fontWeight: '600'
                              }}>
                                {u.name.charAt(0)}
                              </div>
                              <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
                                {u.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                            {u.email}
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                            {u.phone || '—'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              background: colors.bg,
                              color: colors.color,
                              fontSize: '11px',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontFamily: 'JetBrains Mono, monospace'
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                            {formatDate(u.createdAt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}