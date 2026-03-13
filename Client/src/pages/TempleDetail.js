import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTempleById, getSlotsByTemple, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TempleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingSlot, setBookingSlot] = useState(null);

  useEffect(() => {
    Promise.all([getTempleById(id), getSlotsByTemple(id)])
      .then(([t, s]) => { setTemple(t.data); setSlots(s.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async (slot) => {
    if (!user) return toast.error('Please login to book');
    setBookingSlot(slot._id);
    try {
      await createBooking({ temple: id, slot: slot._id, ticketCount });
      toast.success(`🎟️ ${ticketCount} ticket(s) booked!`);
      const { data } = await getSlotsByTemple(id);
      setSlots(data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Booking failed');
    } finally { setBookingSlot(null); }
  };

  if (loading) return <div className="spinner" />;
  if (!temple) return (
    <div className="page-wrap" style={{ textAlign: 'center', color: '#6B0F1A' }}>
      Temple not found.
    </div>
  );

  return (
    <div>
      {/* ✅ Hero — shows real image if exists */}
      <div style={{
        background: 'linear-gradient(160deg, #1A0A00 0%, #3D0A10 40%, #6B0F1A 100%)',
        position: 'relative', overflow: 'hidden',
        minHeight: 320,
        display: 'flex', alignItems: 'flex-end'
      }}>
        {/* Background image if exists */}
        {temple.images?.[0] && (
          <img
            src={temple.images[0]}
            alt={temple.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.35
            }}
          />
        )}

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,10,0,0.95) 0%, rgba(26,10,0,0.4) 60%, transparent 100%)'
        }} />

        {/* Hero content */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 1140,
          margin: '0 auto', padding: '48px 24px'
        }}>
          <p style={{
            fontFamily: 'Cinzel, serif', color: '#C9A84C',
            letterSpacing: '0.25em', fontSize: '0.72rem', marginBottom: 12
          }}>
            ✦ DARSHAN BOOKING ✦
          </p>
          <h1 style={{
            fontFamily: 'Cinzel, serif', color: 'white',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 10
          }}>
            {temple.name}
          </h1>
          <p style={{ color: '#C9A84C', fontFamily: 'Cinzel, serif', fontSize: '0.85rem' }}>
            📍 {temple.location} &nbsp;·&nbsp; ⏰ {temple.timings}
          </p>
        </div>
      </div>

      <div className="page-wrap">
        {/* Temple info cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 20, marginBottom: 40
        }}>
          <div className="card fade-up" style={{ padding: '24px 28px' }}>
            <h5 style={{
              fontFamily: 'Cinzel, serif', color: '#6B0F1A',
              marginBottom: 12, fontSize: '0.82rem', letterSpacing: '0.08em'
            }}>
              ABOUT THIS TEMPLE
            </h5>
            <p style={{
              fontFamily: 'Crimson Pro, serif', lineHeight: 1.75,
              color: '#4A3020', fontSize: '1.05rem'
            }}>
              {temple.description || 'No description available.'}
            </p>
          </div>
          <div className="card fade-up-1" style={{ padding: '24px 28px' }}>
            <h5 style={{
              fontFamily: 'Cinzel, serif', color: '#6B0F1A',
              marginBottom: 16, fontSize: '0.82rem', letterSpacing: '0.08em'
            }}>
              TEMPLE DETAILS
            </h5>
            {[
              ['📍 Location', temple.location],
              ['⏰ Timings', temple.timings],
              ['🎟️ Slots Available', slots.length],
            ].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: '0.72rem', fontFamily: 'Cinzel, serif',
                  color: '#C9A84C', letterSpacing: '0.06em', marginBottom: 3
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: '1.05rem', color: '#3D0A10'
                }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket counter */}
        <div className="card fade-up-2" style={{
          padding: '22px 28px', marginBottom: 36,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
        }}>
          <div>
            <label className="label" style={{ marginBottom: 10 }}>
              Number of Tickets
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1px solid rgba(201,168,76,0.4)',
                  background: 'white', cursor: 'pointer',
                  fontFamily: 'Cinzel, serif', fontSize: '1.2rem',
                  color: '#6B0F1A', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>−</button>
              <span style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: '1.6rem', color: '#6B0F1A',
                minWidth: 28, textAlign: 'center'
              }}>
                {ticketCount}
              </span>
              <button
                onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1px solid rgba(201,168,76,0.4)',
                  background: 'white', cursor: 'pointer',
                  fontFamily: 'Cinzel, serif', fontSize: '1.2rem',
                  color: '#6B0F1A', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>+</button>
            </div>
          </div>
          {!user && (
            <p style={{
              fontFamily: 'Crimson Pro, serif',
              color: '#7A5C3A', fontStyle: 'italic'
            }}>
              <Link to="/login" style={{ color: '#FF9933' }}>Login</Link> to book slots
            </p>
          )}
        </div>

        {/* Slots */}
        <h3 style={{
          fontFamily: 'Cinzel, serif', color: '#6B0F1A',
          marginBottom: 24, fontSize: '1rem', letterSpacing: '0.08em'
        }}>
          AVAILABLE DARSHAN SLOTS
        </h3>

        {slots.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗓️</div>
            <p>No slots available for this temple yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20
          }}>
            {slots.map((slot, i) => {
              const remaining = slot.capacity - slot.bookedCount;
              const isFull = remaining === 0;
              const isLow = remaining <= 5 && remaining > 0;

              return (
                <div
                  key={slot._id}
                  className={`card fade-up-${Math.min(i + 1, 5)}`}
                >
                  {/* Slot header */}
                  <div style={{
                    background: isFull
                      ? 'linear-gradient(135deg, #374151, #1F2937)'
                      : 'linear-gradient(135deg, #6B0F1A, #3D0A10)',
                    padding: '18px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontFamily: 'Cinzel, serif',
                      color: 'white', fontSize: '1rem'
                    }}>
                      ⏰ {slot.time}
                    </span>
                    {isFull && (
                      <span className="badge" style={{
                        background: '#991B1B',
                        color: 'white', border: 'none'
                      }}>
                        FULL
                      </span>
                    )}
                    {isLow && !isFull && (
                      <span className="badge" style={{
                        background: '#92400E',
                        color: '#FDE68A', border: 'none'
                      }}>
                        ALMOST FULL
                      </span>
                    )}
                  </div>

                  {/* Slot details */}
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px 0', marginBottom: 18
                    }}>
                      {[
                        ['📅 Date', new Date(slot.date).toDateString()],
                        ['💺 Seats Left', `${remaining} / ${slot.capacity}`],
                        ['💰 Per Ticket', `₹${slot.price}`],
                        ['💵 Your Total', `₹${slot.price * ticketCount}`],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={{
                            fontSize: '0.68rem', fontFamily: 'Cinzel, serif',
                            color: '#C9A84C', letterSpacing: '0.06em', marginBottom: 2
                          }}>
                            {label}
                          </div>
                          <div style={{
                            fontFamily: 'Crimson Pro, serif',
                            fontSize: '0.95rem', color: '#3D0A10'
                          }}>
                            {val}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn-primary"
                      style={{ width: '100%', padding: '10px' }}
                      onClick={() => handleBooking(slot)}
                      disabled={isFull || bookingSlot === slot._id || !user}
                    >
                      {bookingSlot === slot._id
                        ? 'Booking...'
                        : isFull
                        ? 'Slot Full'
                        : 'Book Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleDetail;