import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg({ type: 'success', text: 'A reset password link has been sent to your registered email address (if it exists).' });
    setEmail('');
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-5 bg-white border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <span className="fs-3 text-gradient">🎓</span>
          <h4 className="fw-bold text-dark mt-2 mb-1">Forgot Password</h4>
          <span className="text-secondary small font-medium">Verify your email to reset credentials</span>
        </div>

        {msg && <div className={`alert alert-${msg.type} rounded-3 small`}>{msg.text}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary d-flex align-items-center gap-2"><FaEnvelope /> Registered Email</label>
            <input
              type="email"
              className="form-control bg-light border-0 p-3 small text-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              required
            />
          </div>

          <button type="submit" className="btn btn-gradient w-100 py-3 rounded-pill shadow-none mb-3">Send Reset Instructions</button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-secondary small text-decoration-none d-flex align-items-center justify-content-center gap-2">
            <FaArrowLeft size={10} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
