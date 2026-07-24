import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaQrcode, FaGraduationCap, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DigitalIDCard = () => {
  const { user, getDefaultAvatar } = useAuth();
  const cardRef = useRef(null);

  if (!user) return null;

  // Setup simple QR SVG generation for student verification
  const studentQRValue = `VERIFY-ID-${user.id}-${user.roll_no || 'TEMP'}`;

  const downloadCard = () => {
    // Standard browsers print/saving trigger
    window.print();
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4">
      <motion.div
        ref={cardRef}
        className="glass-card p-4 text-dark position-relative border-0 shadow-lg"
        style={{
          width: '350px',
          height: '520px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(224, 242, 254, 0.7) 100%)',
          borderRadius: '24px',
          overflow: 'hidden'
        }}
        initial={{ rotateY: -180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        {/* Floating Gradient circles inside card */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(66,133,244,0.15) 0%, rgba(138,63,252,0.05) 100%)',
          zIndex: 0
        }}></div>

        {/* Card Content Wrapper */}
        <div className="position-relative h-100 d-flex flex-column justify-content-between" style={{ zIndex: 1 }}>
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4 text-gradient">🎓</span>
              <div>
                <h6 className="mb-0 fw-bold tracking-tight text-gradient">GDG Connect</h6>
                <span className="text-muted fw-semibold" style={{ fontSize: '0.6rem' }}>OFFICIAL DIGITAL ID</span>
              </div>
            </div>
            <span className="badge-gdg">2026-2027</span>
          </div>

          {/* Student Avatar */}
          <div className="d-flex flex-column align-items-center my-3">
            <div className="position-relative">
              <img
                src={user.avatar?.startsWith('http') ? user.avatar : (user.avatar && user.avatar !== 'default_avatar.png' ? `http://localhost:5000/uploads/avatars/${user.avatar}` : getDefaultAvatar(user.name))}
                alt={user.name}
                className="rounded-circle border border-3 border-white shadow-sm"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = getDefaultAvatar(user.name) }}
              />
              <span className="position-absolute bottom-0 right-0 bg-success p-2 border border-2 border-white rounded-circle"></span>
            </div>
            <h5 className="mt-3 mb-0 fw-bold text-dark">{user.name}</h5>
            <span className="text-secondary small fw-medium" style={{ textTransform: 'uppercase' }}>{user.role}</span>
          </div>

          {/* Student Info Details */}
          <div className="bg-white bg-opacity-50 p-3 rounded-4 border border-white">
            <div className="row g-2 text-start">
              <div className="col-6">
                <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>ROLL NUMBER</span>
                <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{user.roll_no || 'Not Assigned'}</span>
              </div>
              <div className="col-6">
                <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>DEPARTMENT</span>
                <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{user.department || 'General'}</span>
              </div>
              <div className="col-12">
                <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>EMAIL ADDRESS</span>
                <span className="fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>{user.email}</span>
              </div>
            </div>
          </div>

          {/* QR Scan and Verification footer */}
          <div className="d-flex align-items-center justify-content-between mt-3 border-top pt-3">
            <div className="text-start">
              <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>SCAN TO ATTEND EVENTS</span>
              <span className="fw-bold text-gradient-orange" style={{ fontSize: '0.75rem' }}>GDG Ambassador Approved</span>
            </div>
            <div className="p-2 bg-white rounded-3 border">
              {/* Fallback clean placeholder QR representation */}
              <FaQrcode size={38} className="text-dark" title={studentQRValue} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action triggers */}
      <button onClick={downloadCard} className="btn btn-outline-primary rounded-pill mt-4 d-flex align-items-center gap-2 px-4 shadow-sm border-0 bg-white">
        <FaDownload /> Print / Save ID Card
      </button>
    </div>
  );
};

export default DigitalIDCard;
