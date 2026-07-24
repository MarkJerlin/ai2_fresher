import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaBookOpen, FaServer, FaBus, FaUtensils, FaHome, FaRunning, FaUsers, FaCalendarAlt, FaAward, FaHeartbeat } from 'react-icons/fa';

const FacilitiesPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('ALL');

  const facilityCategories = [
    { code: 'ALL', label: 'All Facilities', icon: null },
    { code: 'NSS', label: 'NSS Social Events 🤝', icon: <FaUsers /> },
    { code: 'LIBRARY', label: 'Central Library 📚', icon: <FaBookOpen /> },
    { code: 'CSG', label: 'Data & Wi-Fi Cell 💻', icon: <FaServer /> },
    { code: 'TRANSPORT', label: 'Transport Fleet 🚌', icon: <FaBus /> },
    { code: 'LIVING', label: 'Canteen & Hostel 🏡', icon: <FaHome /> },
    { code: 'SPORTS', label: 'Sports Arena 🏆', icon: <FaRunning /> }
  ];

  const nssEvents = [
    {
      year: '2023 - 2024',
      events: [
        { date: '25.11.2023', name: 'A visit to an Old Age Home', desc: 'NSS Volunteers visited the local senior home, distributing toiletries, conducting interactive recreation games, and sharing meals with the residents.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=387' },
        { date: '07.09.2023', name: 'A Special Camp', desc: 'Organized rural development camps, clean campus awareness initiatives, and medical checkup camps for rural families.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=382' }
      ]
    },
    {
      year: '2021 - 2022',
      events: [
        { date: '04.04.2021', name: 'COVID Vaccination Drive & Seminar', desc: 'Special session by Dr. G. Anitha (KAPV Govt. Medical College, Trichy) advocating vaccination safety and organizing free health camps.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=276' },
        { date: '12.06.2021', name: 'Webinar on First Aid & Safety Protocols', desc: 'Led by Mr. R. Suresh from the Disaster Management Team of Rajapalayam, demonstrating home healthcare, CPR, and accident rescue procedures.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=277' },
        { date: '21.06.2021', name: 'International Yoga Day Celebration', desc: 'Special session conducted by Dr. R. Sridhar & Dr. T. Santhanakrishnan from the Vivekananda Yoga Centre, teaching stress management postures.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=280' },
        { date: '29.08.2021', name: 'Visit to Rehabilitation Center', desc: 'Volunteers donated books, structural utility items, and interacted with children at the care home.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=278' },
        { date: '26.09.2021', name: 'A Visit to an Old Age Home', desc: 'Distributed food packs and hosted light music events for senior residents to spread joy.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=275' },
        { date: '02.11.2021', name: 'Seven Day Rural Development Special Camp', desc: 'Camp conducted at Gandhi Nagar, Manikandam focusing on rural sanitation, tree plantation, and basic hygiene education.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=286' }
      ]
    },
    {
      year: '2020 - 2021',
      events: [
        { date: '24.06.2021', name: 'NSS Award for the Year 2019-2020', desc: 'The Saranathan College NSS Unit was recognized by Anna University for excellent community outreach and social work programs.', link: 'https://saranathan.ac.in/home.php?tgt=eve_writeup&eid=274' }
      ]
    }
  ];

  const facilitiesList = [
    {
      id: 'library',
      category: 'LIBRARY',
      title: 'Central Library & E-Resource Wing',
      subtitle: 'Knowledge Hub',
      desc: 'Saranathan College houses a spacious, fully automated central library subscribing to global journals and e-resources like IEEE, DELNET, and NDL.',
      details: ['55,000+ print volumes of books', 'Access to international journals & digital book banks', 'Dedicated High-Speed Digital Library cabin'],
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80',
      icon: <FaBookOpen className="text-primary" />
    },
    {
      id: 'csg',
      category: 'CSG',
      title: 'Computer Support Group (CSG)',
      subtitle: 'Central Data Hub',
      desc: 'CSG manages the institutional server ecosystem, campus wide local network backbone, gigabit fiber connection, and secure Wi-Fi access spots.',
      details: ['High-speed 1 Gbps internet lease lines', 'Secure servers for academic databases', 'Campus wide high-bandwidth Wi-Fi hotspots'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
      icon: <FaServer className="text-info" />
    },
    {
      id: 'transport',
      category: 'TRANSPORT',
      title: 'Institutional Transport Services',
      subtitle: 'Campus Commute',
      desc: 'Features a fleet of 30+ GPS-tracked, modern institutional buses operating across major areas in Trichy, Srirangam, and Tanjore districts.',
      details: ['Fully licensed experienced bus drivers', 'Covers major residential hubs and railway corridors', 'Live GPS updates available on the mobile tracker portal'],
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      icon: <FaBus className="text-success" />
    },
    {
      id: 'canteen',
      category: 'LIVING',
      title: 'Campus Dining Canteen',
      subtitle: 'Subsistence & Meals',
      desc: 'Clean, spacious, and hygienic campus dining spaces offering healthy vegetarian breakfasts, lunch combos, and evening snacks at subsidized student rates.',
      details: ['Strict quality control inspection protocols', 'Separate dining areas for students and staff', 'Fresh food prepared daily in a modern modular kitchen'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      icon: <FaUtensils className="text-danger" />
    },
    {
      id: 'hostel',
      category: 'LIVING',
      title: 'Residential Hostels',
      subtitle: 'Secure Housing',
      desc: 'Separate, well-furnished hostels for boys and girls with recreation lounges, reading chambers, 24/7 power backup, and dedicated campus wardens.',
      details: ['Clean drinking mineral water facilities', 'Indoor recreation centers with gym equipment', 'Strict security checking rounds and visitor logs'],
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
      icon: <FaHome className="text-warning" />
    },
    {
      id: 'sports',
      category: 'SPORTS',
      title: 'Physical Education & Athletics Wing',
      subtitle: 'Sports Complex',
      desc: 'Saranathan believes in holistic fitness, providing large outdoor athletic grounds, indoor courts, and weightlifting modules.',
      details: ['Standard turf cricket pitch & football field', 'Indoor badminton, table tennis, and chess lobbies', 'Annual sports meets and professional coaching schemes'],
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80',
      icon: <FaRunning className="text-purple" />
    }
  ];

  const getLocalizedFacility = (fac) => {
    if (!fac) return null;
    
    const idUpper = fac.id.toUpperCase();
    const titleKey = `fac_title_${idUpper}`;
    const subtitleKey = `fac_sub_${idUpper}`;
    const descKey = `fac_desc_${idUpper}`;

    const titleVal = t(titleKey);
    const subtitleVal = t(subtitleKey);
    const descVal = t(descKey);

    return {
      ...fac,
      title: titleVal !== titleKey ? titleVal : fac.title,
      subtitle: subtitleVal !== subtitleKey ? subtitleVal : fac.subtitle,
      desc: descVal !== descKey ? descVal : fac.desc,
      details: fac.details.map((det, dIdx) => {
        const key = `fac_det_${idUpper}_${dIdx}`;
        const val = t(key);
        return val !== key ? val : det;
      })
    };
  };

  const getLocalizedNssEvent = (evt, yr) => {
    // Generate dynamic keys for NSS event name and description
    const cleanNameKey = `fac_nss_evt_${yr.replace(/[^a-zA-Z0-9]/g, '_')}_${evt.date.replace(/\./g, '_')}_name`;
    const cleanDescKey = `fac_nss_evt_${yr.replace(/[^a-zA-Z0-9]/g, '_')}_${evt.date.replace(/\./g, '_')}_desc`;
    
    const nameVal = t(cleanNameKey);
    const descVal = t(cleanDescKey);

    return {
      ...evt,
      name: nameVal !== cleanNameKey ? nameVal : evt.name,
      desc: descVal !== cleanDescKey ? descVal : evt.desc
    };
  };

  const filteredFacilities = activeTab === 'ALL' 
    ? facilitiesList 
    : facilitiesList.filter(f => f.category === activeTab);

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <span className="badge-gdg mb-2">{t('fac_badge') || 'COMMON UTILITIES'}</span>
        <h2 className="fw-bold text-dark">{t('fac_header_title') || 'Campus Facilities & Social Activities'}</h2>
        <p className="text-secondary">{t('fac_header_sub') || 'Discover libraries, computational infrastructure, transport systems, and active social clubs.'}</p>
      </div>

      {/* Facilities Tabs */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {facilityCategories.map((tab) => (
          <button
            key={tab.code}
            className={`btn rounded-pill px-3 py-2 border fw-semibold small d-flex align-items-center gap-2 ${
              activeTab === tab.code 
                ? 'btn-primary text-white border-primary shadow-sm' 
                : 'btn-light text-secondary bg-white'
            }`}
            style={{ transition: 'all 0.2s ease-in-out' }}
            onClick={() => setActiveTab(tab.code)}
          >
            {tab.icon}
            <span>{t(`fac_tab_${tab.code}`) || tab.label}</span>
          </button>
        ))}
      </div>

      <div className="row g-4">
        {/* NSS Events section - renders when tab is ALL or NSS */}
        {(activeTab === 'ALL' || activeTab === 'NSS') && (
          <div className="col-12">
            <div className="glass-card p-4 bg-white border-0 shadow-sm mb-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-circle bg-primary-subtle text-primary">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h4 className="fw-bold text-dark mb-0">{t('fac_nss_header') || '🤝 National Service Scheme (NSS) Events'}</h4>
                  <span className="text-secondary small">{t('fac_nss_sub') || 'Community outreach and social welfare campaigns'}</span>
                </div>
              </div>

              <div className="timeline-wrapper">
                {nssEvents.map((timeline, idx) => (
                  <div key={idx} className="mb-4">
                    <h5 className="fw-bold text-primary border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                      <FaCalendarAlt size={16} />
                      {t('fac_nss_academic_year') || 'Academic Year'} {timeline.year}
                    </h5>
                    
                    <div className="row g-3">
                      {timeline.events.map((eventRaw, eIdx) => {
                        const event = getLocalizedNssEvent(eventRaw, timeline.year);
                        return (
                          <div key={eIdx} className="col-md-6 col-lg-4">
                            <div className="card h-100 border rounded-4 p-3 bg-light shadow-sm hover-lift" style={{ transition: 'transform 0.2s' }}>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="badge bg-primary-subtle text-primary fw-bold" style={{ fontSize: '0.72rem' }}>{event.date}</span>
                                <FaAward className="text-warning" />
                              </div>
                              <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.9rem' }}>{event.name}</h6>
                              <p className="text-secondary mb-3 small" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>{event.desc}</p>
                              <a 
                                href={event.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-outline-primary btn-sm rounded-pill mt-auto fw-semibold w-100"
                                style={{ fontSize: '0.75rem' }}
                              >
                                {t('fac_nss_view_btn') || '🌐 View Official Writeup'}
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regular Facilities Card listing */}
        {filteredFacilities.map((facRaw, idx) => {
          const fac = getLocalizedFacility(facRaw);
          return (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden bg-white hover-lift">
                <div className="position-relative" style={{ height: '170px' }}>
                  <img 
                    src={fac.image} 
                    alt={fac.title} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80' }}
                  />
                  <div className="position-absolute top-0 end-0 m-3 bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    {fac.icon}
                  </div>
                </div>

                <div className="card-body p-4">
                  <span className="text-muted d-block small text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{fac.subtitle}</span>
                  <h5 className="fw-bold text-dark mb-3">{fac.title}</h5>
                  <p className="text-secondary small mb-4" style={{ lineHeight: '1.6' }}>{fac.desc}</p>
                  
                  <h6 className="fw-bold text-dark small mb-2">{t('fac_highlights_label') || '💡 Highlights:'}</h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                    {fac.details.map((det, dIdx) => (
                      <li key={dIdx} className="d-flex align-items-start gap-2 small text-secondary">
                        <span className="text-primary mt-1">✔</span>
                        <span>{det}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacilitiesPage;
