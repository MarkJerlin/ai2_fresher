import React, { useState, useEffect } from 'react';
import { facultyAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { FaEnvelope, FaBuilding, FaPhoneAlt, FaSearch } from 'react-icons/fa';

const FacultyPage = () => {
  const { t } = useLanguage();
  const allFaculty = [
    // Artificial Intelligence & Data Science
    {
      name: 'Dr. S. Ravimaran',
      designation: 'Professor & Head',
      department_name: 'Artificial Intelligence & Data Science',
      department_code: 'AI&DS',
      email: 'ravimaran-aids@saranathan.ac.in',
      phone: '+91 431 290 8400',
      room_no: 'CVR-101',
      specialization: 'Artificial Intelligence, Deep Learning, Big Data Analytics',
      image_url: 'https://saranathan.ac.in/images/ravimaran-aid.jpg'
    },
    // Computer Science & Engineering
    {
      name: 'Dr. V. Punitha',
      designation: 'Professor & Head',
      department_name: 'Computer Science and Engineering',
      department_code: 'CSE',
      email: 'punitha-cse@saranathan.ac.in',
      phone: '+91 431 290 8401',
      room_no: 'MB-102',
      specialization: 'Cloud Computing, Image Processing, Data Structures',
      image_url: 'https://saranathan.ac.in/images/punitha-it.jpg'
    },
    {
      name: 'Dr. P. D. Sheba Kezia Malarchelvi',
      designation: 'Professor & Head (AI&ML)',
      department_name: 'Computer Science & Engineering (AI & ML)',
      department_code: 'CSE',
      email: 'shebakezia-cse@saranathan.ac.in',
      phone: '+91 431 290 8402',
      room_no: 'MB-105',
      specialization: 'Machine Learning, Neural Networks, Soft Computing',
      image_url: 'https://saranathan.ac.in/images/pdsheba-cse.jpg'
    },
    // Electronics & Communication Engineering
    {
      name: 'Dr. M. Santhi',
      designation: 'Professor & Head',
      department_name: 'Electronics & Communication Engineering',
      department_code: 'ECE',
      email: 'santhi-ece@saranathan.ac.in',
      phone: '+91 431 290 8403',
      room_no: 'VB-201',
      specialization: 'VLSI Design, Embedded Systems, Signal Processing',
      image_url: 'https://saranathan.ac.in/images/santhim.jpg'
    },
    // Electrical & Electronics Engineering
    {
      name: 'Dr. C. Krishnakumar',
      designation: 'Professor & Head',
      department_name: 'Electrical & Electronics Engineering',
      department_code: 'EEE',
      email: 'krishnakumar-eee@saranathan.ac.in',
      phone: '+91 431 290 8404',
      room_no: 'JCB-101',
      specialization: 'Power Systems, Renewable Energy, Smart Grids',
      image_url: 'https://saranathan.ac.in/images/krishnakumar-eee.jpg'
    },
    // Mechanical Engineering
    {
      name: 'Dr. R. Rekha',
      designation: 'Professor & Head i/c',
      department_name: 'Mechanical Engineering',
      department_code: 'MECH',
      email: 'rekha-mech@saranathan.ac.in',
      phone: '+91 431 290 8405',
      room_no: 'RW-101',
      specialization: 'CAD/CAM, Thermal Engineering, Composite Materials',
      image_url: 'https://saranathan.ac.in/images/rekha-mech.jpg'
    },
    // Civil Engineering
    {
      name: 'Dr. A. Belin Jude',
      designation: 'Associate Professor & Head i/c',
      department_name: 'Civil Engineering',
      department_code: 'CIVIL',
      email: 'belinjude-civil@saranathan.ac.in',
      phone: '+91 431 290 8406',
      room_no: 'DB-101',
      specialization: 'Structural Engineering, Concrete Technology, GIS',
      image_url: 'https://saranathan.ac.in/images/belin-ce.jpg'
    },
    // Instrumentation & Control Engineering
    {
      name: 'Dr. K. Gaayathry',
      designation: 'Associate Professor & Head',
      department_name: 'Instrumentation & Control Engineering',
      department_code: 'ICE',
      email: 'gaayathry-ice@saranathan.ac.in',
      phone: '+91 431 290 8407',
      room_no: 'JCB-201',
      specialization: 'Process Control, Biomedical Instrumentation, SCADA',
      image_url: 'https://saranathan.ac.in/images/gaayathry-ice.jpg'
    },
    // Management Studies (MBA)
    {
      name: 'Dr. K. Karthikeyan',
      designation: 'Professor & Head',
      department_name: 'Management Studies (MBA)',
      department_code: 'MBA',
      email: 'karthikeyan-mba@saranathan.ac.in',
      phone: '+91 431 290 8408',
      room_no: 'MB-301',
      specialization: 'Financial Management, Marketing Analytics, HR Strategy',
      image_url: 'https://saranathan.ac.in/images/karthikeyan-mba.jpg'
    },
    // Science & Humanities (English)
    {
      name: 'Dr. M. Bhuvaneswari',
      designation: 'Assistant Professor & Head',
      department_name: 'English / Science & Humanities',
      department_code: 'S&H',
      email: 'bhuvaneswari-english@saranathan.ac.in',
      phone: '+91 431 290 8409',
      room_no: 'SH-102',
      specialization: 'Technical English, Soft Skills, ELT Communication',
      image_url: 'https://saranathan.ac.in/images/bhuvaneswari-eng.jpg'
    }
  ];

  const [faculty, setFaculty] = useState(allFaculty);
  const [search, setSearch] = useState('');
  
  // Parse query parameter to pre-select department filter
  const query = new URLSearchParams(window.location.search);
  const deptParam = query.get('dept') || 'ALL';
  const [selectedDept, setSelectedDept] = useState(deptParam);
  const [loading, setLoading] = useState(true);

  const handleSelectDept = (code) => {
    setSelectedDept(code);
    const newUrl = code === 'ALL' ? window.location.pathname : `${window.location.pathname}?dept=${encodeURIComponent(code)}`;
    window.history.replaceState(null, '', newUrl);
  };

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await facultyAPI.getAll();
        if (res.data && res.data.length > 0) {
          const dbFaculty = res.data.map(item => {
            let deptCode = 'CSE';
            if (item.department_id === 2) deptCode = 'IT';
            else if (item.department_id === 3) deptCode = 'ECE';
            else if (item.department_id === 4) deptCode = 'MECH';
            
            return {
              name: item.name,
              designation: item.designation,
              department_name: item.department_name,
              department_code: deptCode,
              email: item.email,
              phone: item.phone,
              room_no: item.room_no,
              specialization: item.specialization,
              image_url: item.image_url
            };
          });

          const merged = [...dbFaculty];
          allFaculty.forEach(fallback => {
            if (!dbFaculty.some(f => f.name.toLowerCase() === fallback.name.toLowerCase())) {
              merged.push(fallback);
            }
          });
          setFaculty(merged);
        }
      } catch (err) {
        console.error("Failed to load faculty advisors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                          f.specialization?.toLowerCase().includes(search.toLowerCase()) ||
                          f.department_name?.toLowerCase().includes(search.toLowerCase());
    
    if (selectedDept === 'ALL') return matchesSearch;
    return matchesSearch && f.department_code === selectedDept;
  });

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <span className="badge-gdg mb-2">CAMPUS ADVISORS</span>
        <h2 className="fw-bold text-dark">{t('faculty_title')}</h2>
        <p className="text-secondary">{t('faculty_sub')}</p>
      </div>

      {/* Search Input bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group glass-card bg-white border-0 shadow-sm p-1 rounded-pill">
            <span className="input-group-text border-0 bg-transparent text-muted ms-2"><FaSearch /></span>
            <input
              type="text"
              className="form-control border-0 shadow-none text-dark bg-transparent"
              placeholder={t('faculty_search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {[
          { code: 'ALL', label: 'All Departments' },
          { code: 'AI&DS', label: 'AI & Data Science (AI&DS)' },
          { code: 'CIVIL', label: 'Civil (CIVIL)' },
          { code: 'CSE', label: 'Computer Science (CSE)' },
          { code: 'ECE', label: 'Electronics & Comm (ECE)' },
          { code: 'EEE', label: 'Electrical & Electronics (EEE)' },
          { code: 'ICE', label: 'Instrumentation (ICE)' },
          { code: 'IT', label: 'Information Technology (IT)' },
          { code: 'MBA', label: 'Management Studies (MBA)' },
          { code: 'S&H', label: 'Science & Humanities (ENG)' }
        ].map((tab) => (
          <button
            key={tab.code}
            className={`btn rounded-pill px-4 py-2 border fw-semibold small ${
              selectedDept === tab.code 
                ? 'btn-primary text-white border-primary shadow-sm' 
                : 'btn-light text-secondary bg-white'
            }`}
            style={{ transition: 'all 0.2s ease-in-out' }}
            onClick={() => handleSelectDept(tab.code)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredFaculty.map((f, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="glass-card p-4 h-100 bg-white border-0 text-center d-flex flex-column justify-content-between">
                <div className="d-flex flex-column align-items-center">
                  <img
                    src={f.image_url?.startsWith('http') ? f.image_url : `http://localhost:5000/uploads/faculty/${f.image_url || 'default_faculty.png'}`}
                    alt={f.name}
                    className="rounded-circle mb-3 border shadow-sm"
                    style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' }}
                  />
                  <h6 className="fw-bold text-dark mb-0">{f.name}</h6>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{f.designation} — {f.department_name}</span>
                  <p className="text-secondary small mt-3 px-2">{f.specialization || 'General Mentor'}</p>
                </div>

                <div className="bg-light p-3 rounded-4 small text-start text-secondary mt-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaEnvelope className="text-muted" /> <a href={`mailto:${f.email}`} className="text-decoration-none text-secondary">{f.email}</a>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaBuilding className="text-muted" /> <strong>Office:</strong> {f.room_no || 'TBD'}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FaPhoneAlt className="text-muted" /> <strong>Phone Ext:</strong> {f.phone || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyPage;
