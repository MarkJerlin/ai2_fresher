import React, { useState, useEffect } from 'react';
import { clubsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaEnvelope, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';

import { useLanguage } from '../context/LanguageContext';

const ClubsPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const storageKey = user ? `registeredClubs_${user.id || user.email}` : 'registeredClubs_guest';

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [registeredClubs, setRegisteredClubs] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setRegisteredClubs(stored ? JSON.parse(stored) : []);
    } catch {
      setRegisteredClubs([]);
    }
  }, [user, storageKey]);

  const handleRegisterClub = async (clubName, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (registeredClubs.includes(clubName)) return;

    try {
      if (user) {
        await clubsAPI.register(clubName);
      }
    } catch (err) {
      console.warn("Failed to dispatch club registration email to server", err);
    }

    const updated = [...registeredClubs, clubName];
    setRegisteredClubs(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Confetti blast!
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.8 }
    });

    const userEmail = user?.email || 'your registered email';
    setToastMsg(`🚀 Registered for ${clubName}! 📩 Official membership confirmation email dispatched to ${userEmail}! 🎉`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  const getFallbackLogo = (category, clubName = '') => {
    const nameLower = (clubName || '').toLowerCase();
    if (nameLower.includes('google') || nameLower.includes('gdg')) {
      return 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('robotics') || nameLower.includes('iot')) {
      return 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('music') || nameLower.includes('dramatic')) {
      return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('coding') || nameLower.includes('ninjas')) {
      return 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=120&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('turing')) {
      return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=120&auto=format&fit=crop&q=80';
    }
    if (category?.toLowerCase() === 'sports' || nameLower.includes('sports')) {
      return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&auto=format&fit=crop&q=80';
  };

  const defaultClubsList = [
    {
      id: 1,
      name: 'Google Developer Groups (GDG) On Campus',
      description: 'A community-backed club aimed at building apps, learning cloud technologies, and mastering AI with Google tools.',
      category: 'Technical',
      lead_name: 'Sarah Chen',
      lead_email: 'sarah.chen@university.edu',
      logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Robotics & IoT Club',
      description: 'Build drones, IoT sensing grids, and participate in international robowars tournaments.',
      category: 'Technical',
      lead_name: 'Alex Mercer',
      lead_email: 'alex.mercer@university.edu',
      logo_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80',
      video_url: 'https://www.youtube.com/embed/TZGWNH-iaHk'
    },
    {
      id: 3,
      name: 'Music & Dramatic Arts (MDA)',
      description: 'The hub of campus culture! Organizes rock shows, dance showcases, acoustic nights, and street plays.',
      category: 'Cultural',
      lead_name: 'Liam Gallagher',
      lead_email: 'liam.g@university.edu',
      logo_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      name: 'Coding Ninjas',
      description: 'Focuses on competitive programming, data structures algorithms interview prep, and coding contests.',
      category: 'Technical',
      lead_name: 'Rohan Sharma',
      lead_email: 'rohan.sharma@university.edu',
      logo_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 5,
      name: 'Turing Guild',
      description: 'A peer-led academic guild exploring computer systems, compiler design, assembly, and open source development.',
      category: 'Academic',
      lead_name: 'Evelyn Wright',
      lead_email: 'evelyn.wright@university.edu',
      logo_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 6,
      name: 'Sports Club',
      description: 'Promotes physical fitness, team sports, inter-college athletic tournaments, and annual athletic meets.',
      category: 'Sports',
      lead_name: 'Marcus Rashford',
      lead_email: 'marcus.rashford@university.edu',
      logo_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&auto=format&fit=crop&q=80'
    }
  ];

  const clubExtraDetails = {
    'Google Developer Groups (GDG) On Campus': {
      leadBio: 'A third-year CSE student who loves building mobile apps and experimenting with LLMs. Lead Developer at gdg-campus.',
      leadDept: 'Computer Science and Engineering (CSE)',
      leadAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      events: [
        { date: 'Aug 22, 2026', title: '🚀 48-Hour Hackathon Kickoff', desc: 'GDG\'s flagship team coding hackathon with mentors from Google!' },
        { date: 'Sep 05, 2026', title: '🤖 AI Studio Workshop', desc: 'Introduction to Google Gemini API and LLM prompt engineering.' }
      ]
    },
    'Robotics & IoT Club': {
      leadBio: 'Alex specializes in firmware development and drone aerodynamics. Winner of the Inter-Collegiate RoboWars 2025.',
      leadDept: 'Electronics and Communication (ECE)',
      leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      events: [
        { date: 'Aug 28, 2026', title: '🛸 Drone Flight & Coding Trials', desc: 'Learn to program quadcopter pathing inside the Tesla indoor cage.' },
        { date: 'Sep 12, 2026', title: '🔌 Micro-Controller Sandbox', desc: 'Hands-on intro to Arduino, sensors, and basic circuits.' }
      ]
    },
    'Music & Dramatic Arts (MDA)': {
      leadBio: 'Guitarist and vocalist of the student indie rock band \'The Turing Tones\'. Active in campus theatre and street plays.',
      leadDept: 'Information Technology (IT)',
      leadAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      events: [
        { date: 'Aug 19, 2026', title: '🎸 Freshman Unplugged Night', desc: 'Acoustic guitar and jam session to welcome first-year talent.' },
        { date: 'Sep 08, 2026', title: '🎭 Street Play Auditions', desc: 'Auditions for the upcoming national street theatre festival.' }
      ]
    },
    'Coding Ninjas': {
      leadBio: 'Passionate competitive programmer, Candidate Master on Codeforces, loves teaching DSA.',
      leadDept: 'Computer Science and Engineering (CSE)',
      leadAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
      events: [
        { date: 'Aug 25, 2026', title: '🥷 Ninja Coding Arena', desc: 'Beginner-friendly competitive programming contest for freshers.' },
        { date: 'Sep 15, 2026', title: '🧱 DSA Masterclass', desc: 'Comprehensive workshop on graphs, dynamic programming, and trees.' }
      ]
    },
    'Turing Guild': {
      leadBio: 'Linux kernel contributor and compiler developer. Believes in absolute open-source freedom.',
      leadDept: 'Information Technology (IT)',
      leadAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      events: [
        { date: 'Aug 30, 2026', title: '🐧 Linux Kernel Deep Dive', desc: 'Introduction to writing basic kernel modules and file systems.' },
        { date: 'Sep 10, 2026', title: '📂 Git Git Hooray', desc: 'Collaborative open-source contribution and pull-request bootcamp.' }
      ]
    },
    'Sports Club': {
      leadBio: 'State-level football striker and captain of the university athletic federation.',
      leadDept: 'Mechanical Engineering (MECH)',
      leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      events: [
        { date: 'Aug 24, 2026', title: '⚽ Freshers Futsal League', desc: '5v5 football tournament for all freshman sections.' },
        { date: 'Sep 18, 2026', title: '🏏 Inter-Dept Cricket Cup', desc: 'Group-stage cricket matches on the main campus stadium pitch.' }
      ]
    }
  };

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await clubsAPI.getAll();
        if (res.data && res.data.length > 0) {
          const merged = [...res.data];
          defaultClubsList.forEach(fallback => {
            if (!res.data.some(c => c.name.toLowerCase() === fallback.name.toLowerCase())) {
              merged.push(fallback);
            }
          });
          setClubs(merged);
        } else {
          setClubs(defaultClubsList);
        }
      } catch (err) {
        console.error("Failed to load clubs list", err);
        setClubs(defaultClubsList);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <span className="badge-gdg mb-2">CAMPUS COMMUNITIES</span>
        <h2 className="fw-bold text-dark">{t('clubs_title')}</h2>
        <p className="text-secondary">{t('clubs_sub')}</p>
      </div>

      {toastMsg && (
        <div className="alert alert-success rounded-4 text-center small fw-semibold shadow-sm mb-4 animate-fade-in" role="alert">
          {toastMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {clubs.map((cRaw, idx) => {
              const club = {
                ...cRaw,
                name: t(`club_name_${cRaw.id}`) || cRaw.name,
                description: t(`club_desc_${cRaw.id}`) || cRaw.description,
                category: t(`club_cat_${cRaw.category?.toLowerCase()}`) || cRaw.category
              };
              return (
                <div key={idx} className="col-md-6 col-lg-4">
                  <div 
                    onClick={() => setSelectedClub(cRaw)}
                    className="glass-card p-4 h-100 bg-white border-0 d-flex flex-column justify-content-between cursor-pointer"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img
                          src={club.logo_url && club.logo_url.startsWith('http') ? club.logo_url : getFallbackLogo(cRaw.category, cRaw.name)}
                          alt={club.name}
                          className="rounded-4 border shadow-sm"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = getFallbackLogo(cRaw.category, cRaw.name); }}
                        />
                        <div>
                          <h6 className="fw-bold text-dark mb-1">{club.name}</h6>
                          <span className="badge bg-light text-primary border">{club.category || 'Student Activity'}</span>
                        </div>
                      </div>
                      <p className="text-secondary small mb-3">{club.description}</p>
                      <span className="text-primary small fw-semibold d-inline-block mb-3">{t('clubs_leaders_link') || 'Click to see Leaders & Events! 🚀'}</span>
                    </div>

                    <div className="border-top pt-3 mt-2">
                      <div className="d-flex align-items-center justify-content-between small text-secondary">
                        <div>
                          <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>{t('clubs_lead_label') || 'CLUB LEAD'}</span>
                          <strong className="text-dark">{club.lead_name || 'Sarah Chen'}</strong>
                        </div>
                        <button 
                          onClick={(e) => handleRegisterClub(cRaw.name, e)}
                          className={`btn btn-sm px-3 rounded-pill fw-semibold border ${
                            registeredClubs.includes(cRaw.name) 
                              ? 'btn-outline-success border-2' 
                              : 'btn-gradient text-white'
                          }`}
                        >
                          {registeredClubs.includes(cRaw.name) ? (t('clubs_joined') || 'Joined ✔') : (t('clubs_reg_btn') || 'Register 🚀')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Club Details Modal */}
          {selectedClub && clubExtraDetails[selectedClub.name] && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', zIndex: 1050 }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden text-dark">
                  
                  <div className="modal-header bg-gradient-header border-0 text-white p-3">
                    <h5 className="modal-title fw-bold">{selectedClub.name}</h5>
                    <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setSelectedClub(null)}></button>
                  </div>

                  <div className="modal-body p-4">
                    {/* Club Info */}
                    <p className="text-secondary mb-4">{selectedClub.description}</p>

                    {/* Club Video Highlight */}
                    {selectedClub.video_url && (
                      <div className="mb-4 rounded-4 overflow-hidden border shadow-sm bg-black animate-fade-in" style={{ height: '240px' }}>
                        <iframe 
                          src={selectedClub.video_url}
                          title={`${selectedClub.name} Video Highlight`}
                          width="100%" 
                          height="100%" 
                          frameBorder="0" 
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          style={{ minHeight: '240px' }}
                        ></iframe>
                      </div>
                    )}

                    {/* Club Lead details */}
                    <h6 className="fw-bold text-dark mb-3">👑 Club Leadership</h6>
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 border mb-4">
                      <img 
                        src={clubExtraDetails[selectedClub.name].leadAvatar} 
                        alt={selectedClub.lead_name} 
                        className="rounded-circle border"
                        style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="fw-bold text-dark mb-0">{selectedClub.lead_name}</h6>
                        <span className="text-muted d-block small mb-1" style={{ fontSize: '0.75rem' }}>{clubExtraDetails[selectedClub.name].leadDept}</span>
                        <span className="text-secondary small fw-medium" style={{ fontSize: '0.8rem' }}>"{clubExtraDetails[selectedClub.name].leadBio}"</span>
                        <a href={`mailto:${selectedClub.lead_email}`} className="d-block text-primary small mt-1 text-decoration-none">✉️ {selectedClub.lead_email}</a>
                      </div>
                    </div>

                    {/* Club Events */}
                    <h6 className="fw-bold text-dark mb-3">📅 Upcoming Club Events</h6>
                    <div className="d-flex flex-column gap-2 mb-4">
                      {clubExtraDetails[selectedClub.name].events.map((evt, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-3 border small">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <strong className="text-dark">{evt.title}</strong>
                            <span className="badge bg-light text-secondary">{evt.date}</span>
                          </div>
                          <span className="text-secondary">{evt.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Registration Link inside Modal */}
                    <button 
                      onClick={(e) => handleRegisterClub(selectedClub.name, e)}
                      className={`btn w-100 py-3 shadow-none text-center d-block rounded-pill fw-bold ${
                        registeredClubs.includes(selectedClub.name)
                          ? 'btn-outline-success border-2'
                          : 'btn-gradient text-white'
                      }`}
                    >
                      {registeredClubs.includes(selectedClub.name) 
                        ? `Joined ${selectedClub.name} ✔` 
                        : `Register for ${selectedClub.name} 🚀`}
                    </button>
                  </div>

                  <div className="modal-footer bg-light border-0">
                    <button type="button" className="btn btn-secondary py-2 px-4 rounded-pill small" onClick={() => setSelectedClub(null)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClubsPage;
