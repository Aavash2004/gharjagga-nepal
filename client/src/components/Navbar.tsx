import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'Mukta, sans-serif',
          fontSize: '22px',
          color: 'var(--accent)',
          fontWeight: '600'
        }}>
          GharJagga Nepal
        </span>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginLeft: '8px'
        }}>
         
        </span>
      </Link>
<Link to="/map" style={{
  color: 'var(--text-muted)',
  fontSize: '14px',
  textDecoration: 'none'
}}>
  Map
</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/properties" style={{
          color: 'var(--text-muted)',
          fontSize: '14px',
          textDecoration: 'none'
        }}>
          Properties
        </Link>
        <Link to="/calculator" style={{
          color: 'var(--text-muted)',
          fontSize: '14px',
          textDecoration: 'none'
        }}>
          Calculator
        </Link>
        <Link to="/lekhapadhi" style={{
          color: 'var(--text-muted)',
          fontSize: '14px',
          textDecoration: 'none'
        }}>
          Lekhapadhi
        </Link>

       {user ? (
  <>
    {(user.role === 'SELLER' || user.role === 'AGENT') && (
      <Link to="/post-property">
        <button className="btn-primary">+ Post Property</button>
      </Link>
    )}
    {user.role === 'LEKHAPADHI' && (
  <Link to="/lekhapadhi-profile">
    <button className="btn-primary">My Profile</button>
  </Link>
)}
{user.role === 'ADMIN' && (
  <Link to="/admin">
    <button className="btn-primary">Admin Panel</button>
  </Link>
)}
    <Link to="/dashboard" style={{
  color: 'var(--text-muted)',
  fontSize: '14px',
  textDecoration: 'none'
}}>
  Dashboard
</Link>
<Link to="/favorites" style={{
  color: 'var(--text-muted)',
  fontSize: '14px',
  textDecoration: 'none'
}}>
  Favorites
</Link>
    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
      {user.name}
    </span>
    <button className="btn-outline" onClick={handleLogout}>
      Logout
    </button>
  </>
) : (
          <>
            <Link to="/login" style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              textDecoration: 'none'
            }}>
              Sign in
            </Link>
            <Link to="/register">
              <button className="btn-primary">Get Started</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}