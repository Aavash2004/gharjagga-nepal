import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import LocationPicker from '../components/LocationPicker'

export default function PostProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'LAND',
    listingType: 'BUY',
    district: '',
    municipality: '',
    ward: '',
    address: '',
    latitude: '',
    longitude: '',
    area: '',
    areaUnit: 'Aana',
    road: false,
    facing: '',
    water: false,
    electricity: false,
    internet: false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target
    const value = target.type === 'checkbox'
      ? (target as HTMLInputElement).checked
      : target.value
    setFormData({ ...formData, [target.name]: value })
  }
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (!files || files.length === 0) return

  setUploading(true)
  const token = localStorage.getItem('token')

  // Show local previews immediately
  const previews = Array.from(files).map(file => URL.createObjectURL(file))
  setPreviewImages(prev => [...prev, ...previews])

  const uploadData = new FormData()
  Array.from(files).forEach(file => uploadData.append('images', file))

  try {
    const res = await axios.post('http://localhost:5000/api/upload', uploadData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    setImages(prev => [...prev, ...res.data.urls])
  } catch (err) {
    setError('Image upload failed')
  } finally {
    setUploading(false)
  }
}

const removeImage = (index: number) => {
  setImages(prev => prev.filter((_, i) => i !== index))
  setPreviewImages(prev => prev.filter((_, i) => i !== index))
}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
  await axios.post('http://localhost:5000/api/properties', { ...formData, images }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  navigate('/properties')
}
     catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post property')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { marginBottom: '16px' }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '6px'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Sell or Rent
          </p>
          <h1 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '32px',
            color: 'var(--text-primary)'
          }}>
            Post a Property
          </h1>
        </div>

        {error && (
          <div style={{
            background: '#2A1A18',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontFamily: 'Mukta, sans-serif',
              fontSize: '16px',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Basic Information
            </h3>

            <div style={inputStyle}>
              <label style={labelStyle}>Property Title</label>
              <input
                className="input"
                name="title"
                placeholder="e.g. 3 Aana Land in Budhanilkantha"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div style={inputStyle}>
              <label style={labelStyle}>Description</label>
              <textarea
                className="input"
                name="description"
                placeholder="Describe your property..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Property Type</label>
                <select className="input" name="type" value={formData.type} onChange={handleChange}>
                  <option value="LAND">Land</option>
                  <option value="HOUSE">House</option>
                  <option value="FLAT">Flat</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Listing Type</label>
                <select className="input" name="listingType" value={formData.listingType} onChange={handleChange}>
                  <option value="BUY">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontFamily: 'Mukta, sans-serif',
              fontSize: '16px',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Location
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>District</label>
                <select className="input" name="district" value={formData.district} onChange={handleChange} required>
                  <option value="">Select District</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Chitwan">Chitwan</option>
                  <option value="Butwal">Butwal</option>
                  <option value="Dharan">Dharan</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Birgunj">Birgunj</option>
                  <option value="Dhangadhi">Dhangadhi</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Municipality / VDC</label>
                <input
                  className="input"
                  name="municipality"
                  placeholder="e.g. Budhanilkantha"
                  value={formData.municipality}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Ward No.</label>
                <input
                  className="input"
                  name="ward"
                  placeholder="e.g. 7"
                  value={formData.ward}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={labelStyle}>Full Address</label>
                <input
                  className="input"
                  name="address"
                  placeholder="e.g. Budhanilkantha, Kathmandu"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
<div style={{ marginBottom: '16px' }}>
  <label style={labelStyle}>Pin Location on Map (click to set)</label>
  <LocationPicker
    latitude={formData.latitude ? parseFloat(formData.latitude) : null}
    longitude={formData.longitude ? parseFloat(formData.longitude) : null}
    onLocationSelect={(lat, lng) => {
      setFormData(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }))
    }}
  />
  {formData.latitude && formData.longitude && (
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
      Selected: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
    </p>
  )}
</div>
          </div>

          {/* Area & Price */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontFamily: 'Mukta, sans-serif',
              fontSize: '16px',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Area & Price
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Area</label>
                <input
                  className="input"
                  name="area"
                  type="number"
                  placeholder="e.g. 3"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Unit</label>
                <select className="input" name="areaUnit" value={formData.areaUnit} onChange={handleChange}>
                  <option value="Ropani">Ropani</option>
                  <option value="Aana">Aana</option>
                  <option value="Paisa">Paisa</option>
                  <option value="Daam">Daam</option>
                  <option value="Bigha">Bigha</option>
                  <option value="Kattha">Kattha</option>
                  <option value="Dhur">Dhur</option>
                  <option value="Sqft">Square Feet</option>
                  <option value="Sqm">Square Meter</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Price (Rs.)</label>
                <input
                  className="input"
                  name="price"
                  type="number"
                  placeholder="e.g. 4500000"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Facing Direction</label>
                <select className="input" name="facing" value={formData.facing} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontFamily: 'Mukta, sans-serif',
              fontSize: '16px',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Amenities
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { name: 'road', label: 'Road Access' },
                { name: 'water', label: 'Water Supply' },
                { name: 'electricity', label: 'Electricity' },
                { name: 'internet', label: 'Internet' },
              ].map(amenity => (
                <label key={amenity.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name={amenity.name}
                    checked={formData[amenity.name as keyof typeof formData] as boolean}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
                  />
                  <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                    {amenity.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
{/* Photos */}
<div style={{
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px'
}}>
  <h3 style={{
    fontFamily: 'Mukta, sans-serif',
    fontSize: '16px',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  }}>
    Photos
  </h3>
  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
    Upload up to 10 photos of your property
  </p>

  <label style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed var(--border)',
    borderRadius: '8px',
    padding: '32px',
    cursor: 'pointer',
    marginBottom: '16px',
    background: 'var(--bg-surface)'
  }}>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleImageUpload}
      style={{ display: 'none' }}
    />
    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
      {uploading ? 'Uploading...' : 'Click to select photos or drag & drop'}
    </span>
  </label>

  {previewImages.length > 0 && (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '10px'
    }}>
      {previewImages.map((img, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <img
            src={img}
            alt={`Preview ${index + 1}`}
            style={{
              width: '100%',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '6px',
              border: '1px solid var(--border)'
            }}
          />
          <button
            type="button"
            onClick={() => removeImage(index)}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', fontSize: '16px', padding: '14px' }}
          >
            {loading ? 'Posting...' : 'Post Property'}
          </button>
        </form>
      </div>
    </div>
  )
}