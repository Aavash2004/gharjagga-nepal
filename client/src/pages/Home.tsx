import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        padding: '80px 32px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--accent)',
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          Nepal's Property Platform
        </p>
        <h1 style={{
          fontFamily: 'Mukta, sans-serif',
          fontSize: '52px',
          fontWeight: '700',
          lineHeight: '1.15',
          color: 'var(--text-primary)',
          marginBottom: '20px'
        }}>
          Find Your Perfect<br />
          <span style={{ color: 'var(--accent)' }}>Home and Property</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '17px',
          maxWidth: '520px',
          margin: '0 auto 36px'
        }}>
          Buy, sell, rent properties across Nepal. Connect with verified agents and Lekhapadhi officers.
        </p>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '680px',
          margin: '0 auto'
        }}>
          <select className="input" style={{ maxWidth: '180px' }}>
            <option>Kathmandu</option>
            <option>Pokhara</option>
            <option>Chitwan</option>
            <option>Lalitpur</option>
            <option>Bhaktapur</option>
          </select>
          <select className="input" style={{ maxWidth: '140px' }}>
            <option>Buy</option>
            <option>Rent</option>
          </select>
          <select className="input" style={{ maxWidth: '140px' }}>
            <option>House</option>
            <option>Land</option>
            <option>Flat</option>
          </select>
          <button className="btn-primary" style={{ padding: '10px 32px' }}>
            Search
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '64px',
        padding: '48px 32px',
        borderBottom: '1px solid var(--border)'
      }}>
        {[
          { value: '2,400+', label: 'Properties Listed' },
          { value: '850+', label: 'Verified Sellers' },
          { value: '120+', label: 'Lekhapadhi Officers' },
          { value: '77', label: 'Districts Covered' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '28px',
              color: 'var(--accent)',
              fontWeight: '500'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginTop: '4px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div style={{ padding: '64px 32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Property listings, map view, and more coming soon.
        </p>
        <Link to="/register">
          <button className="btn-primary" style={{ marginTop: '16px' }}>
            Get Started Free
          </button>
        </Link>
      </div>
    </div>
  )
}