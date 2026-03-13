import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out. Jai Shree Ram 🙏');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top info strip */}
      <div className="info-strip">
        ✦ &nbsp; Book Sacred Darshan Slots Online — Simple, Peaceful & Divine &nbsp; ✦
      </div>

      {/* Main navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #3D0A10 0%, #6B0F1A 50%, #3D0A10 100%)',
        borderBottom: '2px solid rgba(201,168,76,0.5)',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
      }}>
        <div style={{
          maxWidth: 1140, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 70
        }}>
          {/* Brand */}
          <Link to="/" style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: '1.25rem', fontWeight: 700,
            color: '#E8C96A', textDecoration: 'none',
            letterSpacing: '0.06em', display: 'flex',
            alignItems: 'center', gap: 10,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            🛕 DarshanEase
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/temples', label: 'Temples' },
              ...(user ? [
                { to: '/my-bookings', label: 'My Bookings' },
                { to: '/donations', label: 'Donate' },
                ...(user.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin' }] : [])
              ] : [])
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                color: isActive(to) ? '#E8C96A' : 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                padding: '8px 14px',
                borderRadius: 3,
                borderBottom: isActive(to) ? '2px solid #E8C96A' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = '#E8C96A'; }}
                onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
                <span style={{
                  fontFamily: 'Crimson Pro, serif',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.9rem'
                }}>
                  🙏 {user.name}
                </span>
                <button onClick={handleLogout} className="btn-outline" style={{
                  color: '#E8C96A', borderColor: 'rgba(201,168,76,0.5)',
                  padding: '7px 18px', fontSize: '0.72rem'
                }}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
                <Link to="/login" className="btn-outline" style={{
                  color: '#E8C96A', borderColor: 'rgba(201,168,76,0.5)',
                  padding: '7px 18px', fontSize: '0.72rem', textDecoration: 'none'
                }}>Login</Link>
                <Link to="/register" className="btn-primary" style={{
                  padding: '7px 18px', fontSize: '0.72rem', textDecoration: 'none'
                }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;