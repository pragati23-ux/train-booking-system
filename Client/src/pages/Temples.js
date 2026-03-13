import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllTemples } from '../services/api';

const TEMPLE_GRADIENTS = [
  'linear-gradient(160deg, #6B0F1A, #1A0A00)',
  'linear-gradient(160deg, #3D1A00, #6B0F1A)',
  'linear-gradient(160deg, #1A0A00, #3D0A10)',
  'linear-gradient(160deg, #4A0E16, #2D1500)',
];

const Temples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllTemples()
      .then(({ data }) => setTemples(data))
      .catch(() => toast.error('Failed to load temples'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = temples.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {/* Page Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #3D0A10, #6B0F1A)',
        padding: '60px 24px', textAlign: 'center',
        borderBottom: '2px solid rgba(201,168,76,0.3)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,153,51,0.08), transparent 70%)',
          pointerEvents: 'none'
        }} />
        <span style={{
          fontFamily: 'Cinzel, serif', letterSpacing: '0.28em',
          fontSize: '0.72rem', color: '#C9A84C',
          display: 'block', marginBottom: 12
        }}>
          ✦ EXPLORE ✦
        </span>
        <h1 style={{
          fontFamily: 'Cinzel, serif', color: 'white',
          fontSize: '2.4rem', marginBottom: 28
        }}>
          Sacred Temples
        </h1>
        {/* Search bar */}
        <div style={{ maxWidth: 420, margin: '0 auto', position: 'relative' }}>
          <input
            className="input"
            placeholder="🔍  Search by name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 20, borderRadius: 40, fontSize: '1rem' }}
          />
        </div>
      </div>

      <div className="page-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛕</div>
            <p>
              No temples found{search ? ` for "${search}"` : ''}.
              <br />Ask admin to add temples.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 28
          }}>
            {filtered.map((temple, i) => (
              <div
                key={temple._id}
                className={`card fade-up-${Math.min(i + 1, 5)}`}
              >
                {/* ✅ Shows real image if exists, fallback to gradient */}
                <div style={{
                  height: 200,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {temple.images?.[0] ? (
                    <img
                      src={temple.images[0]}
                      alt={temple.name}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', display: 'block'
                      }}
                    />
                  ) : (
                    <div style={{
                      background: TEMPLE_GRADIENTS[i % TEMPLE_GRADIENTS.length],
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3.5rem'
                    }}>
                      🛕
                    </div>
                  )}
                  {/* Gradient overlay on image for text readability */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%)'
                  }} />
                  {/* Location badge on image */}
                  <div style={{
                    position: 'absolute', bottom: 12, left: 16,
                    color: 'white', fontSize: '0.82rem',
                    fontFamily: 'Cinzel, serif',
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)'
                  }}>
                    📍 {temple.location}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '22px 24px 26px' }}>
                  <h5 style={{
                    fontFamily: 'Cinzel, serif', color: '#6B0F1A',
                    marginBottom: 6, fontSize: '1rem'
                  }}>
                    {temple.name}
                  </h5>
                  <p style={{
                    color: '#888', fontSize: '0.85rem', marginBottom: 12
                  }}>
                    ⏰ {temple.timings}
                  </p>
                  <p style={{
                    color: '#7A5C3A',
                    fontFamily: 'Crimson Pro, serif',
                    lineHeight: 1.65, fontSize: '1rem',
                    marginBottom: 20
                  }}>
                    {temple.description?.length > 100
                      ? temple.description.slice(0, 100) + '...'
                      : temple.description}
                  </p>
                  <Link
                    to={`/temples/${temple._id}`}
                    className="btn-primary"
                    style={{
                      display: 'block', textAlign: 'center',
                      textDecoration: 'none', padding: '11px'
                    }}
                  >
                    View Slots & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Temples;