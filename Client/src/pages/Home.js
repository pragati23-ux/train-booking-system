import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllTemples } from '../services/api';

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 6 + 3,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 3,
}));

const Home = () => {
  const [temples, setTemples] = useState([]);

  useEffect(() => {
    getAllTemples().then(r => setTemples(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #1A0A00 0%, #3D0A10 40%, #6B0F1A 70%, #3D1A00 100%)',
        minHeight: '92vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        padding: '80px 24px',
      }}>
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: p.left, top: p.top,
            width: p.size, height: p.size, borderRadius: '50%',
            background: 'radial-gradient(circle, #E8C96A, #C9A84C)',
            opacity: 0.25,
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite`,
            pointerEvents: 'none',
          }} />
        ))}
        {[300, 500, 700, 900].map((size, i) => (
          <div key={size} style={{
            position: 'absolute', width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(201,168,76,${0.12 - i * 0.02})`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          <p className="fade-up" style={{
            fontFamily: 'Cinzel, serif', color: '#C9A84C',
            letterSpacing: '0.35em', fontSize: '0.72rem', marginBottom: 20
          }}>
            ✦ &nbsp; SACRED DARSHAN BOOKING PLATFORM &nbsp; ✦
          </p>
          <h1 className="fade-up-1" style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            color: 'white', fontWeight: 700,
            lineHeight: 1.1, marginBottom: 12,
            textShadow: '0 4px 32px rgba(0,0,0,0.5)'
          }}>
            Darshan<span style={{ color: '#E8C96A' }}>Ease</span>
          </h1>
          <div className="fade-up-2" style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 16, margin: '20px 0 28px'
          }}>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
            <span style={{ color: '#C9A84C', fontSize: '1.1rem' }}>🪔</span>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
          </div>
          <p className="fade-up-3" style={{
            color: 'rgba(255,255,255,0.72)', fontSize: '1.3rem',
            fontFamily: 'Crimson Pro, serif', lineHeight: 1.75,
            marginBottom: 44, fontStyle: 'italic'
          }}>
            Book your temple darshan slots online.<br />
            Simple, peaceful, and divinely seamless.
          </p>
          <div className="fade-up-4" style={{
            display: 'flex', gap: 16,
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
            <Link to="/temples" className="btn-primary" style={{
              padding: '14px 44px', fontSize: '0.88rem',
              textDecoration: 'none', letterSpacing: '0.12em'
            }}>
              Explore Temples
            </Link>
            <Link to="/register" className="btn-outline" style={{
              padding: '14px 44px', fontSize: '0.88rem',
              textDecoration: 'none', color: '#E8C96A',
              borderColor: 'rgba(201,168,76,0.5)'
            }}>
              Join Free
            </Link>
          </div>
          <div className="fade-up-5" style={{
            display: 'flex', justifyContent: 'center',
            gap: 40, marginTop: 64,
            borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: 32
          }}>
            {[
              { num: temples.length || '—', label: 'Temples Listed' },
              { num: '3', label: 'User Roles' },
              { num: '24/7', label: 'Online Booking' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: '1.8rem', color: '#E8C96A', lineHeight: 1
                }}>{num}</div>
                <div style={{
                  fontFamily: 'Cinzel, serif', fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.5)', marginTop: 6
                }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div style={{
        background: 'linear-gradient(180deg, #FFF8F0, #F5ECD8)',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div className="section-heading">
            <span className="eyebrow">✦ HOW IT WORKS ✦</span>
            <h2>Your Darshan in 3 Steps</h2>
            <div className="rule" />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 2
          }}>
            {[
              { step: '01', icon: '🔍', title: 'Browse Temples', desc: 'Explore sacred temples across India with detailed information, timings, and photos.' },
              { step: '02', icon: '🎟️', title: 'Select a Slot', desc: 'Choose your preferred darshan date and time slot based on live availability.' },
              { step: '03', icon: '✅', title: 'Confirm Booking', desc: 'Book your tickets instantly and manage everything from your dashboard.' },
            ].map((item, i) => (
              <div key={i} className={`fade-up-${i + 1}`} style={{
                background: 'white', padding: '44px 36px', textAlign: 'center',
                borderTop: '3px solid transparent',
                borderImage: 'linear-gradient(90deg, #FF9933, #C9A84C) 1',
                boxShadow: '0 4px 24px rgba(107,15,26,0.07)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: 20, right: 24,
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: '3rem', color: 'rgba(201,168,76,0.12)', lineHeight: 1
                }}>{item.step}</div>
                <div style={{ fontSize: '2.8rem', marginBottom: 20 }}>{item.icon}</div>
                <h4 style={{ color: '#6B0F1A', marginBottom: 12, fontSize: '1.05rem' }}>{item.title}</h4>
                <p style={{ color: '#7A5C3A', fontFamily: 'Crimson Pro, serif', lineHeight: 1.7, fontSize: '1.05rem' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Temples — shows real images ── */}
      {temples.length > 0 && (
        <div style={{ padding: '80px 24px', background: 'var(--cream)' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <div className="section-heading">
              <span className="eyebrow">✦ FEATURED ✦</span>
              <h2>Sacred Temples</h2>
              <div className="rule" />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24
            }}>
              {temples.slice(0, 3).map((t, i) => (
                <div key={t._id} className={`card fade-up-${i + 1}`}>
                  {/* ✅ Real image or fallback */}
                  <div style={{
                    height: 180, position: 'relative', overflow: 'hidden'
                  }}>
                    {t.images?.[0] ? (
                      <img
                        src={t.images[0]}
                        alt={t.name}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', display: 'block'
                        }}
                      />
                    ) : (
                      <div style={{
                        background: 'linear-gradient(160deg, #6B0F1A, #1A0A00)',
                        height: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '3rem'
                      }}>🛕</div>
                    )}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                    }} />
                  </div>
                  <div style={{ padding: '22px 24px 24px' }}>
                    <h5 style={{
                      fontFamily: 'Cinzel, serif', color: '#6B0F1A', marginBottom: 6
                    }}>
                      {t.name}
                    </h5>
                    <p style={{ color: '#C9A84C', fontSize: '0.88rem', marginBottom: 10 }}>
                      📍 {t.location}
                    </p>
                    <p style={{
                      color: '#7A5C3A', fontFamily: 'Crimson Pro, serif',
                      lineHeight: 1.6, fontSize: '1rem', marginBottom: 20
                    }}>
                      {t.description?.slice(0, 80)}
                      {t.description?.length > 80 ? '...' : ''}
                    </p>
                    <Link to={`/temples/${t._id}`} className="btn-primary"
                      style={{
                        display: 'block', textAlign: 'center',
                        textDecoration: 'none', padding: '10px'
                      }}>
                      Book Darshan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link to="/temples" className="btn-outline" style={{ textDecoration: 'none' }}>
                View All Temples →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{
        background: 'linear-gradient(135deg, #1A0A00, #3D0A10)',
        borderTop: '2px solid rgba(201,168,76,0.3)',
        padding: '48px 24px', textAlign: 'center'
      }}>
        <div style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: '1.4rem', color: '#E8C96A', marginBottom: 12
        }}>
          🛕 DarshanEase
        </div>
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'Crimson Pro, serif', fontSize: '0.95rem'
        }}>
          Connecting devotees with sacred temples across India.
        </p>
        <div style={{
          marginTop: 24, color: 'rgba(255,255,255,0.25)',
          fontFamily: 'Cinzel, serif', fontSize: '0.65rem', letterSpacing: '0.1em'
        }}>
          © 2024 DARSHANEASE · ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
};

export default Home;