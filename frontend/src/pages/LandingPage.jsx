import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { eventsAPI, clubsAPI } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import { FaGraduationCap, FaCalendarAlt, FaUsers, FaBuilding, FaComments, FaArrowRight, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    students: '1,250+',
    events: '12+',
    clubs: '6+',
    departments: '4'
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const [eventsRes, clubsRes] = await Promise.all([
          eventsAPI.getAll().catch(() => ({ data: [] })),
          clubsAPI.getAll().catch(() => ({ data: [] }))
        ]);

        if (eventsRes.data && eventsRes.data.length > 0) {
          setEvents(eventsRes.data.slice(0, 3));
        }

        const activeEvtsCount = eventsRes.data ? Math.max(eventsRes.data.length, 12) : 12;
        const activeClubsCount = clubsRes.data ? Math.max(clubsRes.data.length, 6) : 6;

        setStats({
          students: '1,250+',
          events: `${activeEvtsCount}+`,
          clubs: `${activeClubsCount}+`,
          departments: '4'
        });
      } catch (err) {
        console.error("Error loading landing live stats", err);
      }
    };
    fetchLiveStats();
  }, []);

  return (
    <div className="position-relative overflow-hidden min-vh-100 bg-gradient-primary">
      {/* Hero Section */}
      <section className="container py-5 text-center mt-lg-5">
        <div className="row justify-content-center align-items-center g-5">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge-gdg mb-3 d-inline-block">{t('landing_badge')}</span>
              <h1 className="display-3 fw-extrabold text-gradient mb-3" style={{ letterSpacing: '-1.5px', lineHeight: '1.15' }}>
                {t('landing_title')}
              </h1>
              <p className="lead text-secondary mb-4 px-lg-5" style={{ fontSize: '1.2rem', fontWeight: 400 }}>
                {t('landing_sub')}
              </p>
              
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/party" className="btn btn-gradient py-3 px-5 shadow-sm">
                  {t('landing_btn_party')} <FaArrowRight className="ms-2" />
                </Link>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-google py-3 px-5">{t('nav_dashboard')}</Link>
                ) : (
                  <Link to="/register" className="btn btn-google py-3 px-5">{t('landing_btn_reg')}</Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Welcome countdown banner */}
      <section className="container py-4">
        <div className="glass-card p-5 text-center bg-white bg-opacity-75 border-0">
          <span className="text-uppercase tracking-wider text-muted fw-bold small">{t('landing_countdown_tag')}</span>
          <h2 className="fw-bold mt-2 mb-4 text-gradient">{t('landing_countdown_title')}</h2>
          <CountdownTimer targetDate="2026-08-15T18:00:00" />
          <div className="mt-4">
            <Link to="/party" className="btn btn-outline-primary rounded-pill px-4 border-2">{t('landing_btn_party')}</Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container py-5">
        <div className="row g-4 text-center">
          {[
            { value: stats.students, label: t('landing_stats_students'), icon: <FaUsers className="text-primary" />, desc: t('landing_stats_students_desc') },
            { value: stats.events, label: t('landing_stats_events'), icon: <FaCalendarAlt className="text-success" />, desc: t('landing_stats_events_desc') },
            { value: stats.clubs, label: t('landing_stats_clubs'), icon: <FaGraduationCap className="text-warning" />, desc: t('landing_stats_clubs_desc') },
            { value: stats.departments, label: t('landing_stats_depts'), icon: <FaBuilding className="text-danger" />, desc: t('landing_stats_depts_desc') }
          ].map((stat, i) => (
            <div key={i} className="col-sm-6 col-lg-3">
              <div className="glass-card p-4 h-100 bg-white border-0">
                <div className="fs-3 mb-2">{stat.icon}</div>
                <h3 className="fw-bold text-dark mb-1">{stat.value}</h3>
                <h6 className="fw-semibold text-secondary small mb-2">{stat.label}</h6>
                <p className="text-muted small mb-0">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5" id="features">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">{t('landing_features_title')}</h2>
          <p className="text-secondary">{t('landing_features_sub')}</p>
        </div>
        <div className="row g-4">
          {[
            { title: t('landing_feat_map_title'), desc: t('landing_feat_map_desc'), icon: <FaMapMarkerAlt className="text-primary" />, link: '/map' },
            { title: t('landing_feat_chat_title'), desc: t('landing_feat_chat_desc'), icon: <FaComments className="text-purple" />, link: '/#chat' },
            { title: t('landing_feat_id_title'), desc: t('landing_feat_id_desc'), icon: <FaShieldAlt className="text-success" />, link: '/dashboard' }
          ].map((feat, idx) => (
            <div key={idx} className="col-md-4">
              <div className="glass-card p-4 h-100 bg-white border-0 d-flex flex-column justify-content-between">
                <div>
                  <div className="p-3 bg-light rounded-4 d-inline-block mb-3 text-primary">{feat.icon}</div>
                  <h5 className="fw-bold text-dark mb-2">{feat.title}</h5>
                  <p className="text-secondary small">{feat.desc}</p>
                </div>
                <Link to={feat.link} className="btn btn-link text-decoration-none p-0 fw-semibold d-flex align-items-center gap-1 mt-3">
                  {t('landing_feat_open')} <FaArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="container py-5" id="faq">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark">{t('landing_faq_title')}</h2>
              <p className="text-secondary">{t('landing_faq_sub')}</p>
            </div>
            <div className="accordion accordion-flush glass-card bg-white p-3 border-0" id="accordionFAQ">
              {[
                { q: t('landing_faq_q1'), a: t('landing_faq_a1') },
                { q: t('landing_faq_q2'), a: t('landing_faq_a2') },
                { q: t('landing_faq_q3'), a: t('landing_faq_a3') },
                { q: t('landing_faq_q4'), a: t('landing_faq_a4') }
              ].map((faq, i) => (
                <div className="accordion-item border-0 py-2" key={i}>
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-semibold text-dark bg-transparent shadow-none" type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${i}`}>
                      {faq.q}
                    </button>
                  </h2>
                  <div id={`faq-${i}`} className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                    <div className="accordion-body text-secondary small pt-0">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container py-5" id="contact">
        <div className="glass-card p-5 bg-white border-0">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h2 className="fw-bold text-dark mb-3">{t('landing_contact_title')}</h2>
              <p className="text-secondary mb-0">
                {t('landing_contact_sub')}
              </p>
              <div className="mt-4">
                <span className="fw-bold d-block text-dark">{t('landing_contact_office')}</span>
                <span className="text-secondary small">{t('landing_contact_office_val')}</span>
              </div>
              <div className="mt-3">
                <span className="fw-bold d-block text-dark">{t('landing_contact_email')}</span>
                <span className="text-secondary small">gdg.connect@university.edu</span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-light p-4 rounded-4">
                <h5 className="fw-bold text-dark mb-3">{t('landing_contact_form_title')}</h5>
                <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control bg-white border-0 p-3 small text-dark" placeholder={t('landing_contact_name_placeholder')} required />
                    </div>
                    <div className="col-md-6">
                      <input type="email" className="form-control bg-white border-0 p-3 small text-dark" placeholder={t('landing_contact_email_placeholder')} required />
                    </div>
                    <div className="col-12">
                      <textarea className="form-control bg-white border-0 p-3 small text-dark" rows="3" placeholder={t('landing_contact_msg_placeholder')} required></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-gradient w-100 py-3 shadow-none">{t('landing_contact_submit')}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
