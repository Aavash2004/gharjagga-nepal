import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Calendar, MapPin, Phone, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'

interface ReceivedAppointment {
  id: number
  date: string
  message: string
  status: string
  property: { id: number; title: string; district: string; municipality: string }
  buyer: { id: number; name: string; phone: string; email: string }
}

interface MyAppointment {
  id: number
  date: string
  message: string
  status: string
  property: { id: number; title: string; district: string; municipality: string; images: string[] }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [tab, setTab] = useState<'received' | 'my'>(
    user?.role === 'SELLER' || user?.role === 'AGENT' ? 'received' : 'my'
  )
  const [received, setReceived] = useState<ReceivedAppointment[]>([])
  const [mine, setMine] = useState<MyAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    setLoading(true)
    try {
      if (user.role === 'SELLER' || user.role === 'AGENT') {
        const res = await axios.get('http://localhost:5000/api/appointments/received', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setReceived(res.data.appointments)
      }
      const res2 = await axios.get('http://localhost:5000/api/appointments/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMine(res2.data.appointments)
    } catch (error) {
      console.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token')
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchData()
    } catch (error) {
      console.error('Failed to update appointment')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return { bg: '#1A3A2A', color: '#4CAF50' }
      case 'DECLINED': return { bg: '#2A1A18', color: 'var(--danger)' }
      case 'RESCHEDULED': return { bg: '#2A2418', color: 'var(--accent)' }
      default: return { bg: 'var(--bg-surface)', color: 'var(--text-muted)' }
    }
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>

        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Dashboard
          </p>
          <h1 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '32px',
            color: 'var(--text-primary)'
          }}>
            My Appointments
          </h1>
        </div>

        {/* Tabs */}
        {(user.role === 'SELLER' || user.role === 'AGENT') && (
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
            <button
              onClick={() => setTab('received')}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                background: tab === 'received' ? 'var(--accent)' : 'transparent',
                color: tab === 'received' ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              Received Requests
            </button>
            <button
              onClick={() => setTab('my')}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                background: tab === 'my' ? 'var(--accent)' : 'transparent',
                color: tab === 'my' ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              My Bookings
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Received Tab — Seller view */}
            {tab === 'received' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {received.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No appointment requests yet.
                  </div>
                ) : received.map(apt => {
                  const colors = statusColor(apt.status)
                  return (
                    <div key={apt.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <Link to={`/properties/${apt.property.id}`} style={{ textDecoration: 'none' }}>
                            <p style={{ fontFamily: 'Mukta, sans-serif', fontSize: '16px', color: 'var(--text-primary)' }}>
                              {apt.property.title}
                            </p>
                          </Link>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            <MapPin size={12} /> {apt.property.municipality}, {apt.property.district}
                          </p>
                        </div>
                        <span style={{
                          background: colors.bg, color: colors.color,
                          fontSize: '11px', padding: '4px 10px', borderRadius: '4px'
                        }}>
                          {apt.status}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px'
                      }}>
                        <Calendar size={14} /> {formatDate(apt.date)}
                      </div>

                      <div style={{
                        background: 'var(--bg-surface)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '12px'
                      }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                          {apt.buyer.name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {apt.buyer.phone}
                        </p>
                        {apt.message && (
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                            "{apt.message}"
                          </p>
                        )}
                      </div>

                      {apt.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-primary" style={{ flex: 1, padding: '8px' }}
                            onClick={() => updateStatus(apt.id, 'ACCEPTED')}>
                            Accept
                          </button>
                          <button className="btn-outline" style={{ flex: 1, padding: '8px' }}
                            onClick={() => updateStatus(apt.id, 'DECLINED')}>
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* My Bookings Tab — Buyer view */}
            {tab === 'my' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mine.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    You haven't booked any visits yet.
                  </div>
                ) : mine.map(apt => {
                  const colors = statusColor(apt.status)
                  return (
                    <div key={apt.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <Link to={`/properties/${apt.property.id}`} style={{ textDecoration: 'none' }}>
                          <p style={{ fontFamily: 'Mukta, sans-serif', fontSize: '16px', color: 'var(--text-primary)' }}>
                            {apt.property.title}
                          </p>
                        </Link>
                        <span style={{
                          background: colors.bg, color: colors.color,
                          fontSize: '11px', padding: '4px 10px', borderRadius: '4px'
                        }}>
                          {apt.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        <MapPin size={12} /> {apt.property.municipality}, {apt.property.district}
                      </p>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '13px', color: 'var(--text-primary)'
                      }}>
                        <Calendar size={14} /> {formatDate(apt.date)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}