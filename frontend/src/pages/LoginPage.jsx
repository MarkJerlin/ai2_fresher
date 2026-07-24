import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-5 bg-white border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <span className="fs-3 text-gradient">🎓</span>
          <h4 className="fw-bold text-dark mt-2 mb-1">Sign In</h4>
          <span className="text-secondary small">Access AI Freshers Connect Portal</span>
        </div>

        {error && <div className="alert alert-danger rounded-3 small p-3">{error}</div>}

        {/* Quick Fill Persona Selector */}
        <div className="p-3 bg-light rounded-4 border mb-4 text-center">
          <span className="text-muted d-block small mb-2 fw-semibold" style={{ fontSize: '0.75rem' }}>SELECT LOGIN PERSONA FOR DEMO</span>
          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              onClick={() => { setEmail('john.doe@student.edu'); setPassword('admin123'); }}
              className="btn btn-sm btn-white border rounded-pill px-3 py-1 fw-bold text-primary shadow-sm"
              style={{ fontSize: '0.75rem' }}
            >
              🎓 Student Sign In
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@university.edu'); setPassword('admin123'); }}
              className="btn btn-sm btn-white border rounded-pill px-3 py-1 fw-bold text-danger shadow-sm"
              style={{ fontSize: '0.75rem' }}
            >
              🛡️ Admin Sign In
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary d-flex align-items-center gap-2"><FaEnvelope /> Email Address</label>
            <input
              type="email"
              className="form-control bg-light border-0 p-3 small text-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary d-flex align-items-center gap-2"><FaLock /> Password</label>
            <input
              type="password"
              className="form-control bg-light border-0 p-3 small text-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <div className="text-end mt-2">
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', textDecoration: 'none' }} className="text-primary fw-medium">Forgot Password?</Link>
            </div>
          </div>

          <button type="submit" className="btn btn-gradient w-100 py-3 rounded-pill shadow-none d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            <FaSignInAlt /> {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-secondary small mt-4 mb-0">
          Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
