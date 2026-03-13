import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getMyBookings, cancelBooking } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data } = await getMyBookings();
      setBookings(data);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
      fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="spinner" />;

  const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');

  return (
    <div>
      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg, #3D0A10, #6B0F1A)',
        padding: '52px 24px', textAlign: 'center',
        borderBottom: '2px solid rgba(201,168,76,0.3)'
      }}>
        <span style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.28em', fontSize: '0.72rem', color: '#C9A84C', display: 'block', marginBottom: 12 }}>
          ✦ DASHBOARD ✦
        </span>
        <h1 style={{ fontFamily: 'Cinzel, serif', color: 'white', fontSize: '2.2rem' }}>My Bookings</h1>
      </div>

      <div className="page-wrap">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { num: bookings.length, label: 'Total Bookings' },
            { num: confirmed.length, label: 'Confirmed' },
            { num: cancelled.length, label: 'Cancelled' },
            { num: `₹${bookings.filter(b => b.status === 'CONFIRMED').reduce((s, b) => s + b.totalAmount, 0)}`, label: 'Total Spent' },
          ].map(({ num, label }) => (
            <div key={label} className="stat-box fade-up">
              <span className="stat-number">{num}</span>
              <span className="stat-label">{label.toUpperCase()}</span>
            </div>
          ))}
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎟️</div>
            <p>You haven't made any bookings yet.<br />Explore temples and book your darshan!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {bookings.map((b, i) => (
              <div key={b._id} className={`card fade-up-${Math.min(i + 1, 5)}`}>
                <div style={{
                  background: b.status === 'CONFIRMED'
                    ? 'linear-gradient(135deg, #6B0F1A, #3D0A10)'
                    : 'linear-gradient(135deg, #374151, #1F2937)',
                  padding: '20px 24px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <h6 style={{ fontFamily: 'Cinzel, serif', color: 'white', fontSize: '0.9rem', margin: 0 }}>
                    🛕 {b.temple?.name}
                  </h6>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 0' }}>
                    {[
                      ['📍 Location', b.temple?.location],
                      ['📅 Date', new Date(b.slot?.date).toDateString()],
                      ['⏰ Time', b.slot?.time],
                      ['🎟️ Tickets', b.ticketCount],
                      ['💰 Amount', `₹${b.totalAmount}`],
                      ['💵 Per Ticket', `₹${b.slot?.price}`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '0.06em' }}>{label}</div>
                        <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: '1rem', color: '#3D0A10' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  {b.status === 'CONFIRMED' && (
                    <button className="btn-danger" style={{ width: '100%', marginTop: 20 }}
                      onClick={() => handleCancel(b._id)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;