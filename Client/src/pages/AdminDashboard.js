import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getAllTemples, createTemple, deleteTemple,
  createSlot, getAllBookings, getAllDonations
} from '../services/api';

const AdminDashboard = () => {
  const [temples, setTemples] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [tab, setTab] = useState('overview');
  const [templeForm, setTempleForm] = useState({
    name: '', location: '', description: '', timings: ''
  });
  const [slotForm, setSlotForm] = useState({
    temple: '', date: '', time: '', capacity: '', price: ''
  });

  // ✅ NEW — image states
  const [templeImage, setTempleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchAll = async () => {
    try {
      const [t, b, d] = await Promise.all([
        getAllTemples(), getAllBookings(), getAllDonations()
      ]);
      setTemples(t.data);
      setBookings(b.data);
      setDonations(d.data);
    } catch { toast.error('Failed to load'); }
  };

  useEffect(() => { fetchAll(); }, []);

  // ✅ NEW — uses FormData to send image
  const handleAddTemple = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', templeForm.name);
      formData.append('location', templeForm.location);
      formData.append('description', templeForm.description);
      formData.append('timings', templeForm.timings);
      if (templeImage) formData.append('image', templeImage);

      await createTemple(formData);
      toast.success('Temple added!');
      setTempleForm({ name: '', location: '', description: '', timings: '' });
      setTempleImage(null);
      setImagePreview(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add temple');
    }
  };

  const handleDeleteTemple = async (id) => {
    if (!window.confirm('Delete this temple?')) return;
    try {
      await deleteTemple(id);
      toast.success('Deleted');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await createSlot(slotForm);
      toast.success('Slot added!');
      setSlotForm({ temple: '', date: '', time: '', capacity: '', price: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((s, b) => s + b.totalAmount, 0);
  const totalDonations = donations.reduce((s, d) => s + d.amount, 0);

  const TABS = ['overview', 'temples', 'slots', 'bookings', 'donations'];

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0A00, #3D0A10)',
        padding: '52px 24px', textAlign: 'center',
        borderBottom: '2px solid rgba(201,168,76,0.3)'
      }}>
        <span style={{
          fontFamily: 'Cinzel, serif', letterSpacing: '0.28em',
          fontSize: '0.72rem', color: '#C9A84C', display: 'block', marginBottom: 12
        }}>
          ✦ CONTROL PANEL ✦
        </span>
        <h1 style={{ fontFamily: 'Cinzel, serif', color: 'white', fontSize: '2.2rem' }}>
          Admin Dashboard
        </h1>
      </div>

      <div className="page-wrap">
        {/* Tabs */}
        <div className="tab-nav">
          {TABS.map(t => (
            <button key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="fade-up">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20, marginBottom: 48
            }}>
              {[
                { num: temples.length, label: 'Total Temples' },
                { num: bookings.length, label: 'Total Bookings' },
                { num: bookings.filter(b => b.status === 'CONFIRMED').length, label: 'Confirmed' },
                { num: `₹${totalRevenue.toLocaleString()}`, label: 'Booking Revenue' },
                { num: donations.length, label: 'Donations' },
                { num: `₹${totalDonations.toLocaleString()}`, label: 'Donations Total' },
              ].map(({ num, label }) => (
                <div key={label} className="stat-box">
                  <span className="stat-number" style={{ fontSize: '1.8rem' }}>{num}</span>
                  <span className="stat-label">{label.toUpperCase()}</span>
                </div>
              ))}
            </div>

            <h4 style={{ fontFamily: 'Cinzel, serif', color: '#6B0F1A', marginBottom: 20 }}>
              Recent Bookings
            </h4>
            <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)' }}>
              <table className="table">
                <thead>
                  <tr>
                    {['User', 'Temple', 'Date', 'Tickets', 'Amount', 'Status'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map(b => (
                    <tr key={b._id}>
                      <td>{b.user?.name}</td>
                      <td>{b.temple?.name}</td>
                      <td>{new Date(b.slot?.date).toDateString()}</td>
                      <td>{b.ticketCount}</td>
                      <td style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}>
                        ₹{b.totalAmount}
                      </td>
                      <td>
                        <span className={`badge badge-${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TEMPLES TAB ── */}
        {tab === 'temples' && (
          <div className="fade-up">
            <div className="card" style={{ padding: 32, marginBottom: 36 }}>
              <h4 style={{ fontFamily: 'Cinzel, serif', color: '#6B0F1A', marginBottom: 24 }}>
                Add New Temple
              </h4>
              <form onSubmit={handleAddTemple}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16, marginBottom: 16
                }}>
                  {[
                    { label: 'TEMPLE NAME', key: 'name', placeholder: 'e.g. Shri Siddhivinayak' },
                    { label: 'LOCATION', key: 'location', placeholder: 'e.g. Mumbai, Maharashtra' },
                    { label: 'TIMINGS', key: 'timings', placeholder: 'e.g. 6:00 AM – 9:00 PM' },
                    { label: 'DESCRIPTION', key: 'description', placeholder: 'Brief description...' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="label">{label}</label>
                      <input className="input" placeholder={placeholder}
                        value={templeForm[key]}
                        onChange={e => setTempleForm({ ...templeForm, [key]: e.target.value })}
                        required={key !== 'description'} />
                    </div>
                  ))}

                  {/* ✅ NEW — Image upload field */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="label">Temple Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="input"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setTempleImage(file);
                        if (file) setImagePreview(URL.createObjectURL(file));
                      }}
                    />
                    {/* ✅ NEW — Image preview */}
                    {imagePreview && (
                      <div style={{
                        marginTop: 12, position: 'relative',
                        display: 'inline-block'
                      }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: '100%', maxWidth: 320, height: 180,
                            objectFit: 'cover', borderRadius: 6,
                            border: '2px solid rgba(201,168,76,0.4)',
                            display: 'block'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setTempleImage(null);
                            setImagePreview(null);
                          }}
                          style={{
                            position: 'absolute', top: 8, right: 8,
                            background: '#6B0F1A', color: 'white',
                            border: 'none', borderRadius: '50%',
                            width: 28, height: 28, cursor: 'pointer',
                            fontSize: '0.85rem', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                          }}>
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-primary">
                  Add Temple
                </button>
              </form>
            </div>

            {/* Temple list */}
            <h4 style={{ fontFamily: 'Cinzel, serif', color: '#6B0F1A', marginBottom: 20 }}>
              All Temples ({temples.length})
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20
            }}>
              {temples.map((t, i) => (
                <div key={t._id} className={`card fade-up-${Math.min(i + 1, 5)}`}>
                  {/* ✅ Shows image if exists */}
                  <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                    {t.images?.[0] ? (
                      <img src={t.images[0]} alt={t.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        background: 'linear-gradient(135deg, #6B0F1A, #1A0A00)',
                        height: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem'
                      }}>🛕</div>
                    )}
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <p style={{
                      fontFamily: 'Cinzel, serif', color: '#6B0F1A',
                      fontSize: '0.88rem', marginBottom: 4
                    }}>
                      {t.name}
                    </p>
                    <p style={{ color: '#C9A84C', fontSize: '0.85rem', marginBottom: 4 }}>
                      📍 {t.location}
                    </p>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 16 }}>
                      ⏰ {t.timings}
                    </p>
                    <button className="btn-danger" style={{ width: '100%' }}
                      onClick={() => handleDeleteTemple(t._id)}>
                      Delete Temple
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SLOTS TAB ── */}
        {tab === 'slots' && (
          <div className="fade-up">
            <div className="card" style={{ padding: 32, maxWidth: 640 }}>
              <h4 style={{ fontFamily: 'Cinzel, serif', color: '#6B0F1A', marginBottom: 24 }}>
                Add Darshan Slot
              </h4>
              <form onSubmit={handleAddSlot}>
                <div style={{ marginBottom: 18 }}>
                  <label className="label">Select Temple</label>
                  <select className="input" value={slotForm.temple}
                    onChange={e => setSlotForm({ ...slotForm, temple: e.target.value })}
                    required>
                    <option value="">— Choose Temple —</option>
                    {temples.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 16, marginBottom: 18
                }}>
                  <div>
                    <label className="label">Date</label>
                    <input type="date" className="input" value={slotForm.date}
                      onChange={e => setSlotForm({ ...slotForm, date: e.target.value })}
                      required />
                  </div>
                  <div>
                    <label className="label">Time</label>
                    <input type="text" className="input" placeholder="e.g. 6:00 AM"
                      value={slotForm.time}
                      onChange={e => setSlotForm({ ...slotForm, time: e.target.value })}
                      required />
                  </div>
                  <div>
                    <label className="label">Capacity</label>
                    <input type="number" className="input" placeholder="e.g. 50"
                      value={slotForm.capacity}
                      onChange={e => setSlotForm({ ...slotForm, capacity: e.target.value })}
                      required />
                  </div>
                  <div>
                    <label className="label">Price (₹)</label>
                    <input type="number" className="input" placeholder="e.g. 100"
                      value={slotForm.price}
                      onChange={e => setSlotForm({ ...slotForm, price: e.target.value })}
                      required />
                  </div>
                </div>
                <button type="submit" className="btn-primary">Add Slot</button>
              </form>
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <div className="fade-up">
            <h4 style={{ fontFamily: 'Cinzel, serif', color: '#6B0F1A', marginBottom: 20 }}>
              All Bookings ({bookings.length})
            </h4>
            <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)' }}>
              <table className="table">
                <thead>
                  <tr>
                    {['User', 'Temple', 'Date', 'Time', 'Tickets', 'Amount', 'Status'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td>{b.user?.name}</td>
                      <td>{b.temple?.name}</td>
                      <td>{new Date(b.slot?.date).toDateString()}</td>
                      <td>{b.slot?.time}</td>
                      <td>{b.ticketCount}</td>
                      <td style={{ color: '#C9A84C', fontFamily: 'Cinzel, serif' }}>
                        ₹{b.totalAmount}
                      </td>
                      <td>
                        <span className={`badge badge-${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DONATIONS TAB ── */}
        {tab === 'donations' && (
          <div className="fade-up">
            <h4 style={{ fontFamily: 'Cinzel, serif', color: '#6B0F1A', marginBottom: 20 }}>
              All Donations ({donations.length})
            </h4>
            <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)' }}>
              <table className="table">
                <thead>
                  <tr>
                    {['User', 'Temple', 'Amount', 'Message', 'Date'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d._id}>
                      <td>{d.user?.name}</td>
                      <td>{d.temple?.name}</td>
                      <td style={{ color: '#C9A84C', fontFamily: 'Cinzel, serif' }}>
                        ₹{d.amount}
                      </td>
                      <td style={{ fontStyle: 'italic', color: '#7A5C3A' }}>
                        {d.message || '—'}
                      </td>
                      <td>{new Date(d.donationDate).toDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;