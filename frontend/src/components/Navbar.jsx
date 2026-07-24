import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaGraduationCap, FaUser, FaSignOutAlt, FaTachometerAlt, FaGlobe } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout, getDefaultAvatar } = useAuth();
  const { language, setLanguage, t, LANGUAGES, currentLangObj } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const uploadBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '/uploads') || 'http://localhost:5000/uploads';

  return (
    <nav className="navbar navbar-expand-xl navbar-light sticky-top glass-card mx-2 mx-md-3 my-2" style={{ zIndex: 1030 }}>
      <div className="container-fluid px-2 px-md-3">
        <Link className="navbar-brand d-flex align-items-center me-2 me-lg-3 flex-shrink-0" to="/">
          <span className="me-2 fs-3 text-gradient d-inline-block" style={{ transform: 'rotate(-10deg)' }}>🎓</span>
          <div className="d-flex flex-column leading-none">
            <span className="fw-bold tracking-tight text-gradient" style={{ fontSize: '1.15rem' }}>GDG Connect</span>
            <span className="text-muted fw-medium" style={{ fontSize: '0.62rem', marginTop: '-3px' }}>AI Freshers Portal</span>
          </div>
        </Link>
        
        <button className="navbar-toggler border-0 shadow-none p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto align-items-center gap-1 flex-wrap">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-2 py-1 rounded-pill fw-medium ${isActive ? 'bg-light text-primary' : 'text-secondary'}`} style={{ fontSize: '0.81rem' }} to="/">{t('nav_home')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-2 py-1 rounded-pill fw-medium ${isActive ? 'bg-light text-primary' : 'text-secondary'}`} style={{ fontSize: '0.81rem' }} to="/party">{t('nav_party')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-2 py-1 rounded-pill fw-medium ${isActive ? 'bg-light text-primary' : 'text-secondary'}`} style={{ fontSize: '0.81rem' }} to="/departments">{t('nav_departments')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-2 py-1 rounded-pill fw-medium ${isActive ? 'bg-light text-primary' : 'text-secondary'}`} style={{ fontSize: '0.81rem' }} to="/facilities">{t('nav_facilities') || 'Facilities'}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-2 py-1 rounded-pill fw-medium ${isActive ? 'bg-light text-primary' : 'text-secondary'}`} style={{ fontSize: '0.81rem' }} to="/clubs">{t('nav_clubs')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-2 py-1 rounded-pill fw-medium ${isActive ? 'bg-light text-primary' : 'text-secondary'}`} style={{ fontSize: '0.81rem' }} to="/resources">{t('nav_resources')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-2 py-1 rounded-pill fw-medium ${isActive ? 'bg-light text-primary' : 'text-secondary'}`} style={{ fontSize: '0.81rem' }} to="/map">{t('nav_map')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-2 py-1 rounded-pill fw-semibold text-gradient ${isActive ? 'bg-light text-primary' : ''}`} style={{ fontSize: '0.81rem' }} to="/chatbot">{t('nav_chatbot')}</NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-xl-0 justify-content-center flex-shrink-0">
            
            {/* 🌐 Language Switcher Dropdown */}
            <div className="dropdown flex-shrink-0">
              <button 
                className="btn btn-sm btn-light border rounded-pill px-2.5 py-1 d-flex align-items-center gap-1 shadow-sm text-dark fw-semibold"
                type="button"
                id="languageMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: '0.8rem' }}
              >
                <span>{currentLangObj.flag}</span>
                <span>{currentLangObj.native}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 p-2 rounded-4" aria-labelledby="languageMenu" style={{ minWidth: '170px', zIndex: 1050 }}>
                <li className="px-2 py-1 text-muted fw-bold border-bottom mb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
                  🌐 Select Language
                </li>
                {LANGUAGES.map((lang) => (
                  <li key={lang.code}>
                    <button
                      className={`dropdown-item rounded-3 d-flex align-items-center justify-content-between py-1.5 px-2 ${
                        language === lang.code ? 'bg-primary text-white fw-bold' : 'text-dark'
                      }`}
                      onClick={() => setLanguage(lang.code)}
                      style={{ fontSize: '0.84rem' }}
                    >
                      <span className="d-flex align-items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.native}</span>
                      </span>
                      <span className="opacity-50 small">({lang.name})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {isAuthenticated ? (
              <div className="dropdown flex-shrink-0">
                <button className="btn d-flex align-items-center gap-2 border-0 dropdown-toggle px-2 py-1 bg-light rounded-pill" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                  <img 
                    src={user.avatar?.startsWith('http') ? user.avatar : (user.avatar && user.avatar !== 'default_avatar.png' ? `${uploadBaseUrl}/avatars/${user.avatar}` : getDefaultAvatar(user.name))} 
                    alt={user.name} 
                    className="rounded-circle border" 
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = getDefaultAvatar(user.name) }}
                  />
                  <div className="text-start d-none d-sm-block">
                    <div className="fw-semibold text-dark" style={{ fontSize: '0.82rem' }}>{user.name.split(' ')[0]}</div>
                    <div className="text-muted" style={{ fontSize: '0.62rem', textTransform: 'capitalize' }}>{user.role}</div>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 p-2 rounded-4" aria-labelledby="userMenu">
                  <li>
                    <Link className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2" to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}>
                      <FaTachometerAlt className="text-muted" /> {t('nav_dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2" to="/dashboard?tab=profile">
                      <FaUser className="text-muted" /> {t('nav_profile')}
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-2" /></li>
                  <li>
                    <button className="dropdown-item text-danger rounded-3 d-flex align-items-center gap-2 py-2" onClick={handleLogout}>
                      <FaSignOutAlt /> {t('nav_signout')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-1 flex-shrink-0">
                <Link className="btn btn-sm btn-google py-1.5 px-3 border-0 bg-transparent text-secondary hover-bg-light" to="/login">{t('nav_signin')}</Link>
                <Link className="btn btn-sm btn-gradient py-1.5 px-3 shadow-none" to="/register">{t('nav_join')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
