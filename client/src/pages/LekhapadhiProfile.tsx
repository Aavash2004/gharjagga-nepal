import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const SERVICES = [
  'Land Registration',
  'Ownership Transfer',
  'Sale Deed',
  'Tax Clearance',
  'Property Verification',
  'Legal Consultation'
]

export default function LekhapadhiProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
const [formData, setFormData] = useState({
  officeName: '',
  officeAddress: '',
  district: '',
  experience: '',
  bio: '',
  availability: '',
  services: [] as string[],
  avatar: ''
})
const [avatarPreview, setAvatarPreview] = useState('')
const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user || user.role !== 'LEKHAPADHI') {
      navigate('/')
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lekhapadhi/my-profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data.profile) {
        setFormData({
  officeName: res.data.profile.officeName,
  officeAddress: res.data.profile.officeAddress,
  district: res.data.profile.district,
  experience: res.data.profile.experience.toString(),
  bio: res.data.profile.bio || '',
  availability: res.data.profile.availability || '',
  services: res.data.profile.services,
  avatar: res.data.profile.avatar || ''
})
        }
      } catch (error) {
        console.error('No profile yet')
      }
    }
    fetchProfile()
  }, [])

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setAvatarUploading(true)
  setAvatarPreview(URL.createObjectURL(file))

  const token = localStorage.getItem('token')
  const uploadData = new FormData()
  uploadData.append('images', file)

  try {
    const res = await axios.post('http://localhost:5000/api/upload', uploadData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    setFormData(prev => ({ ...prev, avatar: res.data.urls[0] }))
  } catch (error) {
    console.error('Avatar upload failed')
  } finally {
    setAvatarUploading(false)
  }
}
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
 
  setLoading(true)
    const token = localStorage.getItem('token')
    try {
      await axios.post('http://localhost:5000/api/lekhapadhi', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess(true)
    }
    catch (error: any) {
  console.error('Failed to save profile', error.response?.data || error.message)

    } finally {
      setLoading(false)
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '6px'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Lekhapadhi Officer
          </p>
          <h1 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '32px',
            color: 'var(--text-primary)'
          }}>
            Setup Your Profile
          </h1>
        </div>
{success && (
  <div style={{
    background: '#1A3A2A',
    color: '#4CAF50',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px'
  }}>
    Profile saved successfully! Buyers can now find you in the directory.
  </div>
)}

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Office Name</label>
              <input
                className="input"
                placeholder="e.g. Kathmandu Legal Documentation Center"
                value={formData.officeName}
                onChange={e => setFormData({ ...formData, officeName: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Office Address</label>
              <input
                className="input"
                placeholder="e.g. New Baneshwor, Kathmandu"
                value={formData.officeAddress}
                onChange={e => setFormData({ ...formData, officeAddress: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>District</label>
                <select
                  className="input"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  required
                >
                  <option value="">Select District</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Chitwan">Chitwan</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Years of Experience</label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 8"
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Availability</label>
              <input
                className="input"
                placeholder="e.g. Sun-Fri, 10 AM - 5 PM"
                value={formData.availability}
                onChange={e => setFormData({ ...formData, availability: e.target.value })}
              />
            </div>

            <div>
              <label style={labelStyle}>Bio / About</label>
              <textarea
                className="input"
                placeholder="Brief description of your expertise..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
          {/* Avatar Upload */}
<div className="card" style={{ marginBottom: '20px' }}>
  <p style={labelStyle}>Profile Photo</p>
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'var(--bg-surface)',
      border: '2px solid var(--border)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--accent)',
      fontSize: '28px',
      fontFamily: 'Mukta, sans-serif',
      fontWeight: '600',
      flexShrink: 0
    }}>
      {avatarPreview || formData.avatar ? (
        <img
          src={avatarPreview || formData.avatar}
          alt="Avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        'P'
      )}
    </div>
    <div>
      <label style={{
        display: 'inline-block',
        cursor: 'pointer'
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          style={{ display: 'none' }}
        />
        <span className="btn-outline" style={{
          display: 'inline-block',
          fontSize: '13px',
          padding: '8px 16px'
        }}>
          {avatarUploading ? 'Uploading...' : 'Upload Photo'}
        </span>
      </label>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px' }}>
        JPG, PNG up to 5MB
      </p>
    </div>
  </div>
</div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <p style={labelStyle}>Services Offered</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {SERVICES.map(service => (
                <label key={service} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => toggleService(service)}
                    style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
                  />
                  <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
                    {service}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}