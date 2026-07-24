import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import FreshersPartyPage from './pages/FreshersPartyPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentsPage from './pages/DepartmentsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import ClubsPage from './pages/ClubsPage';
import ResourcesPage from './pages/ResourcesPage';
import CampusMapPage from './pages/CampusMapPage';
import ChatbotPage from './pages/ChatbotPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

const RootEntry = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? <Navigate to="/admin-dashboard" replace /> : <LandingPage />;
};

import { useLanguage } from './context/LanguageContext';
import { useLocation } from 'react-router-dom';

const FloatingLanguageSwitcher = () => {
  const { language, setLanguage, LANGUAGES, currentLangObj } = useLanguage();
  const location = useLocation();

  if (location.pathname === '/chatbot') return null;
  return (
    <div className="position-fixed bottom-0 start-0 m-3 dropdown" style={{ zIndex: 1060 }}>
      <button 
        className="btn btn-dark btn-sm rounded-pill px-3 py-2 shadow-lg d-flex align-items-center gap-2 text-white border border-secondary"
        type="button"
        id="floatingLangMenu"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span>🌐 {currentLangObj.native}</span>
        <span className="badge bg-primary text-white rounded-pill">{currentLangObj.flag}</span>
      </button>
      <ul className="dropdown-menu border-0 shadow-lg mb-2 p-2 rounded-4" aria-labelledby="floatingLangMenu" style={{ minWidth: '170px' }}>
        <li className="px-2 py-1 text-muted fw-bold border-bottom mb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
          Select Language
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
              <span>{lang.flag} {lang.native}</span>
              <span className="opacity-50 small">({lang.name})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function AppRoutesContent() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="d-flex flex-column min-vh-100 position-relative overflow-hidden">
      <div className="blob-container">
        <div className="blob blob-blue"></div>
        <div className="blob blob-purple"></div>
        <div className="blob blob-pink"></div>
      </div>
      <div key={`loading-${location.pathname}`} className="route-loading-bar" />
      {!hideNavbar && <Navbar />}
      <main className="flex-grow-1 position-relative" style={{ zIndex: 1 }}>
        <div key={location.pathname} className="page-transition h-100">
          <Routes>
            <Route path="/" element={<RootEntry />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected Portal Routes */}
            <Route path="/party" element={<ProtectedRoute><FreshersPartyPage /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
            <Route path="/facilities" element={<ProtectedRoute><FacilitiesPage /></ProtectedRoute>} />
            <Route path="/clubs" element={<ProtectedRoute><ClubsPage /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><CampusMapPage /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      {!hideNavbar && <Footer />}
      <FloatingLanguageSwitcher />
    </div>
  );
}

function AppRoutes() {
  return (
    <Router>
      <AppRoutesContent />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
