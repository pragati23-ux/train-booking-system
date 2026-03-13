import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllTemples, createDonation, getMyDonations } from '../services/api';

const PRESET_AMOUNTS = [51, 101, 251, 501, 1001, 5001];

const Donations = () => {
  const [temples, setTemples] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ temple: '', amount: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [t, d] = await Promise.all([getAllTemples(), getMyDonations()]);
      setTemples(t.data);
      setDonations(d.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createDonation(form);
      toast.success('🙏 Donation successful! Jai Shree Ram!');
      setForm({ temple: '', amount: '', message: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;

  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #3D0A10, #6B0F1A)',
        padding: '52px 24px', textAlign: 'center',
        borderBottom: '2px solid rgba(201,168,76,0.3)'
      }}>
        <span style={{
          fontFamily: 'Cinzel, serif', letterSpacing: '0.28em',
          fontSize: '0.72rem', color: '#C9A84C',
          display: 'block', marginBottom: 12
        }}>
          ✦ SEVA ✦
        </span>
        <h1 style={{
          fontFamily: 'Cinzel, serif', color: 'white',
          fontSize: '2.2rem', marginBottom: 8
        }}>
          Make a Donation
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'Crimson Pro, serif', fontStyle: 'italic'
        }}>
          Support sacred temples and earn divine blessings
        </p>
      </div>

      <div className="page-wrap">
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16, marginBottom: 48
        }}>
          {[
            { num: donations.length, label: 'Donations Made' },
            { num: `₹${totalDonated.toLocaleString()}`, label: 'Total Donated' },
            { num: temples.length, label: 'Temples Available' },
          ].map(({ num, label }) => (
            <div key={label} className="stat-box fade-up">
              <span className="stat-number" style={{ fontSize: '1.8rem' }}>{num}</span>
              <span className="stat-label">{label.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 36, alignItems: 'start'
        }}>
          {/* Donation Form */}
          <div className="card fade-up" style={{ padding: 36 }}>
            <h4 style={{
              fontFamily: 'Cinzel, serif', color: '#6B0F1A',
              marginBottom: 28, fontSize: '1rem'
            }}>
              🙏 Donate to a Temple
            </h4>
            <form onSubmit={handleDonate}>
              <div style={{ marginBottom: 20 }}>
                <label className="label">Select Temple</label>
                <select
                  className="input"
                  value={form.temple}
                  onChange={e => setForm({ ...form, temple: e.target.value })}
                  required
                >
                  <option value="">— Choose a Temple —</option>
                  {temples.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* ✅ Preset amounts - fixed === */}
              <div style={{ marginBottom: 20 }}>
                <label className="label">Amount (₹)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {PRESET_AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setForm({ ...form, amount: amt })}
                      style={{
                        padding: '6px 14px', borderRadius: 3,
                        fontFamily: 'Cinzel, serif', fontSize: '0.75rem',
                        cursor: 'pointer', transition: 'all 0.2s',
                        background: Number(form.amount) === amt ? '#6B0F1A' : 'white',
                        color: Number(form.amount) === amt ? '#E8C96A' : '#6B0F1A',
                        border: `1px solid ${Number(form.amount) === amt ? '#6B0F1A' : 'rgba(201,168,76,0.4)'}`,
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className="input"
                  placeholder="Or enter custom amount"
                  value={form.amount}
                  min="1"
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label className="label">Message (Optional)</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Your blessing message..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: 13, fontSize: '0.88rem' }}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : '🙏 Donate Now'}
              </button>
            </form>
          </div>

          {/* Donation History */}
          <div>
            <h4 style={{
              fontFamily: 'Cinzel, serif', color: '#6B0F1A',
              marginBottom: 24, fontSize: '1rem'
            }}>
              My Donation History
            </h4>
            {donations.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 24px' }}>
                <div className="empty-icon">🪔</div>
                <p>No donations yet.<br />Start your seva journey today!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {donations.map((d, i) => (
                  <div
                    key={d._id}
                    className={`card fade-up-${Math.min(i + 1, 5)}`}
                    style={{ padding: '18px 22px' }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div>
                        <h6 style={{
                          fontFamily: 'Cinzel, serif', color: '#6B0F1A',
                          fontSize: '0.88rem', marginBottom: 4
                        }}>
                          🛕 {d.temple?.name}
                        </h6>
                        {d.message && (
                          <p style={{
                            fontFamily: 'Crimson Pro, serif',
                            fontStyle: 'italic', color: '#7A5C3A',
                            fontSize: '0.95rem'
                          }}>
                            "{d.message}"
                          </p>
                        )}
                        <p style={{ color: '#999', fontSize: '0.8rem', marginTop: 4 }}>
                          {new Date(d.donationDate).toDateString()}
                        </p>
                      </div>
                      <div style={{
                        fontFamily: 'Cinzel Decorative, serif',
                        fontSize: '1.2rem', color: '#C9A84C',
                        whiteSpace: 'nowrap', marginLeft: 12
                      }}>
                        ₹{d.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;