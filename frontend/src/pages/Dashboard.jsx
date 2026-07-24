import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, partyAPI, announcementsAPI } from '../services/api';
import DigitalIDCard from '../components/DigitalIDCard';
import { FaUser, FaTachometerAlt, FaCalendarCheck, FaBullhorn, FaBookOpen, FaSave, FaCamera, FaChevronRight } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const { user, updateProfile, getDefaultAvatar } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [registeredParty, setRegisteredParty] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // Profile settings state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileDept, setProfileDept] = useState(user?.department || '');
  const [profileRoll, setProfileRoll] = useState(user?.roll_no || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileMsg, setProfileMsg] = useState(null);

  // Recommendations state
  const [studyPlan, setStudyPlan] = useState([
    { day: 'Monday', topics: 'Mathematics (Calculus Intro), CSE Programming Lab' },
    { day: 'Wednesday', topics: 'Engineering Physics notes reading, IT database practice' },
    { day: 'Friday', topics: 'ECE signals analysis, GDG weekly coding practice' }
  ]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const eventsRes = await eventsAPI.getAll();
        setAllEvents(eventsRes.data);

        const partyRes = await partyAPI.getStatus();
        if (partyRes.data.registered) {
          setRegisteredParty(partyRes.data.details);
        }

        const noticeRes = await announcementsAPI.getAll();
        setAnnouncements(noticeRes.data);
      } catch (err) {
        console.error("Dashboard loaded with errors", err);
      }
    };
    loadDashboardData();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', profileName);
      formData.append('department', profileDept);
      formData.append('roll_no', profileRoll);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await updateProfile(formData);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile.' });
    }
  };

  const uploadBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '/uploads') || 'http://localhost:5000/uploads';

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Left Side Navigation Panel */}
        <div className="col-lg-3">
          <div className="glass-card p-4 bg-white border-0 sticky-top" style={{ top: '90px' }}>
            <div className="text-center mb-4 pb-3 border-bottom">
              <img
                src={avatarPreview || (user?.avatar?.startsWith('http') ? user?.avatar : (user?.avatar && user?.avatar !== 'default_avatar.png' ? `${uploadBaseUrl}/avatars/${user?.avatar}` : getDefaultAvatar(user?.name)))}
                alt="avatar"
                className="rounded-circle border mb-2 shadow-sm"
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = getDefaultAvatar(user?.name) }}
              />
              <h6 className="fw-bold text-dark mb-0">{user?.name}</h6>
              <span className="text-muted small" style={{ textTransform: 'uppercase' }}>{user?.role}</span>
            </div>

            <div className="d-flex flex-column gap-1">
              {[
                { id: 'overview', name: 'Overview', icon: <FaTachometerAlt /> },
                { id: 'idcard', name: 'Digital ID Card', icon: <FaUser /> },
                { id: 'planner', name: 'Study Planner', icon: <FaBookOpen /> },
                { id: 'profile', name: 'Profile Settings', icon: <FaSave /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 transition ${activeTab === tab.id ? 'bg-primary text-white' : 'text-secondary hover-bg-light'}`}
                  style={{ fontSize: '0.9rem', fontWeight: 500 }}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Content Panel */}
        <div className="col-lg-9">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="d-flex flex-column gap-4">
              {/* Welcome banner */}
              <div className="glass-card p-4 bg-gradient-header border-0 text-white">
                <h4 className="fw-bold mb-1">Welcome to College life, {user?.name}!</h4>
                <p className="small mb-0 opacity-75">
                  Congratulations on starting your freshman year. Your academic portal is fully configured. Use the left menu to explore your digital ID, personalized recommendations, and notices.
                </p>
              </div>

              {/* Status Row */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="glass-card p-4 bg-white border-0 h-100">
                    <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2"><FaCalendarCheck className="text-primary" /> Registered Events</h5>
                    {registeredParty ? (
                      <div className="p-3 bg-light rounded-3 border small">
                        <span className="badge bg-success mb-2">Fiesta Confirmed</span>
                        <h6 className="fw-bold text-dark mb-1">Freshers Fiesta 2026</h6>
                        <span className="text-muted d-block">Location: Main Auditorium</span>
                        <span className="text-muted d-block">Time: August 15, 6:00 PM</span>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-light rounded-3 border">
                        <p className="text-secondary small mb-3">You have not registered for the Freshers party yet.</p>
                        <a href="/party" className="btn btn-sm btn-gradient px-4 rounded-pill">Register for Fiesta</a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="glass-card p-4 bg-white border-0 h-100">
                    <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2"><FaBullhorn className="text-warning" /> Recent Notices</h5>
                    <div className="d-flex flex-column gap-2">
                      {announcements.slice(0, 3).map((notice, i) => (
                        <div key={i} className="pb-2 border-bottom last-border-none small">
                          <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>{new Date(notice.date_posted).toLocaleDateString()}</span>
                          <strong className="text-dark d-block">{notice.title}</strong>
                          <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{notice.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personalized AI Suggestions */}
              <div className="glass-card p-4 bg-white border-0">
                <h5 className="fw-bold text-dark mb-3">Smart AI Recommendations</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-4 border h-100 small">
                      <strong className="text-primary d-block mb-1">Recommended Clubs</strong>
                      <span className="text-secondary">Based on your CSE department preferences, we suggest:</span>
                      <ul className="mt-2 mb-0 ps-3 text-secondary">
                        <li>Google Developer Groups (GDG) On Campus</li>
                        <li>Robotics & IoT Club</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-4 border h-100 small">
                      <strong className="text-success d-block mb-1">Recommended Workshops</strong>
                      <span className="text-secondary">Improve your skills with upcoming first-year workshops:</span>
                      <ul className="mt-2 mb-0 ps-3 text-secondary">
                        <li>Introduction to Git & GitHub Setup</li>
                        <li>Building web apps using React</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL ID CARD */}
          {activeTab === 'idcard' && (
            <div className="glass-card p-4 bg-white border-0">
              <h4 className="fw-bold text-dark mb-1">Freshman Digital ID Card</h4>
              <p className="text-secondary small mb-4">Your digital badge can be printed, or scanned directly to confirm attendance at college mixers and technical coding contests.</p>
              <DigitalIDCard />
            </div>
          )}

          {/* TAB 3: STUDY PLANNER */}
          {activeTab === 'planner' && (
            <div className="glass-card p-4 bg-white border-0">
              <h4 className="fw-bold text-dark mb-2">Smart Study Planner</h4>
              <p className="text-secondary small mb-4">A simple, personalized study plan to manage lectures and GDG club projects efficiently.</p>
              <div className="d-flex flex-column gap-3">
                {studyPlan.map((plan, i) => (
                  <div key={i} className="p-3 bg-light rounded-3 border">
                    <h6 className="fw-bold text-dark mb-1">{plan.day} Plan</h6>
                    <span className="text-secondary small">{plan.topics}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="glass-card p-4 bg-white border-0">
              <h4 className="fw-bold text-dark mb-3">Update Profile Settings</h4>
              
              {profileMsg && <div className={`alert alert-${profileMsg.type} rounded-3 small`}>{profileMsg.text}</div>}

              <form onSubmit={handleProfileSubmit}>
                <div className="d-flex flex-column align-items-center mb-4">
                  <div className="position-relative">
                    <img
                      src={avatarPreview || (user?.avatar?.startsWith('http') ? user?.avatar : `${uploadBaseUrl}/avatars/${user?.avatar || 'default_avatar.png'}`)}
                      alt="avatar"
                      className="rounded-circle border"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80' }}
                    />
                    <label 
                      htmlFor="avatarInput" 
                      className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle border border-2 border-white d-flex align-items-center justify-content-center cursor-pointer"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <FaCamera size={14} />
                    </label>
                    <input type="file" id="avatarInput" className="d-none" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                  <span className="text-muted small mt-2">Click icon to upload a profile picture</span>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">Full Name</label>
                    <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">Registered Email (Read-only)</label>
                    <input type="email" className="form-control bg-light border-0 p-3 small text-secondary" value={user?.email} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">Academic Department</label>
                    <select className="form-select bg-light border-0 p-3 small text-dark" value={profileDept} onChange={(e) => setProfileDept(e.target.value)}>
                      <option value="">Select Branch</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="CSE">Computer Science and Engineering (CSE)</option>
                      <option value="EEE">Electrical and Electronics Engineering (EEE)</option>
                      <option value="ECE">Electronics and Communication Engineering (ECE)</option>
                      <option value="AIDS">Artificial Intelligence & Data Science (AIDS)</option>
                      <option value="ICE">Instrumentation and Control Engineering (ICE)</option>
                      <option value="CIVIL">Civil Engineering (CIVIL)</option>
                      <option value="MBA">Master of Business Administration (MBA)</option>
                      <option value="ENGLISH">English (ENGLISH)</option>
                      <option value="MECH">Mechanical Engineering (MECH)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">University Roll Number</label>
                    <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={profileRoll} onChange={(e) => setProfileRoll(e.target.value)} placeholder="e.g. CSE2026001" />
                  </div>
                </div>

                <button type="submit" className="btn btn-gradient py-3 px-5 rounded-pill mt-4 shadow-none">Save Settings</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
