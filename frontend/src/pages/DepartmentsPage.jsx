import React, { useState, useEffect } from 'react';
import { departmentsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { FaBuilding, FaUserTie, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const defaultDepartments = [
  {
    id: 1,
    code: 'AI&DS',
    name: 'Artificial Intelligence & Data Science',
    head_of_department: 'Dr. S. Ravimaran',
    block_name: 'Sir C.V. Raman Block (1st Floor)',
    contact_phone: '+91 431 290 8400'
  },
  {
    id: 2,
    code: 'CSE',
    name: 'Computer Science & Engineering',
    head_of_department: 'Dr. V. Punitha',
    block_name: 'Main Block (Ground Floor & 1st Floor)',
    contact_phone: '+91 431 290 8401'
  },
  {
    id: 3,
    code: 'IT',
    name: 'Information Technology',
    head_of_department: 'Dr. R. Thillaikarasi',
    block_name: 'Main Block (2nd Floor)',
    contact_phone: '+91 431 290 8402'
  },
  {
    id: 4,
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    head_of_department: 'Dr. M. Santhi',
    block_name: 'Visvesvaraya Block (1st Floor)',
    contact_phone: '+91 431 290 8403'
  },
  {
    id: 5,
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    head_of_department: 'Dr. C. Krishnakumar',
    block_name: 'J.C. Bose Block (Ground Floor)',
    contact_phone: '+91 431 290 8404'
  },
  {
    id: 6,
    code: 'MECH',
    name: 'Mechanical Engineering',
    head_of_department: 'Dr. R. Rekha',
    block_name: 'Ramanujan Workshop Block',
    contact_phone: '+91 431 290 8405'
  },
  {
    id: 7,
    code: 'CIVIL',
    name: 'Civil Engineering',
    head_of_department: 'Dr. A. Belin Jude',
    block_name: 'Decennial Block (Ground Floor)',
    contact_phone: '+91 431 290 8406'
  },
  {
    id: 8,
    code: 'ICE',
    name: 'Instrumentation & Control Engineering',
    head_of_department: 'Dr. K. Gaayathry',
    block_name: 'JC Bose Block (2nd Floor)',
    contact_phone: '+91 431 290 8407'
  },
  {
    id: 9,
    code: 'MBA',
    name: 'Department of Management Studies',
    head_of_department: 'Dr. K. Karthikeyan',
    block_name: 'Main Block (3rd Floor)',
    contact_phone: '+91 431 290 8408'
  },
  {
    id: 10,
    code: 'ENG',
    name: 'Department of English',
    head_of_department: 'Dr. M. Bhuvaneswari',
    block_name: 'Science & Humanities Block (1st Floor)',
    contact_phone: '+91 431 290 8409'
  }
];

const DepartmentsPage = () => {
  const { t } = useLanguage();
  const [departments, setDepartments] = useState(defaultDepartments);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const deptDetails = {
    'AI&DS': {
      blockImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      coolFact: '🤖 Sir C.V. Raman Block houses the state-of-the-art AI & Big Data Analytics Laboratory with high-speed GPU workstations for neural network training and computer vision research.',
      highlight: '🧠 Deep Learning Hub, Computer Vision Lab, Generative AI Bootcamp'
    },
    CSE: {
      blockImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      coolFact: '💻 Main Block houses the high-performance AI Studio equipped with GPU clusters. We run VR game development sessions and host university esport tournaments!',
      highlight: '🚀 Gaming League, VR Hackathons, Open-Source Dev Clubs'
    },
    IT: {
      blockImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      coolFact: '🛡️ Includes a state-of-the-art Cyber Defense War Room where students practice simulated ethical hacking and network security defense matches.',
      highlight: '⚡ Cyber Capture-The-Flag (CTF) contests, Cloud Computing bootcamps'
    },
    ECE: {
      blockImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      coolFact: '🔌 Visvesvaraya Block has a micro-drone assembly zone. Electronics students build, code, and fly their own custom quadcopters at our indoor flight cage.',
      highlight: '🚁 Drone Racing Cups, IoT Smart-Home Hackfests'
    },
    EEE: {
      blockImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      coolFact: '⚡ J.C. Bose Block features a Smart Grid & Renewable Power Systems Lab equipped with solar PV array test beds and power electronic converters.',
      highlight: '💡 Solar Energy Club, Electric Vehicle (EV) Power Design'
    },
    MECH: {
      blockImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      coolFact: '🏎️ The Ramanujan Workshop Block features a custom Student F1 Garage. Mechanical students build a scale formula race car each year for national competitions!',
      highlight: '🛠️ 3D Printing Sandbox, F1 Racing Car Design teams'
    },
    CIVIL: {
      blockImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      coolFact: '🏗️ Decennial Block houses the Advanced Structural Testing & Geotechnical Mechanics Lab with computer-aided CAD & GIS spatial mapping suites.',
      highlight: '📐 Green Building Design, Earthquake Engineering Simulator'
    },
    ICE: {
      blockImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      coolFact: '🎛️ Features an Industrial Process Control & Automation Suite equipped with PLC, SCADA, and Biomedical Sensor Interfaces.',
      highlight: '🤖 Industrial Automation, PLC Systems, Smart Bio-Sensors'
    },
    MBA: {
      blockImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      coolFact: '📈 The Management Studies department features a Business Simulation Lab, Stock Market ticker feeds, and runs regular corporate advisory meetups.',
      highlight: '💼 Stock Trading Simulations, Business Idea Pitching Cups'
    },
    ENG: {
      blockImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
      labImage: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80',
      classImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      coolFact: '✍️ The English department runs a modern Digital Language & Communication Lab for listening, speaking, and group debate practices.',
      highlight: '🗣️ Toastmasters Club, Debating Union, Professional ELT'
    }
  };

  const deptAbouts = {
    'AI&DS': 'The B.Tech program in Artificial Intelligence and Data Science at Saranathan College of Engineering aims to equip students with the core foundations of AI, Machine Learning, Data Analytics, and Big Data processing. The department features specialized labs and trains students to solve complex industry problems using cognitive computing paradigms.',
    CIVIL: 'The B.E. in Civil Engineering program is NBA accredited and delivers rigorous training in structural analysis, geotechnical design, fluid mechanics, and environmental sciences. With state-of-the-art surveying, testing, and computational labs, the department guides freshers to build future-ready structural foundations.',
    CSE: 'The B.E. in Computer Science and Engineering department is NBA accredited and provides a stellar academic ecosystem covering computing theories, networks, operating systems, and software engineering. Backed by industry collaborations, it fosters open-source contributions and global coding challenge prep.',
    ECE: 'The B.E. in Electronics and Communication Engineering program is NBA accredited, focusing on VLSI chip design, wireless networking, signal processing, and advanced communication systems. Students gain extensive practice in state-of-the-art semiconductor and digital circuits lab modules.',
    EEE: 'The B.E. in Electrical and Electronics Engineering department is NBA accredited, offering robust foundations in electric machinery, control systems, renewable energy systems, and modern electric vehicle power trains.',
    ICE: 'The B.E. in Instrumentation and Control Engineering program is NBA accredited, featuring exclusive collaborations with National Instruments (LabVIEW Academy) and Yokogawa. Freshers are trained in automation, sensors, and process control engineering.',
    IT: 'The B.Tech in Information Technology department is NBA accredited, emphasizing web applications, database management, software development, cloud systems, and cybersecurity protocols to prepare graduates for high-tech careers.',
    MBA: 'The two-year PG program in Management Studies (MBA) is approved by AICTE, providing professional specializations in Financial Management, Marketing Analytics, Human Resource Strategy, and Operations Management.',
    ENG: 'The Department of English (Science & Humanities) trains engineering freshers in technical writing, soft skills, communicative English, and presentation skills to meet international placement standards.'
  };

  const deptFacultyAdvisors = {
    'AI&DS': [
      { name: 'Dr. S. Ravimaran', designation: 'Professor & Head', email: 'ravimaran-aids@saranathan.ac.in', specialization: 'Artificial Intelligence, Deep Learning', avatar: 'https://saranathan.ac.in/images/ravimaran-aid.jpg' }
    ],
    CSE: [
      { name: 'Dr. V. Punitha', designation: 'Professor & Head', email: 'punitha-cse@saranathan.ac.in', specialization: 'Cloud Computing, Image Processing', avatar: 'https://saranathan.ac.in/images/punitha-it.jpg' },
      { name: 'Dr. P. D. Sheba Kezia Malarchelvi', designation: 'Professor & Head (AI&ML)', email: 'shebakezia-cse@saranathan.ac.in', specialization: 'Machine Learning, Soft Computing', avatar: 'https://saranathan.ac.in/images/pdsheba-cse.jpg' }
    ],
    IT: [
      { name: 'Dr. R. Thillaikarasi', designation: 'Professor & Head', email: 'thillai-cse@saranathan.ac.in', specialization: 'Grid Computing, Network Security', avatar: 'https://saranathan.ac.in/images/thillai-cse.jpg' }
    ],
    ECE: [
      { name: 'Dr. M. Santhi', designation: 'Professor & Head', email: 'santhi-ece@saranathan.ac.in', specialization: 'VLSI Design, Embedded Systems', avatar: 'https://saranathan.ac.in/images/santhim.jpg' }
    ],
    EEE: [
      { name: 'Dr. C. Krishnakumar', designation: 'Professor & Head', email: 'krishnakumar-eee@saranathan.ac.in', specialization: 'Power Systems, Smart Grids', avatar: 'https://saranathan.ac.in/images/krishnakumar-eee.jpg' }
    ],
    MECH: [
      { name: 'Dr. R. Rekha', designation: 'Professor & Head i/c', email: 'rekha-mech@saranathan.ac.in', specialization: 'CAD/CAM, Thermal Engg', avatar: 'https://saranathan.ac.in/images/rekha-mech.jpg' }
    ],
    CIVIL: [
      { name: 'Dr. A. Belin Jude', designation: 'Associate Professor & Head i/c', email: 'belinjude-civil@saranathan.ac.in', specialization: 'Structural Engineering, GIS', avatar: 'https://saranathan.ac.in/images/belin-ce.jpg' }
    ],
    ICE: [
      { name: 'Dr. K. Gaayathry', designation: 'Associate Professor & Head', email: 'gaayathry-ice@saranathan.ac.in', specialization: 'Process Control, SCADA', avatar: 'https://saranathan.ac.in/images/gaayathry-ice.jpg' }
    ],
    MBA: [
      { name: 'Dr. K. Karthikeyan', designation: 'Professor & Head', email: 'karthikeyan-mba@saranathan.ac.in', specialization: 'Financial Management, Strategy', avatar: 'https://saranathan.ac.in/images/karthikeyan-mba.jpg' }
    ],
    ENG: [
      { name: 'Dr. M. Bhuvaneswari', designation: 'Assistant Professor & Head', email: 'bhuvaneswari-english@saranathan.ac.in', specialization: 'Technical English, Soft Skills', avatar: 'https://saranathan.ac.in/images/bhuvaneswari-eng.jpg' }
    ]
  };

  const officialFacultyUrls = {
    'AI&DS': 'https://saranathan.ac.in/dept.php?dept=AIDS&tgt=faculty',
    CSE: 'https://saranathan.ac.in/dept.php?dept=CSE&tgt=cseabout',
    IT: 'https://saranathan.ac.in/dept.php?dept=IT&tgt=faculty',
    ECE: 'https://saranathan.ac.in/dept.php?dept=ECE&tgt=faculty',
    EEE: 'https://saranathan.ac.in/dept.php?dept=EEE&tgt=faculty',
    MECH: 'https://saranathan.ac.in/dept.php?dept=MECH&tgt=faculty',
    CIVIL: 'https://saranathan.ac.in/dept.php?dept=CE&tgt=faculty',
    ICE: 'https://saranathan.ac.in/dept.php?dept=ICE&tgt=faculty',
    MBA: 'https://saranathan.ac.in/dept.php?dept=MBA&tgt=faculty',
    ENG: 'https://saranathan.ac.in/dept.php?dept=ENG&tgt=faculty'
  };

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await departmentsAPI.getAll();
        if (res.data && res.data.length > 0) {
          setDepartments(res.data);
        }
      } catch (err) {
        console.error("Using default departments list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <span className="badge-gdg mb-2">CAMPUS ACADEMICS</span>
        <h2 className="fw-bold text-dark">{t('nav_departments')}</h2>
        <p className="text-secondary">{t('dept_sub')}</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {departments.map((dept, i) => {
              const dName = t(`dept_name_${dept.code}`) || dept.name;
              const dBlock = t(`block_name_${dept.code}`) || dept.block_name;
              return (
                <div key={i} className="col-md-6">
                  <div 
                    onClick={() => setSelectedDept(dept)}
                    className="glass-card p-4 h-100 bg-white border-0 d-flex flex-column justify-content-between cursor-pointer"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.8rem' }}>{dept.code}</span>
                        <h5 className="fw-bold text-dark mb-0">{dName}</h5>
                      </div>
                      
                      <div className="row g-2 mb-3 text-secondary small">
                        <div className="col-12 d-flex align-items-center gap-2">
                          <FaUserTie className="text-primary flex-shrink-0" />
                          <span><strong>{t('dept_hod_short') || 'HOD'}:</strong> {dept.head_of_department}</span>
                        </div>
                        <div className="col-12 d-flex align-items-center gap-2">
                          <FaMapMarkerAlt className="text-danger flex-shrink-0" />
                          <span><strong>{t('dept_block_short') || 'Block'}:</strong> {dBlock}</span>
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-outline-primary btn-sm rounded-pill w-100 mt-2 fw-semibold">
                      {t('dept_btn')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department Detail Modal */}
          {selectedDept && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, overflowY: 'auto' }}>
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                  <div className="modal-header bg-primary text-white border-0 p-4">
                    <div>
                      <span className="badge bg-white text-primary px-3 py-1 rounded-pill mb-2 fw-bold">{selectedDept.code}</span>
                      <h4 className="modal-title fw-bold">{selectedDept.name}</h4>
                    </div>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedDept(null)}></button>
                  </div>
                  
                  <div className="modal-body p-4 bg-light">
                    {deptDetails[selectedDept.code] && (
                      <>
                        <div className="row g-3 mb-4">
                          <div className="col-md-4">
                            <img 
                              src={deptDetails[selectedDept.code].blockImage} 
                              alt="Block" 
                              className="img-fluid rounded-3 shadow-sm h-100" 
                              style={{ objectFit: 'cover', minHeight: '140px' }} 
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format&fit=crop&q=80' }}
                            />
                          </div>
                          <div className="col-md-4">
                            <img 
                              src={deptDetails[selectedDept.code].labImage} 
                              alt="Lab" 
                              className="img-fluid rounded-3 shadow-sm h-100" 
                              style={{ objectFit: 'cover', minHeight: '140px' }} 
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80' }}
                            />
                          </div>
                          <div className="col-md-4">
                            <img 
                              src={deptDetails[selectedDept.code].classImage} 
                              alt="Classroom" 
                              className="img-fluid rounded-3 shadow-sm h-100" 
                              style={{ objectFit: 'cover', minHeight: '140px' }} 
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80' }}
                            />
                          </div>
                        </div>

                    <div className="p-3 bg-white rounded-3 shadow-sm border mb-3">
                      <h6 className="fw-bold text-primary mb-2">{t('dept_cool_fact_title') || '🔥 Campus Cool Fact'}</h6>
                      <p className="small text-secondary mb-0">{t('dept_fact_' + selectedDept.code) || deptDetails[selectedDept.code].coolFact}</p>
                    </div>
                  </>
                )}

                {/* About Department Section */}
                {deptAbouts[selectedDept.code] && (
                  <div className="p-3 bg-white rounded-3 shadow-sm border mb-3">
                    <h6 className="fw-bold text-primary mb-2">{t('dept_about_section_title') || '📖 About the Department'}</h6>
                    <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                      {t('dept_about_' + selectedDept.code) || deptAbouts[selectedDept.code]}
                    </p>
                  </div>
                )}

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-white rounded-3 border">
                      <strong className="d-block small text-muted">{t('dept_hod')}</strong>
                      <span className="fw-bold text-dark">{selectedDept.head_of_department}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-white rounded-3 border">
                      <strong className="d-block small text-muted">{t('dept_block')}</strong>
                      <span className="fw-bold text-dark">{t('block_name_' + selectedDept.code) || selectedDept.block_name}</span>
                    </div>
                  </div>
                </div>

                {/* Department Faculty Members Section */}
                {deptFacultyAdvisors[selectedDept.code] && (
                  <div className="p-3 bg-white rounded-3 shadow-sm border">
                    <h6 className="fw-bold text-primary mb-3">{t('dept_faculty_advisors_title') || '👨‍🏫 Department Faculty Advisors'}</h6>
                        <div className="row g-2">
                          {deptFacultyAdvisors[selectedDept.code].map((fac, idx) => (
                            <div key={idx} className="col-sm-6">
                              <div className="d-flex align-items-center gap-2 p-2 border rounded-3 bg-light">
                                <img 
                                  src={fac.avatar} 
                                  alt={fac.name} 
                                  className="rounded-circle border" 
                                  style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
                                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' }}
                                />
                                <div>
                                  <strong className="d-block text-dark small" style={{ fontSize: '0.8rem' }}>{fac.name}</strong>
                                  <span className="text-secondary d-block" style={{ fontSize: '0.7rem' }}>{fac.designation}</span>
                                  <a href={`mailto:${fac.email}`} className="d-block text-primary" style={{ fontSize: '0.65rem', textDecoration: 'none' }}>{fac.email}</a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer bg-white border-top p-3 d-flex justify-content-between">
                    <button 
                      type="button" 
                      className="btn btn-primary rounded-pill px-4 fw-semibold"
                      onClick={() => {
                        const targetUrl = officialFacultyUrls[selectedDept.code];
                        if (targetUrl) {
                          window.open(targetUrl, '_blank');
                        }
                      }}
                    >
                      🌐 Go to Official Faculty Page
                    </button>
                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setSelectedDept(null)}>Close</button>
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

export default DepartmentsPage;
