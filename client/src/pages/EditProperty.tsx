import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import LocationPicker from '../components/LocationPicker'

export default function EditProperty() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
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
    parking: false,
    lift: false,
    bedrooms: '',
    bathrooms: '',
    floors: '',
    floorNumber: '',
    furnished: '',
    builtYear: '',
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`)
        const p = res.data.property
        setFormData({
          title: p.title,
          description: p.description || '',
          price: p.price.toString(),
          type: p.type,
          listingType: p.listingType,
          district: p.district,
          municipality: p.municipality,
          ward: p.ward || '',
          address: p.address || '',
          latitude: p.latitude?.toString() || '',
          longitude: p.longitude?.toString() || '',
          area: p.area.toString(),
          areaUnit: p.areaUnit,
          road: p.road,
          facing: p.facing || '',
          water: p.water,
          electricity: p.electricity,
          internet: p.internet,
          parking: p.parking || false,
          lift: p.lift || false,
          bedrooms: p.bedrooms?.toString() || '',
          bathrooms: p.bathrooms?.toString() || '',
          floors: p.floors?.toString() || '',
          floorNumber: p.floorNumber?.toString() || '',
          furnished: p.furnished || '',
          builtYear: p.builtYear?.toString() || '',
        })
        setImages(p.images || [])
      } catch (error) {
        navigate('/properties')
      } finally {
        setFetching(false)
      }
    }
    fetchProperty()
  }, [id])

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
    const uploadData = new FormData()
    Array.from(files).forEach(file => uploadData.append('images', file))
    try {
      const res = await axios.post('http://localhost:5000/api/upload', uploadData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
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
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  const token = localStorage.getItem('token')
  try {
    await axios.put(`http://localhost:5000/api/properties/${id}`, {
      ...formData,
      images,
      price: parseFloat(formData.price),
      area: parseFloat(formData.area),
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      floors: formData.floors ? parseInt(formData.floors) : null,
      floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : null,
      builtYear: formData.builtYear ? parseInt(formData.builtYear) : null,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setSuccess(true)
    setTimeout(() => navigate(`/properties/${id}`), 1500)
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to update property')
  } finally {
    setLoading(false)
  }
}

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px'
  }

  const isLand = formData.type === 'LAND'
  const isHouse = formData.type === 'HOUSE'
  const isFlat = formData.type === 'FLAT'
  const isRent = formData.listingType === 'RENT'

  if (fetching) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px' }}>

        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '12px', color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px'
          }}>
            Edit Listing
          </p>
          <h1 style={{ fontFamily: 'Mukta, sans-serif', fontSize: '32px', color: 'var(--text-primary)' }}>
            Update Property
          </h1>
        </div>

        {error && (
          <div style={{
            background: '#2A1A18', border: '1px solid var(--danger)',
            color: 'var(--danger)', padding: '10px 14px', borderRadius: '6px',
            fontSize: '14px', marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
            {success && (
  <div style={{
    background: '#1A3A2A',
    color: '#4CAF50',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px'
  }}>
    Property updated successfully! Redirecting...
  </div>
)}
          {/* Basic Info */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'Mukta, sans-serif', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>
              Basic Information
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Property Title</label>
              <input className="input" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Description</label>
              <textarea className="input" name="description" value={formData.description}
                onChange={handleChange} rows={4} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Property Type</label>
                <select className="input" name="type" value={formData.type} onChange={handleChange}>
                  <option value="LAND">Land / Jagga</option>
                  <option value="HOUSE">House / Ghar</option>
                  <option value="FLAT">Flat / Apartment</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Listing Type</label>
                <select className="input" name="listingType" value={formData.listingType} onChange={handleChange}>
                  <option value="BUY">For Sale</option>
                  {!isLand && <option value="RENT">For Rent</option>}
                </select>
              </div>
            </div>
          </div>

          {/* Price & Area */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'Mukta, sans-serif', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>
              Area & Price
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Area</label>
                <input className="input" name="area" type="number" value={formData.area} onChange={handleChange} required />
              </div>
              <div>
                <label style={labelStyle}>Unit</label>
                <select className="input" name="areaUnit" value={formData.areaUnit} onChange={handleChange}>
                  {isLand && (
                    <>
                      <option value="Ropani">Ropani</option>
                      <option value="Aana">Aana</option>
                      <option value="Paisa">Paisa</option>
                      <option value="Bigha">Bigha</option>
                      <option value="Kattha">Kattha</option>
                      <option value="Dhur">Dhur</option>
                    </>
                  )}
                  <option value="Sqft">Square Feet</option>
                  <option value="Sqm">Square Meter</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>{isRent ? 'Monthly Rent (Rs.)' : 'Sale Price (Rs.)'}</label>
              <input className="input" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
          </div>

          {/* House/Flat details */}
          {(isHouse || isFlat) && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Mukta, sans-serif', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>
                {isHouse ? 'House Details' : 'Apartment Details'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Bedrooms</label>
                  <select className="input" name="bedrooms" value={formData.bedrooms} onChange={handleChange}>
                    <option value="">Select</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Bedroom{n > 1 ? 's' : ''}</option>)}
                    <option value="7">7+</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Bathrooms</label>
                  <select className="input" name="bathrooms" value={formData.bathrooms} onChange={handleChange}>
                    <option value="">Select</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Bathroom{n > 1 ? 's' : ''}</option>)}
                    <option value="7">7+</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Furnished Status</label>
                  <select className="input" name="furnished" value={formData.furnished} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
                {isHouse && (
                  <div>
                    <label style={labelStyle}>Built Year</label>
                    <input className="input" name="builtYear" type="number" value={formData.builtYear} onChange={handleChange} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'Mukta, sans-serif', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>
              Amenities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { name: 'road', label: 'Road Access' },
                { name: 'water', label: 'Water Supply' },
                { name: 'electricity', label: 'Electricity' },
                { name: 'internet', label: 'Internet' },
                ...(!isLand ? [{ name: 'parking', label: 'Parking' }] : []),
                ...(isFlat ? [{ name: 'lift', label: 'Lift / Elevator' }] : []),
              ].map(amenity => (
                <label key={amenity.name} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '12px 16px', cursor: 'pointer'
                }}>
                  <input type="checkbox" name={amenity.name}
                    checked={formData[amenity.name as keyof typeof formData] as boolean}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                  <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Mukta, sans-serif', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Photos
            </h3>
            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {images.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img src={img} alt={`Photo ${index + 1}`}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
                    <button type="button" onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute', top: '4px', right: '4px',
                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                        border: 'none', borderRadius: '50%', width: '20px',
                        height: '20px', cursor: 'pointer', fontSize: '12px'
                      }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px dashed var(--border)', borderRadius: '8px',
              padding: '24px', cursor: 'pointer', background: 'var(--bg-surface)'
            }}>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                {uploading ? 'Uploading...' : '+ Add More Photos'}
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn-outline"
              onClick={() => navigate(`/properties/${id}`)}
              style={{ flex: 1, padding: '14px' }}>
              Cancel
            </button>
            <button className="btn-primary" type="submit" disabled={loading}
              style={{ flex: 2, fontSize: '16px', padding: '14px' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}