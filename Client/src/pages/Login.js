import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data);
      toast.success(`Welcome back, ${data.name}! 🙏`);
      if (data.role === 'ADMIN') navigate('/admin');
      else navigate('/temples');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FFF8F0 0%, #FFE8CC 100%)',
      padding: 24
    }}>
      <div className="card-custom fade-in" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛕</div>
          <h2 style={{ color: '#6B0F1A', fontSize: '1.6rem' }}>Welcome Back</h2>
          <p style={{ color: '#888', fontFamily: 'Crimson Pro, serif', marginTop: 6 }}>
            Sign in to continue your darshan journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontFamily: 'Cinzel, serif', fontSize: '0.78rem', letterSpacing: '0.06em', color: '#6B0F1A' }}>
              EMAIL ADDRESS
            </label>
            <input name="email" type="email" className="form-control-custom"
              placeholder="your@email.com"
              value={formData.email} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', marginBottom: 6, fontFamily: 'Cinzel, serif', fontSize: '0.78rem', letterSpacing: '0.06em', color: '#6B0F1A' }}>
              PASSWORD
            </label>
            <input name="password" type="password" className="form-control-custom"
              placeholder="••••••••"
              value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary-custom"
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
            disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontFamily: 'Crimson Pro, serif', color: '#666' }}>
          New here?{' '}
          <Link to="/register" style={{ color: '#FF9933', textDecoration: 'none', fontWeight: 600 }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;