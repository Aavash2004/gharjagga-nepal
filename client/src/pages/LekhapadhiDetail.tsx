import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapPin, Briefcase, Phone, Mail, Clock, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'

interface Profile {
  id: number
  officeName: string
  officeAddress: string
  district: string
  experience: number
  services: string[]
  bio: string
  availability: string
  avatar: string
  user: {
    id: number
    name: string
    phone: string
    email: string
  }
}
export default function LekhapadhiDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [service, setService] = useState('')
  const [message, setMessage] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/lekhapadhi/${id}`)
        setProfile(res.data.profile)
      } catch (error) {
        navigate('/lekhapadhi')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    setBookingLoading(true)
    try {
      await axios.post(
        'http://localhost:5000/api/lekhapadhi/consultation',
        { lekhapadhiId: profile!.id, service, message },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBookingSuccess(true)
    } catch (error) {
      console.error('Failed to book consultation')
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

  if (!profile) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/lekhapadhi')}
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
          ← Back to Directory
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

          {/* Left — Profile Info */}
          <div>
            {/* Header Card */}
            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  background: 'var(--bg-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--accent)',
  fontFamily: 'Mukta, sans-serif',
  fontSize: '28px',
  fontWeight: '600',
  border: '2px solid var(--accent)',
  flexShrink: 0,
  overflow: 'hidden'
}}>
  {profile.avatar ? (
    <img src={profile.avatar} alt={profile.user.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    profile.user.name.charAt(0)
  )}
</div>
                <div>
                  <h1 style={{
                    fontFamily: 'Mukta, sans-serif',
                    fontSize: '24px',
                    color: 'var(--text-primary)',
                    marginBottom: '4px'
                  }}>
                    {profile.user.name}
                  </h1>
                  <p style={{ color: 'var(--accent)', fontSize: '14px' }}>
                    {profile.officeName}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <MapPin size={14} /> {profile.officeAddress}, {profile.district}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <Briefcase size={14} /> {profile.experience} years of experience
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <Phone size={14} /> {profile.user.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <Mail size={14} /> {profile.user.email}
                </div>
                {profile.availability && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    <Clock size={14} /> {profile.availability}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontFamily: 'Mukta, sans-serif',
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  About
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Services */}
            <div className="card">
              <h3 style={{
                fontFamily: 'Mukta, sans-serif',
                fontSize: '16px',
                color: 'var(--text-primary)',
                marginBottom: '16px'
              }}>
                Services Offered
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile.services.map(service => (
                  <div key={service} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: 'var(--bg-surface)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    <CheckCircle size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Booking Card */}
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
                color: 'var(--text-primary)',
                marginBottom: '16px'
              }}>
                Book Consultation
              </h3>

              {bookingSuccess ? (
                <div style={{
                  background: '#1A3A2A',
                  color: '#4CAF50',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  Consultation request sent! The officer will contact you soon.
                </div>
              ) : (
                <form onSubmit={handleBookConsultation}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      marginBottom: '6px'
                    }}>
                      Service Required
                    </label>
                    <select
                      className="input"
                      value={service}
                      onChange={e => setService(e.target.value)}
                      required
                    >
                      <option value="">Select a service</option>
                      {profile.services.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      marginBottom: '6px'
                    }}>
                      Message (optional)
                    </label>
                    <textarea
                      className="input"
                      placeholder="Describe your situation briefly..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={4}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={bookingLoading}
                    style={{ width: '100%' }}
                  >
                    {bookingLoading ? 'Sending...' : 'Request Consultation'}
                  </button>
                </form>
              )}

              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)'
              }}>
                <a href={`tel:${profile.user.phone}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <Phone size={16} /> Call Directly
                  </button>
                </a>
                <a href={`https://wa.me/977${profile.user.phone}`} target="_blank" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    WhatsApp
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}