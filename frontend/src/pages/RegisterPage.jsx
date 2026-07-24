import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaGraduationCap } from 'react-icons/fa';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [rollNo, setRollNo] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        role: 'student', // Default registration is student
        department: department || null,
        roll_no: rollNo || null
      });

      setSuccess(`🎉 Account registered for ${name}! 📩 Official confirmation email dispatched to ${email}. Redirecting...`);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-5 bg-white border-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <span className="fs-3 text-gradient">🎓</span>
          <h4 className="fw-bold text-dark mt-2 mb-1">Create Account</h4>
          <span className="text-secondary small">Join AI Freshers Connect Portal</span>
        </div>

        {error && <div className="alert alert-danger rounded-3 small p-3">{error}</div>}
        {success && <div className="alert alert-success rounded-3 small p-3">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary d-flex align-items-center gap-2"><FaUser /> Full Name</label>
            <input
              type="text"
              className="form-control bg-light border-0 p-3 small text-dark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary d-flex align-items-center gap-2"><FaLock /> Password</label>
            <input
              type="password"
              className="form-control bg-light border-0 p-3 small text-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create strong password"
              required
            />
          </div>

          <div className="row g-2 mb-4">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">Department (Optional)</label>
              <select className="form-select bg-light border-0 p-3 small text-dark" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">Select Branch</option>
                <option value="IT">IT</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="ECE">ECE</option>
                <option value="AIDS">AIDS</option>
                <option value="ICE">ICE</option>
                <option value="CIVIL">CIVIL</option>
                <option value="MBA">MBA</option>
                <option value="ENGLISH">ENGLISH</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">Roll Number (Optional)</label>
              <input
                type="text"
                className="form-control bg-light border-0 p-3 small text-dark"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. CSE2026001"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gradient w-100 py-3 rounded-pill shadow-none d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            <FaGraduationCap /> {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-secondary small mt-4 mb-0">
          Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
