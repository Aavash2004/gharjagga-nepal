import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { MapPin, Briefcase, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'

interface LekhapadhiProfile {
  id: number
  officeName: string
  officeAddress: string
  district: string
  experience: number
  services: string[]
  bio: string
  avatar: string
  user: { id: number; name: string; phone: string; email: string }
}

export default function LekhapadhiDirectory() {
  const [profiles, setProfiles] = useState<LekhapadhiProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState('')

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (district) params.district = district
      const res = await axios.get('http://localhost:5000/api/lekhapadhi', { params })
      setProfiles(res.data.profiles)
    } catch (error) {
      console.error('Failed to fetch profiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>

        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Legal Documentation Experts
          </p>
          <h1 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '32px',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Lekhapadhi Directory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Find verified document writers for land registration, sale deeds, and legal consultation
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <select
            className="input"
            style={{ maxWidth: '200px' }}
            value={district}
            onChange={e => setDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Bhaktapur">Bhaktapur</option>
            <option value="Pokhara">Pokhara</option>
            <option value="Chitwan">Chitwan</option>
          </select>
          <button className="btn-primary" onClick={fetchProfiles}>
            Search
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : profiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
            No Lekhapadhi officers found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {profiles.map(profile => (
              <Link key={profile.id} to={`/lekhapadhi/${profile.id}`} style={{ textDecoration: 'none' }}>
                <div className="property-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'var(--bg-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--accent)',
  fontFamily: 'Mukta, sans-serif',
  fontSize: '20px',
  fontWeight: '600',
  overflow: 'hidden',
  flexShrink: 0
}}>
  {profile.avatar ? (
    <img src={profile.avatar} alt={profile.user.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    profile.user.name.charAt(0)
  )}
</div>
                    <div>
                      <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: '500' }}>
                        {profile.user.name}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        {profile.officeName}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    marginBottom: '6px'
                  }}>
                    <MapPin size={13} /> {profile.district}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    marginBottom: '12px'
                  }}>
                    <Briefcase size={13} /> {profile.experience} years experience
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {profile.services.slice(0, 3).map(service => (
                      <span key={service} style={{
                        background: 'var(--bg-surface)',
                        color: 'var(--accent)',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px'
                      }}>
                        {service}
                      </span>
                    ))}
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