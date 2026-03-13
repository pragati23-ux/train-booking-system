import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'USER'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(formData);
      login(data);
      toast.success(`Welcome, ${data.name}! 🙏`);
      navigate('/temples');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: 'block', marginBottom: 6,
    fontFamily: 'Cinzel, serif', fontSize: '0.78rem',
    letterSpacing: '0.06em', color: '#6B0F1A'
  };

  return (
    <div style={{
      minHeight: '90vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FFF8F0 0%, #FFE8CC 100%)',
      padding: 24
    }}>
      <div className="card-custom fade-in" style={{ width: '100%', maxWidth: 480, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🙏</div>
          <h2 style={{ color: '#6B0F1A', fontSize: '1.6rem' }}>Join DarshanEase</h2>
          <p style={{ color: '#888', fontFamily: 'Crimson Pro, serif', marginTop: 6 }}>
            Begin your sacred journey today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'FULL NAME', name: 'name', type: 'text', placeholder: 'Your full name' },
            { label: 'EMAIL ADDRESS', name: 'email', type: 'email', placeholder: 'your@email.com' },
            { label: 'PHONE NUMBER', name: 'phone', type: 'text', placeholder: '9999999999' },
            { label: 'PASSWORD', name: 'password', type: 'password', placeholder: '••••••••' },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: 18 }}>
              <label style={labelStyle}>{field.label}</label>
              <input name={field.name} type={field.type}
                className="form-control-custom"
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name !== 'phone'} />
            </div>
          ))}

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>ROLE</label>
            <select name="role" className="form-control-custom"
              value={formData.role} onChange={handleChange}>
              <option value="USER">Devotee (User)</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn-primary-custom"
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
            disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontFamily: 'Crimson Pro, serif', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#FF9933', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;