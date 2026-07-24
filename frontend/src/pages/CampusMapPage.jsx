import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  FaMapMarkerAlt, FaSun, FaMoon, FaCloudShowersHeavy, FaClock, FaBus, FaCompass, 
  FaExternalLinkAlt, FaSearch, FaVolumeUp, FaVolumeMute, FaArrowRight, FaWalking,
  FaCloudSun
} from 'react-icons/fa';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

// All campus buildings details including academic blocks and facilities
const campusSpots = [
  {
    id: 'main_block',
    name: 'Main Block (Admin, CSE, IT, MBA)',
    lat: 10.7559,
    lng: 78.6513,
    desc: 'Central quadrangle block of Saranathan College housing the administrative desk, Dean Office, CSE classes, IT laboratories, and the MBA seminar suites.',
    block: 'Central Wing',
    heightLevels: 4,
    googleUrl: 'https://saranathan.ac.in/dept.php?dept=CSE&tgt=cseabout',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format&fit=crop&q=80',
    color: '#3b82f6',
    pos: { x: 0, z: 0 },
    size: { w: 12, h: 16, d: 12 },
    departments: 'CSE, IT, MBA, MCA',
    stairs: 'Main central stairs and east emergency stairs',
    lift: 'Central lobby near the main entrance',
    exits: 'Main portal and east emergency fire exit',
    washrooms: 'Adjacent to central stairs on every floor',
    hours: '08:30 AM - 05:00 PM',
    layout: [
      { level: 'L3', facility: 'MBA Classrooms & Seminar Suite 📈', rooms: [
        { name: 'MBA Seminar Hall', type: 'seminar', faculty: 'Dr. M. Santhi', availability: 'Available', timetables: '09:00 AM - 04:00 PM', exit: 'Stairs East', washroom: 'Left Corridor' },
        { name: 'Classroom 301', type: 'classroom', faculty: 'Dr. R. Rekha', availability: 'In Use', timetables: 'Lectures ongoing', exit: 'Stairs West', washroom: 'Left Corridor' }
      ]},
      { level: 'L2', facility: 'IT Cyber Security Lab & Cloud Server Room 🛡️', rooms: [
        { name: 'IT Cyber Security Lab', type: 'lab', faculty: 'Dr. R. Thillaikarasi', availability: 'Available', timetables: 'Practical sessions at 01:30 PM', exit: 'Central Lift', washroom: 'Right Corridor' },
        { name: 'Server Room', type: 'office', faculty: 'Network Admin', availability: 'Restricted', timetables: 'Maintenance only', exit: 'Central Lift', washroom: 'Right Corridor' }
      ]},
      { level: 'L1', facility: 'CSE Design Lab & Programming Halls 💻', rooms: [
        { name: 'CSE Design Lab', type: 'lab', faculty: 'Dr. S.A. Saha', availability: 'Available', timetables: '08:30 AM - 04:30 PM', exit: 'Stairs East', washroom: 'Left Corridor' },
        { name: 'Programming Lab 1', type: 'lab', faculty: 'Dr. S. Ravimaran', availability: 'In Use', timetables: 'Web Dev Lab', exit: 'Stairs East', washroom: 'Left Corridor' },
        { name: 'Classroom 101', type: 'classroom', faculty: 'Dr. K. Gaayathry', availability: 'Available', timetables: 'Free slot till 11:00 AM', exit: 'Stairs West', washroom: 'Left Corridor' }
      ]},
      { level: 'L0', facility: 'Admin Desks, Accounts Cell, Principal Chamber 🏛️', rooms: [
        { name: 'Principal Chamber', type: 'office', faculty: 'Dr. D. Valavan', availability: 'Available', timetables: 'Appointments only', exit: 'Main Exit', washroom: 'Principal Suite' },
        { name: 'Admin Office', type: 'office', faculty: 'Registrar Desk', availability: 'Available', timetables: '09:00 AM - 05:00 PM', exit: 'Main Exit', washroom: 'Lobby Area' }
      ]}
    ]
  },
  {
    id: 'raman_block',
    name: 'Sir C.V. Raman Block (AI&DS & Humanities)',
    lat: 10.7561,
    lng: 78.6515,
    desc: 'Houses the modern B.Tech Artificial Intelligence and Data Science department, physics laboratory, chemistry labs, and Science & Humanities classrooms.',
    block: 'North-East Wing',
    heightLevels: 3,
    googleUrl: 'https://saranathan.ac.in/dept.php?dept=AIDS&tgt=aids_about',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
    color: '#10b981',
    pos: { x: 25, z: -20 },
    size: { w: 10, h: 12, d: 10 },
    departments: 'AI&DS, Science & Humanities',
    stairs: 'West Wing side stairs',
    lift: 'N/A',
    exits: 'North entrance door and South fire door',
    washrooms: 'First floor corridor end',
    hours: '08:30 AM - 04:30 PM',
    layout: [
      { level: 'L2', facility: 'AI & DS High Performance GPU Analytics Lab 🧠', rooms: [
        { name: 'AI & DS GPU Lab', type: 'lab', faculty: 'Dr. S. Venkatasubramanian', availability: 'Available', timetables: 'GPU Compute Hours: 24/7', exit: 'West Stairs', washroom: 'Floor 1' }
      ]},
      { level: 'L1', facility: 'Communicative English Digital Lab 🗣️', rooms: [
        { name: 'English Digital Lab', type: 'lab', faculty: 'Dr. M. Bhuvaneswari', availability: 'Available', timetables: '09:00 AM - 04:30 PM', exit: 'West Stairs', washroom: 'Corridor End' }
      ]},
      { level: 'L0', facility: 'Physics Spec-Lab & Basic Engineering Workshop ⚡', rooms: [
        { name: 'Physics Spec-Lab', type: 'lab', faculty: 'Dr. L. Murugan', availability: 'Available', timetables: '08:30 AM - 04:30 PM', exit: 'North Door', washroom: 'Main Lobby' }
      ]}
    ]
  },
  {
    id: 'visve_block',
    name: 'Visvesvaraya Block (ECE)',
    lat: 10.7558,
    lng: 78.6511,
    desc: 'Dedicated to Electronics and Communication Engineering. Holds advanced microwave communication testbeds and VLSI micro-fabrication laboratories.',
    block: 'South-West Wing',
    heightLevels: 3,
    googleUrl: 'https://saranathan.ac.in/dept.php?dept=ECE&tgt=eceabt',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    color: '#ec4899',
    pos: { x: -25, z: 20 },
    size: { w: 10, h: 12, d: 10 },
    departments: 'ECE',
    stairs: 'Central ECE flight stairs',
    lift: 'N/A',
    exits: 'South main gate',
    washrooms: 'Ground floor corner',
    hours: '08:30 AM - 04:30 PM',
    layout: [
      { level: 'L2', facility: 'VLSI Micro-Design Lab & DSP Microcontrollers 🔌', rooms: [
        { name: 'VLSI Micro-Design Lab', type: 'lab', faculty: 'Dr. M. Santhi', availability: 'Available', timetables: 'CAD tools setup', exit: 'Central Stairs', washroom: 'Floor 1' }
      ]},
      { level: 'L1', facility: 'Microwave Communication Antenna Testbed 📡', rooms: [
        { name: 'Microwave Lab', type: 'lab', faculty: 'Dr. M. Baritha Begum', availability: 'In Use', timetables: '01:30 PM - 04:30 PM', exit: 'Central Stairs', washroom: 'Floor 1' }
      ]},
      { level: 'L0', facility: 'Microprocessors & Embedded Systems Lab 🛸', rooms: [
        { name: 'Microprocessor Lab', type: 'lab', faculty: 'Dr. P. Rajasekar', availability: 'Available', timetables: '08:30 AM - 04:30 PM', exit: 'Main Gate', washroom: 'Lobby' }
      ]}
    ]
  },
  {
    id: 'bose_block',
    name: 'J.C. Bose Block (EEE & ICE)',
    lat: 10.7562,
    lng: 78.6510,
    desc: 'Houses the Electrical & Electronics and Instrumentation Engineering departments. Features smart grids and LabVIEW process control automation suites.',
    block: 'North-West Wing',
    heightLevels: 3,
    googleUrl: 'https://saranathan.ac.in/dept.php?tgt=iceabout&dept=ICE',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop&q=80',
    color: '#f59e0b',
    pos: { x: -25, z: -20 },
    size: { w: 10, h: 12, d: 10 },
    departments: 'EEE, ICE',
    stairs: 'Central block spiral stairs',
    lift: 'N/A',
    exits: 'West portal exit',
    washrooms: 'Second floor lobby',
    hours: '08:30 AM - 04:30 PM',
    layout: [
      { level: 'L2', facility: 'ICE LabVIEW Academy & Process Control SCADA 🎛️', rooms: [
        { name: 'LabVIEW Academy', type: 'lab', faculty: 'Dr. K. Gaayathry', availability: 'Available', timetables: 'Licenced terminals active', exit: 'Spiral Stairs', washroom: 'Floor 2 Lobby' }
      ]},
      { level: 'L1', facility: 'EEE Power Electronics & Electric Drives Lab ⚡', rooms: [
        { name: 'Power Electronics Lab', type: 'lab', faculty: 'Dr. C. Krishnakumar', availability: 'In Use', timetables: '09:00 AM - 12:00 PM', exit: 'Spiral Stairs', washroom: 'Floor 2 Lobby' }
      ]},
      { level: 'L0', facility: 'Electrical Machines Lab & Solar Microgrid 💡', rooms: [
        { name: 'Electrical Machines Lab', type: 'lab', faculty: 'Dr. S. Vijayalakshmi', availability: 'Available', timetables: 'Heavy machinery active', exit: 'West Exit', washroom: 'Floor 0 lobby' }
      ]}
    ]
  },
  {
    id: 'decennial_block',
    name: 'Decennial Block (Civil Engineering)',
    lat: 10.7564,
    lng: 78.6512,
    desc: 'Established civil structure testing wing. Contains heavy concrete hydration crushers, soil mechanics suites, and surveying coordinate computing rooms.',
    block: 'North Gateway',
    heightLevels: 2,
    googleUrl: 'https://saranathan.ac.in/dept.php?dept=CE&tgt=civilabout',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=500&auto=format&fit=crop&q=80',
    color: '#8b5cf6',
    pos: { x: 0, z: -40 },
    size: { w: 10, h: 8, d: 8 },
    departments: 'Civil Engineering',
    stairs: 'External side steps',
    lift: 'N/A',
    exits: 'North gate archway',
    washrooms: 'Ground floor rear entrance',
    hours: '08:30 AM - 04:30 PM',
    layout: [
      { level: 'L1', facility: 'Geotechnical Soil Mechanics & Environmental Lab 📐', rooms: [
        { name: 'Soil Mechanics Lab', type: 'lab', faculty: 'Dr. V. Punitha', availability: 'Available', timetables: '09:30 AM - 04:00 PM', exit: 'Side Steps', washroom: 'Rear Entrance' }
      ]},
      { level: 'L0', facility: 'Concrete Testing Lab & Surveying Field Store 🏗️', rooms: [
        { name: 'Concrete Testing Lab', type: 'lab', faculty: 'Dr. C. Krishnaswamy', availability: 'Available', timetables: 'Hydration crushers active', exit: 'North Gate', washroom: 'Rear Entrance' }
      ]}
    ]
  },
  {
    id: 'workshop_block',
    name: 'Ramanujan Workshop Block (MECH)',
    lat: 10.7556,
    lng: 78.6508,
    desc: 'Heavy mechanical workshop housing CNC tooling systems, metallurgical testing ovens, and the student-led SAE Formula race car assembly garage.',
    block: 'South Workshop Wing',
    heightLevels: 2,
    googleUrl: 'https://saranathan.ac.in/dept.php?dept=MECH&tgt=faculty',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80',
    color: '#ef4444',
    pos: { x: 25, z: 30 },
    size: { w: 12, h: 8, d: 14 },
    departments: 'Mechanical Engineering',
    stairs: 'Internal iron stairwell',
    lift: 'N/A',
    exits: 'Main shutters roll-up',
    washrooms: 'Adjacent to smithy wing',
    hours: '08:30 AM - 05:00 PM',
    layout: [
      { level: 'L1', facility: 'CAD/CAM Computer Lab & Thermal Simulation Suite 🛠️', rooms: [
        { name: 'CAD/CAM Lab', type: 'lab', faculty: 'Dr. R. Rekha', availability: 'Available', timetables: 'SolidWorks licenses active', exit: 'Iron Stairs', washroom: 'Smithy Wing' }
      ]},
      { level: 'L0', facility: 'Machine Shop, CNC Tooling, SAE Racing Team Garage 🏎️', rooms: [
        { name: 'Machine Shop', type: 'lab', faculty: 'Dr. G. Jayaprakash', availability: 'Available', timetables: 'Lathe operations ongoing', exit: 'Main Shutters', washroom: 'Smithy Wing' },
        { name: 'SAE Racing Garage', type: 'lab', faculty: 'Dr. N. Baskar', availability: 'Available', timetables: 'SAE Formula assembly', exit: 'Main Shutters', washroom: 'Smithy Wing' }
      ]}
    ]
  },
  {
    id: 'library',
    name: 'Central Library (Research Stack & Periodicals)',
    lat: 10.7557,
    lng: 78.6514,
    desc: 'Three-story research repository containing over 60,000 volumes, IEEE digital archives access terminals, and private collaborative study cabins.',
    block: 'Library Wing',
    heightLevels: 3,
    googleUrl: 'https://saranathan.ac.in/commonfaci.php?tgt=library',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop&q=80',
    color: '#06b6d4',
    pos: { x: -45, z: 0 },
    size: { w: 12, h: 12, d: 10 },
    departments: 'All Engineering Streams',
    stairs: 'Spiral wooden staircase',
    lift: 'East corridor lift',
    exits: 'Front glass revolving door',
    washrooms: 'Every level near water dispenser',
    hours: '08:00 AM - 08:00 PM',
    layout: [
      { level: 'L2', facility: 'Reference Hall & Research Cabins 📚', rooms: [
        { name: 'Reference Hall', type: 'library', faculty: 'Librarian Desk', availability: 'Silent Zone', timetables: '08:00 AM - 08:00 PM', exit: 'Wooden Stairs', washroom: 'Water Dispenser' }
      ]},
      { level: 'L1', facility: 'Main Book Stack & Digital Library 💻', rooms: [
        { name: 'Digital Library', type: 'lab', faculty: 'IT Support Desk', availability: 'Available', timetables: 'IEEE journals active', exit: 'East Lift', washroom: 'Water Dispenser' }
      ]},
      { level: 'L0', facility: 'Circulation Counter & Periodicals Section 📰', rooms: [
        { name: 'Circulation Desk', type: 'office', faculty: 'Head Librarian', availability: 'Available', timetables: 'Book returns/issues', exit: 'Revolving Door', washroom: 'Floor 0 Corner' }
      ]}
    ]
  },
  {
    id: 'auditorium',
    name: 'Saranathan Auditorium',
    lat: 10.7563,
    lng: 78.6518,
    desc: 'State-of-the-art 1500-seater fully air-conditioned auditorium hosting college events, symposia, and guest lectures.',
    block: 'South-East Lawn',
    heightLevels: 1,
    googleUrl: 'https://saranathan.ac.in/commonfaci.php?tgt=nssevent',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80',
    color: '#f43f5e',
    pos: { x: 45, z: 0 },
    size: { w: 16, h: 10, d: 14 },
    departments: 'Cultural & Academic Events',
    stairs: 'Side service ramps',
    lift: 'N/A',
    exits: '4 Double doors (Front & Sides)',
    washrooms: 'Lobby area (Male & Female)',
    hours: 'Events Dependent',
    layout: [
      { level: 'L0', facility: 'Main Stage & Seating Deck 🎭', rooms: [
        { name: 'Main Seating Hall', type: 'seminar', faculty: 'Cultural Committee', availability: 'Available', timetables: 'Mixers ongoing', exit: 'Main Exit', washroom: 'Lobby Area' }
      ]}
    ]
  },
  {
    id: 'canteen',
    name: 'Campus Food Court & Canteen',
    lat: 10.7554,
    lng: 78.6506,
    desc: 'Multi-cuisine student canteen serving vegetarian meals, fast food, fresh juices, and bakery items.',
    block: 'South Lawn Area',
    heightLevels: 1,
    googleUrl: 'https://saranathan.ac.in/commonfaci.php?tgt=nssevent',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=500&auto=format&fit=crop&q=80',
    color: '#84cc16',
    pos: { x: -35, z: 45 },
    size: { w: 10, h: 6, d: 10 },
    departments: 'Food & Dining',
    stairs: 'N/A',
    lift: 'N/A',
    exits: 'North and West entrance gates',
    washrooms: 'Adjacent hand-wash area',
    hours: '07:30 AM - 05:30 PM',
    layout: [
      { level: 'L0', facility: 'Dining Hall & Juice Counter 🍏', rooms: [
        { name: 'Dining Hall', type: 'canteen', faculty: 'Canteen Mgr', availability: 'Available', timetables: 'Hot meals serving', exit: 'North Gate', washroom: 'Handwash Area' }
      ]}
    ]
  },
  {
    id: 'hostel',
    name: 'Student Residential Hostels',
    lat: 10.7566,
    lng: 78.6509,
    desc: 'Separate multi-story residential blocks for boys and girls with fully equipped recreation halls and mess facilities.',
    block: 'North-West Gateway',
    heightLevels: 4,
    googleUrl: 'https://saranathan.ac.in/commonfaci.php?tgt=nssevent',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=80',
    color: '#64748b',
    pos: { x: -50, z: -40 },
    size: { w: 12, h: 16, d: 12 },
    departments: 'Student Housing',
    stairs: 'Corner blocks stairs',
    lift: 'Main Wing Lift',
    exits: 'Security check gate',
    washrooms: 'Common rest areas on every corridor',
    hours: '24 Hours (Gate close at 06:30 PM)',
    layout: [
      { level: 'L3', facility: 'Student Rooms Wing D 🛌', rooms: [
        { name: 'Room D-301', type: 'classroom', faculty: 'Warden Office', availability: 'Occupied', timetables: 'Residential', exit: 'Wing Stairs', washroom: 'Corridor Common' }
      ]},
      { level: 'L2', facility: 'Student Rooms Wing C 🛌', rooms: [
        { name: 'Room C-201', type: 'classroom', faculty: 'Warden Office', availability: 'Occupied', timetables: 'Residential', exit: 'Wing Stairs', washroom: 'Corridor Common' }
      ]},
      { level: 'L1', facility: 'Student Rooms Wing B 🛌', rooms: [
        { name: 'Room B-101', type: 'classroom', faculty: 'Warden Office', availability: 'Occupied', timetables: 'Residential', exit: 'Wing Stairs', washroom: 'Corridor Common' }
      ]},
      { level: 'L0', facility: 'Warden Office, Mess Hall & Recreation Deck 🍳', rooms: [
        { name: 'Warden Desk', type: 'office', faculty: 'Residential Warden', availability: 'Available', timetables: '06:00 PM - 09:00 PM', exit: 'Main Checkpoint', washroom: 'Lobby Suite' },
        { name: 'Mess Hall', type: 'canteen', faculty: 'Mess Staff', availability: 'Available', timetables: 'Breakfast, Lunch & Dinner', exit: 'Mess Exit', washroom: 'Lobby Suite' }
      ]}
    ]
  },
  {
    id: 'parking',
    name: 'Central Parking Bay',
    lat: 10.7554,
    lng: 78.6510,
    desc: 'Covered two-wheeler parking and open four-wheeler parking spaces for staff and students.',
    block: 'Main Campus Gate Area',
    heightLevels: 1,
    googleUrl: 'https://saranathan.ac.in/commonfaci.php?tgt=nssevent',
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=500&auto=format&fit=crop&q=80',
    color: '#a1a1aa',
    pos: { x: 0, z: 55 },
    size: { w: 14, h: 2, d: 10 },
    departments: 'Transport & Security',
    stairs: 'N/A',
    lift: 'N/A',
    exits: 'Main arch exit',
    washrooms: 'Security booth adjacent toilet',
    hours: '06:00 AM - 07:00 PM',
    layout: [
      { level: 'L0', facility: 'Parking Slots & EV Charging Point 🔌', rooms: [
        { name: 'EV Charging Bay', type: 'canteen', faculty: 'Security Lead', availability: 'Available', timetables: 'Card access required', exit: 'Main Arch', washroom: 'Security Toilet' }
      ]}
    ]
  },
  {
    id: 'sports',
    name: 'Main Sports Stadium & Ground',
    lat: 10.7560,
    lng: 78.6522,
    desc: 'Athletic turf field featuring standard football grounds, cricket nets, basketball courts, and concrete tennis arenas.',
    block: 'Eastern Fields',
    heightLevels: 1,
    googleUrl: 'https://saranathan.ac.in/commonfaci.php?tgt=physicaledn',
    image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&auto=format&fit=crop&q=80',
    color: '#14b8a6',
    pos: { x: 60, z: 25 },
    size: { w: 20, h: 0.5, d: 24 },
    departments: 'Physical Education Department',
    stairs: 'N/A',
    lift: 'N/A',
    exits: 'South Gate entry arch',
    washrooms: 'Sports locker washrooms',
    hours: '06:00 AM - 08:30 AM, 04:00 PM - 06:30 PM',
    layout: [
      { level: 'L0', facility: 'Athletic Track, Soccer Pitch & Cricket Nets ⚽', rooms: [
        { name: 'Sports Locker Room', type: 'office', faculty: 'Physical Director', availability: 'Available', timetables: '04:00 PM - 06:30 PM', exit: 'Entry Arch', washroom: 'Locker Washroom' }
      ]}
    ]
  }
];

const CampusMapPage = () => {
  const { t } = useLanguage();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [activeTab, setActiveTab] = useState('3D'); // '3D' or 'SATELLITE'
  
  // Custom Controls and states
  const [dayMode, setDayMode] = useState(true);
  const [rainMode, setRainMode] = useState(false);
  const [navigateRoute, setNavigateRoute] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [weather, setWeather] = useState({ temp: 32, condition: 'Sunny Clear Skies', loading: true });

  const canvasRef = useRef(null);
  const threeStateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    buildingGroups: {},
    cloudGroup: null,
    birdGroup: null,
    carGroup: null,
    rainSystem: null,
    routeLine: null,
    ambientLight: null,
    dirLight: null,
    spotLight: null,
    floorMeshes: {}, // map of buildingId -> array of floor meshes
    floorExploded: {} // map of buildingId -> boolean
  });

  const getLocalizedSpot = (spot) => {
    if (!spot) return null;
    return {
      ...spot,
      name: t(`map_spot_${spot.id}_name`) || spot.name,
      block: t(`map_spot_${spot.id}_block`) || spot.block,
      desc: t(`map_spot_${spot.id}_desc`) || spot.desc,
      layout: spot.layout.map(item => ({
        ...item,
        facility: t(`map_spot_${spot.id}_level_${item.level}`) || item.facility
      }))
    };
  };

  const localizedSpots = campusSpots.map(getLocalizedSpot);
  const activeSpot = selectedSpot ? getLocalizedSpot(selectedSpot) : null;

  // Fetch weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.7560&longitude=78.6513&current=temperature_2m,weather_code');
        const data = await response.json();
        
        if (data && data.current) {
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code;
          
          let condition = 'Clear Skies';
          if (code === 0) condition = 'Sunny Clear Skies';
          else if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
          else if (code === 45 || code === 48) condition = 'Foggy';
          else if (code >= 51 && code <= 55) condition = 'Light Drizzle';
          else if (code >= 61 && code <= 65) condition = 'Rainy Weather';
          else if (code >= 80 && code <= 82) condition = 'Heavy Showers';
          else if (code >= 95) condition = 'Thunderstorms';
          
          setWeather({ temp, condition, loading: false });
        }
      } catch (err) {
        setWeather({ temp: 31, condition: 'Sunny Clear Skies', loading: false });
      }
    };
    fetchWeather();
  }, []);

  const getWeatherIcon = () => {
    if (weather.condition.includes('Rain') || weather.condition.includes('Showers') || weather.condition.includes('Drizzle') || weather.condition.includes('Thunderstorms')) {
      return <FaCloudShowersHeavy className="text-info fs-5" />;
    }
    if (weather.condition.includes('Cloudy')) {
      return <FaCloudSun className="text-secondary fs-5" />;
    }
    return <FaSun className="text-warning fs-5" />;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (activeTab !== '3D' || !canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(dayMode ? '#f1f5f9' : '#0f172a');
    scene.fog = new THREE.FogExp2(dayMode ? '#f1f5f9' : '#0f172a', 0.003);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(65, 55, 65);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; // prevent camera going below ground
    controls.minDistance = 20;
    controls.maxDistance = 180;
    controls.target.set(0, 0, 0);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(dayMode ? '#ffffff' : '#1e1b4b', dayMode ? 0.7 : 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(dayMode ? '#ffffff' : '#38bdf8', dayMode ? 1.0 : 0.3);
    dirLight.position.set(40, 70, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 200;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Spotlight pointing at highlighted building
    const spotLight = new THREE.SpotLight('#60a5fa', 0, 40, Math.PI / 6, 0.5, 1);
    spotLight.position.set(0, 30, 0);
    scene.add(spotLight);

    // 6. Ground blueprint plane
    const groundSize = 160;
    const groundGeom = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMat = new THREE.MeshStandardMaterial({
      color: dayMode ? '#e2e8f0' : '#1e293b',
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper overlay to simulate blueprint lines
    const gridHelper = new THREE.GridHelper(groundSize, 32, dayMode ? '#cbd5e1' : '#334155', dayMode ? '#cbd5e1' : '#334155');
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // 7. Roads and Campus Paths layout
    const roadMat = new THREE.MeshStandardMaterial({
      color: dayMode ? '#cbd5e1' : '#0f172a',
      roughness: 0.9
    });
    
    // Main circular central loop road
    const loopRoadGeom = new THREE.RingGeometry(24, 28, 32);
    const loopRoad = new THREE.Mesh(loopRoadGeom, roadMat);
    loopRoad.rotation.x = -Math.PI / 2;
    loopRoad.position.y = 0.06;
    scene.add(loopRoad);

    // Straight entry road
    const entryRoadGeom = new THREE.PlaneGeometry(8, 60);
    const entryRoad = new THREE.Mesh(entryRoadGeom, roadMat);
    entryRoad.rotation.x = -Math.PI / 2;
    entryRoad.position.set(0, 0.06, 30);
    scene.add(entryRoad);

    // Cross East-West roads
    const eastWestRoadGeom = new THREE.PlaneGeometry(60, 6);
    const eastWestRoad = new THREE.Mesh(eastWestRoadGeom, roadMat);
    eastWestRoad.rotation.x = -Math.PI / 2;
    eastWestRoad.position.set(0, 0.06, 0);
    scene.add(eastWestRoad);

    // 8. Low-Poly Trees modeling
    const treeGroup = new THREE.Group();
    const treePositions = [
      { x: -15, z: -15 }, { x: 15, z: -15 }, { x: -15, z: 15 }, { x: 15, z: 15 },
      { x: -35, z: -20 }, { x: -35, z: 20 }, { x: 35, z: -15 }, { x: 35, z: 15 },
      { x: -12, z: -35 }, { x: 12, z: -35 }, { x: -5, z: -5 }
    ];
    const treeTrunkGeom = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: '#78350f' });
    const treeLeavesGeom = new THREE.ConeGeometry(1.2, 3, 8);
    const treeLeavesMat = new THREE.MeshStandardMaterial({
      color: dayMode ? '#16a34a' : '#1e3a1e',
      roughness: 0.6
    });

    treePositions.forEach((pos) => {
      const tree = new THREE.Group();
      
      const trunk = new THREE.Mesh(treeTrunkGeom, treeTrunkMat);
      trunk.position.y = 1;
      trunk.castShadow = true;
      tree.add(trunk);
      
      const leaves = new THREE.Mesh(treeLeavesGeom, treeLeavesMat);
      leaves.position.y = 3;
      leaves.castShadow = true;
      tree.add(leaves);
      
      tree.position.set(pos.x, 0, pos.z);
      // Slight random scale for natural look
      const scale = 0.8 + Math.random() * 0.4;
      tree.scale.set(scale, scale, scale);
      treeGroup.add(tree);
    });
    scene.add(treeGroup);

    // 9. Buildings Group modeling (Stylized white architectural model with blue highlights)
    const buildingGroups = {};
    const floorMeshes = {};

    campusSpots.forEach((spot) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(spot.pos.x, 0, spot.pos.z);
      
      // Store spot info directly on the object for raycasting detection
      bGroup.userData = { id: spot.id, name: spot.name };
      scene.add(bGroup);
      buildingGroups[spot.id] = bGroup;

      floorMeshes[spot.id] = [];
      const floorH = 2.5;

      // Render individual floors stacked vertically
      for (let i = 0; i < spot.heightLevels; i++) {
        const floorGroup = new THREE.Group();
        // Default relative stack position
        floorGroup.position.y = i * (floorH + 0.1) + floorH / 2;
        bGroup.add(floorGroup);
        floorMeshes[spot.id].push(floorGroup);

        // Core white foam model body
        const boxGeom = new THREE.BoxGeometry(spot.size.w, floorH, spot.size.d);
        const boxMat = new THREE.MeshStandardMaterial({
          color: dayMode ? '#ffffff' : '#1e293b',
          roughness: 0.5,
          metalness: 0.1,
          transparent: true,
          opacity: 0.95
        });
        const boxMesh = new THREE.Mesh(boxGeom, boxMat);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        floorGroup.add(boxMesh);

        // Edge highlights (blue architectural outlines)
        const edges = new THREE.EdgesGeometry(boxGeom);
        const lineMat = new THREE.LineBasicMaterial({ 
          color: spot.color, 
          linewidth: 1.5,
          transparent: true,
          opacity: 0.8 
        });
        const lineSeg = new THREE.LineSegments(edges, lineMat);
        floorGroup.add(lineSeg);

        // Small windows (glow-points at night)
        if (!dayMode) {
          const glowMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });
          const winGeom = new THREE.BoxGeometry(0.1, 0.4, 0.4);
          // Add 4 windows on front/back facade
          for (let f = -1; f <= 1; f += 2) {
            for (let w = -2; w <= 2; w += 1.5) {
              const win = new THREE.Mesh(winGeom, glowMat);
              win.position.set(w, 0, f * (spot.size.d / 2 + 0.05));
              floorGroup.add(win);
            }
          }
        }
      }
    });

    // 10. Floating clouds animation setup
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.8
    });
    for (let c = 0; c < 5; c++) {
      const cloud = new THREE.Group();
      const numBlobs = 3 + Math.floor(Math.random() * 3);
      for (let b = 0; b < numBlobs; b++) {
        const blobGeom = new THREE.DodecahedronGeometry(2 + Math.random() * 2, 1);
        const blob = new THREE.Mesh(blobGeom, cloudMat);
        blob.position.set(b * 2 - numBlobs, Math.random() * 1.5, Math.random() * 1.5);
        cloud.add(blob);
      }
      cloud.position.set(-60 + Math.random() * 120, 25 + Math.random() * 5, -60 + Math.random() * 120);
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // 11. Flapping low-poly Birds
    const birdGroup = new THREE.Group();
    const birdMat = new THREE.MeshBasicMaterial({ color: '#cbd5e1', side: THREE.DoubleSide });
    const birdGeom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,    -1, 0, -0.5,   0, 0, -1, // wing left
      0, 0, 0,    0, 0, -1,      1, 0, -0.5  // wing right
    ]);
    birdGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    const birdsArray = [];
    for (let b = 0; b < 6; b++) {
      const bird = new THREE.Mesh(birdGeom, birdMat);
      bird.position.set(-40 + Math.random() * 80, 18 + Math.random() * 4, -40 + Math.random() * 80);
      bird.scale.set(0.6, 0.6, 0.6);
      birdGroup.add(bird);
      birdsArray.push({
        mesh: bird,
        angle: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.05,
        radius: 30 + Math.random() * 20,
        heightOffset: Math.random() * 3
      });
    }
    scene.add(birdGroup);

    // 12. Animated Cars crawling along loop road
    const carGroup = new THREE.Group();
    const carsArray = [];
    const carColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    for (let c = 0; c < 4; c++) {
      const car = new THREE.Group();
      
      const bodyGeom = new THREE.BoxGeometry(1.6, 0.6, 0.8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: carColors[c % carColors.length], roughness: 0.3 });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      body.position.y = 0.3;
      body.castShadow = true;
      car.add(body);

      const cabinGeom = new THREE.BoxGeometry(0.8, 0.4, 0.7);
      const cabinMat = new THREE.MeshStandardMaterial({ color: '#1e293b' });
      const cabin = new THREE.Mesh(cabinGeom, cabinMat);
      cabin.position.set(-0.1, 0.8, 0);
      car.add(cabin);

      car.position.set(0, 0.08, 0);
      carGroup.add(car);

      carsArray.push({
        mesh: car,
        progress: (c / 4) * Math.PI * 2, // starting progress spaced out
        speed: 0.004 + Math.random() * 0.003
      });
    }
    scene.add(carGroup);

    // 13. Weather Rain Particle System (drawn if rainMode is true)
    let rainSystem = null;
    if (rainMode) {
      const rainCount = 1200;
      const rainGeom = new THREE.BufferGeometry();
      const rainPos = new Float32Array(rainCount * 3);
      for (let r = 0; r < rainCount * 3; r += 3) {
        rainPos[r] = -80 + Math.random() * 160;
        rainPos[r+1] = Math.random() * 40;
        rainPos[r+2] = -80 + Math.random() * 160;
      }
      rainGeom.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
      
      const rainTextureMat = new THREE.PointsMaterial({
        color: '#a5f3fc',
        size: 0.25,
        transparent: true,
        opacity: 0.6
      });
      rainSystem = new THREE.Points(rainGeom, rainTextureMat);
      scene.add(rainSystem);
    }

    // 14. Pathfinding Navigation line helper
    let routeLine = null;

    // Cache state references
    threeStateRef.current = {
      scene,
      camera,
      renderer,
      controls,
      buildingGroups,
      cloudGroup,
      birdGroup,
      carGroup,
      rainSystem,
      routeLine,
      ambientLight,
      dirLight,
      spotLight,
      floorMeshes,
      floorExploded: {}
    };

    // Raycasting click detection on building models
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e) => {
      // Calculate mouse position relative to canvas
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check intersection with any floor meshes or building groups
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        // Trace up to find parent group with spot id in userData
        let clickedObj = intersects[0].object;
        let clickedSpotGroup = null;
        
        while (clickedObj && clickedObj !== scene) {
          if (clickedObj.userData && clickedObj.userData.id) {
            clickedSpotGroup = clickedObj;
            break;
          }
          clickedObj = clickedObj.parent;
        }

        if (clickedSpotGroup) {
          const spotId = clickedSpotGroup.userData.id;
          const spotObj = campusSpots.find(s => s.id === spotId);
          if (spotObj) {
            setSelectedSpot(spotObj);
            setSelectedFloor(null);
            setSelectedRoom(null);
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 15. Render Loop Animation
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Damping helper update
      controls.update();

      // Cloud movement
      if (cloudGroup) {
        cloudGroup.children.forEach((cloud) => {
          cloud.position.x += 0.05 * delta * 50;
          if (cloud.position.x > 80) {
            cloud.position.x = -80;
          }
        });
      }

      // Bird circular path flight and wing flapping animation
      if (birdGroup) {
        birdsArray.forEach((b) => {
          b.angle += b.speed * delta * 20;
          b.mesh.position.x = Math.cos(b.angle) * b.radius;
          b.mesh.position.z = Math.sin(b.angle) * b.radius;
          // Flap wings using vertex mesh rotations or basic scale sine waving
          b.mesh.rotation.x = Math.sin(elapsedTime * 12) * 0.15;
          b.mesh.rotation.y = -b.angle + Math.PI / 2;
        });
      }

      // Car driving along central ring path
      if (carGroup) {
        carsArray.forEach((carObj) => {
          carObj.progress += carObj.speed * delta * 200;
          const radius = 26; // loops central loop road
          carObj.mesh.position.x = Math.cos(carObj.progress) * radius;
          carObj.mesh.position.z = Math.sin(carObj.progress) * radius;
          carObj.mesh.rotation.y = -carObj.progress + Math.PI;
        });
      }

      // Tree subtle swaying in wind
      if (treeGroup) {
        treeGroup.children.forEach((tree, idx) => {
          const leaves = tree.children[1];
          if (leaves) {
            leaves.rotation.z = Math.sin(elapsedTime * 2 + idx) * 0.04;
            leaves.rotation.x = Math.cos(elapsedTime * 1.5 + idx) * 0.04;
          }
        });
      }

      // Rain drop animation falling downward loop
      if (rainMode && rainSystem) {
        const positions = rainSystem.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 15 * delta;
          if (positions[i] < 0) {
            positions[i] = 40;
          }
        }
        rainSystem.geometry.attributes.position.needsUpdate = true;
      }

      // Sync custom mini compass dial indicator on screen
      const compassDial = document.getElementById('compass-dial-needle');
      if (compassDial) {
        // Extract horizontal bearing angle
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        const angle = Math.atan2(camDir.x, camDir.z);
        compassDial.style.transform = `rotate(${(angle * 180 / Math.PI) + 180}deg)`;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup logic on resize or unmount
    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [activeTab]);

  // Handle building select, camera zoom, and floor separation transitions
  useEffect(() => {
    const state = threeStateRef.current;
    if (!state.scene) return;

    // Reset all previous exploded floors
    Object.keys(state.floorExploded).forEach((id) => {
      if (id !== selectedSpot?.id) {
        const floors = state.floorMeshes[id];
        if (floors) {
          floors.forEach((fl, idx) => {
            gsap.to(fl.position, { y: idx * (2.5 + 0.1) + 2.5/2, duration: 0.6, overwrite: 'auto' });
          });
        }
        state.floorExploded[id] = false;
      }
    });

    // Reset previous route drawing line
    if (state.routeLine) {
      state.scene.remove(state.routeLine);
      state.routeLine = null;
    }

    if (selectedSpot) {
      // Zoom camera smoothly towards selected building
      gsap.to(state.camera.position, {
        x: selectedSpot.pos.x + 35,
        y: 28,
        z: selectedSpot.pos.z + 35,
        duration: 1.2,
        ease: 'power2.out'
      });
      gsap.to(state.controls.target, {
        x: selectedSpot.pos.x,
        y: 2,
        z: selectedSpot.pos.z,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => state.controls.update()
      });

      // Highlight spot: Position spotlight directly overhead
      state.spotLight.position.set(selectedSpot.pos.x, 30, selectedSpot.pos.z);
      state.spotLight.target = state.buildingGroups[selectedSpot.id];
      gsap.to(state.spotLight, { intensity: 4, duration: 0.5 });

      // Animate exploded floors view separation (vertical layout display)
      const floors = state.floorMeshes[selectedSpot.id];
      if (floors && floors.length > 1) {
        floors.forEach((fl, idx) => {
          // Spread floors vertically. Ground Floor (index 0) stays low; higher floors stack with space gaps.
          const targetY = idx * 6.5 + 2.5 / 2;
          gsap.to(fl.position, {
            y: targetY,
            duration: 1.0,
            ease: 'back.out(1.2)',
            delay: idx * 0.08
          });
        });
        state.floorExploded[selectedSpot.id] = true;
      }

      // Highlight selected building, make others transparent
      campusSpots.forEach((spot) => {
        const group = state.buildingGroups[spot.id];
        if (group) {
          group.children.forEach((flGroup) => {
            flGroup.children.forEach((mesh) => {
              if (mesh instanceof THREE.Mesh) {
                gsap.to(mesh.material, {
                  opacity: spot.id === selectedSpot.id ? 0.95 : 0.25,
                  duration: 0.5
                });
              }
            });
          });
        }
      });

      // Draw active walk path route if navigation toggle enabled
      if (navigateRoute) {
        // Define path coordinates from student gate entrance (0, 0, 50)
        const pathPoints = [
          new THREE.Vector3(0, 0.1, 50),
          new THREE.Vector3(0, 0.1, 26), // circular junction
          new THREE.Vector3(selectedSpot.pos.x * 0.5, 0.1, selectedSpot.pos.z * 0.5), // intermediate mid-step
          new THREE.Vector3(selectedSpot.pos.x, 0.1, selectedSpot.pos.z) // target
        ];
        
        const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
        const curvePoints = pathCurve.getPoints(50);
        
        const lineGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const lineMat = new THREE.LineDashedMaterial({
          color: '#60a5fa',
          linewidth: 4,
          scale: 1,
          dashSize: 2,
          gapSize: 1
        });
        
        const route = new THREE.Line(lineGeom, lineMat);
        route.computeLineDistances(); // vital for dashed animation
        state.scene.add(route);
        state.routeLine = route;

        // Animate dashed lines flowing towards target
        gsap.to(lineMat, {
          dashOffset: -10,
          duration: 3,
          repeat: -1,
          ease: 'none'
        });
      }
    } else {
      // Zoom out to global map view
      gsap.to(state.camera.position, { x: 65, y: 55, z: 65, duration: 1.2 });
      gsap.to(state.controls.target, { x: 0, y: 0, z: 0, duration: 1.2, onUpdate: () => state.controls.update() });
      gsap.to(state.spotLight, { intensity: 0, duration: 0.5 });

      // Restore full visibility on all structures
      campusSpots.forEach((spot) => {
        const group = state.buildingGroups[spot.id];
        if (group) {
          group.children.forEach((flGroup) => {
            flGroup.children.forEach((mesh) => {
              if (mesh instanceof THREE.Mesh) {
                gsap.to(mesh.material, { opacity: 0.95, duration: 0.5 });
              }
            });
          });
        }
      });
    }
  }, [selectedSpot, navigateRoute]);

  // Handle Day/Night lighting transitions
  useEffect(() => {
    const state = threeStateRef.current;
    if (!state.scene) return;

    const bgCol = dayMode ? '#f1f5f9' : '#0f172a';
    gsap.to(state.scene.background, {
      r: dayMode ? 0.945 : 0.059,
      g: dayMode ? 0.961 : 0.090,
      b: dayMode ? 0.976 : 0.165,
      duration: 0.8
    });
    state.scene.fog.color.set(bgCol);

    // Smooth transition light intensities
    gsap.to(state.ambientLight, { intensity: dayMode ? 0.7 : 0.15, duration: 0.8 });
    gsap.to(state.dirLight, { intensity: dayMode ? 1.0 : 0.25, duration: 0.8 });
    gsap.to(state.dirLight.color, {
      r: dayMode ? 1 : 0.22,
      g: dayMode ? 1 : 0.74,
      b: dayMode ? 1 : 0.97,
      duration: 0.8
    });
  }, [dayMode]);

  // Handle keyboard queries in map search box
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    
    // Find first block whose name or floor layouts/rooms match query
    const foundBlock = campusSpots.find((spot) => {
      if (spot.name.toLowerCase().includes(query) || spot.departments.toLowerCase().includes(query)) {
        return true;
      }
      return spot.layout.some(lvl => 
        lvl.rooms.some(r => r.name.toLowerCase().includes(query) || r.faculty.toLowerCase().includes(query))
      );
    });

    if (foundBlock) {
      setSelectedSpot(foundBlock);
      setNavigateRoute(false);
      
      // Look up specific floor and room matching query to auto-select
      const matchingLvl = foundBlock.layout.find(lvl => 
        lvl.rooms.some(r => r.name.toLowerCase().includes(query) || r.faculty.toLowerCase().includes(query))
      );
      
      if (matchingLvl) {
        setSelectedFloor(matchingLvl);
        const matchingRm = matchingLvl.rooms.find(r => r.name.toLowerCase().includes(query) || r.faculty.toLowerCase().includes(query));
        if (matchingRm) {
          setSelectedRoom(matchingRm);
        }
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="text-center mb-4">
        <span className="badge-gdg mb-2">{t('map_badge') || 'CAMPUS NAVIGATION'}</span>
        <h2 className="fw-bold text-dark">{t('map_title') || 'Saranathan College Interactive Map'}</h2>
        <p className="text-secondary">{t('map_sub') || 'Click any academic block to view Google details, floor levels, and interactive 3D model projections.'}</p>
      </div>

      {/* Tabs & Day/Night weather controls */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div className="btn-group rounded-pill overflow-hidden border p-1 bg-white shadow-sm">
          <button 
            className={`btn btn-sm px-4 py-2 rounded-pill fw-semibold border-0 ${activeTab === '3D' ? 'btn-primary text-white' : 'btn-light text-secondary'}`}
            onClick={() => setActiveTab('3D')}
          >
            🏢 {t('map_tab_3D') || '3D Digital Twin Map'}
          </button>
          <button 
            className={`btn btn-sm px-4 py-2 rounded-pill fw-semibold border-0 ${activeTab === 'SATELLITE' ? 'btn-primary text-white' : 'btn-light text-secondary'}`}
            onClick={() => setActiveTab('SATELLITE')}
          >
            📍 {t('map_tab_satellite') || 'Live Satellite Map'}
          </button>
        </div>

        {activeTab === '3D' && (
          <div className="d-flex align-items-center gap-2">
            <button 
              className={`btn btn-light rounded-pill border p-2.5 shadow-sm d-flex align-items-center gap-2 text-secondary ${dayMode ? '' : 'bg-primary-subtle text-primary border-primary'}`}
              onClick={() => setDayMode(!dayMode)}
              title="Day/Night Mode Toggle"
            >
              {dayMode ? <FaSun className="text-warning" /> : <FaMoon className="text-indigo" />}
              <span className="small fw-semibold">{dayMode ? 'Day Mode' : 'Night Mode'}</span>
            </button>

            <button 
              className={`btn btn-light rounded-pill border p-2.5 shadow-sm d-flex align-items-center gap-2 text-secondary ${rainMode ? 'bg-info-subtle text-info border-info' : ''}`}
              onClick={() => setRainMode(!rainMode)}
              title="Rain Particle Toggle"
            >
              <FaCloudShowersHeavy className={rainMode ? 'text-info animate-bounce' : ''} />
              <span className="small fw-semibold">Rain Effect</span>
            </button>
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Main Display Map Area */}
        <div className="col-lg-8">
          <div className="glass-card bg-white border-0 shadow-sm p-4 h-100 min-vh-60 d-flex flex-column justify-content-between position-relative overflow-hidden">
            
            {activeTab === '3D' ? (
              <>
                {/* Search Bar Overlay */}
                <form onSubmit={handleSearchSubmit} className="position-absolute top-0 start-0 m-3 z-3 w-75 max-w-sm">
                  <div className="input-group bg-white rounded-pill shadow-sm overflow-hidden border">
                    <span className="input-group-text border-0 bg-transparent text-secondary pl-3"><FaSearch /></span>
                    <input 
                      type="text" 
                      className="form-control border-0 p-2.5 text-dark bg-transparent" 
                      placeholder="Search CSE Lab, Department, HOD..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary px-3 fw-bold border-0">Find</button>
                  </div>
                </form>

                {/* Compass Dial Overlay */}
                <div className="position-absolute top-0 end-0 m-3 z-3 bg-white p-2 rounded-circle shadow-sm border d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                  <div id="compass-dial-needle" className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ transition: 'transform 0.1s ease-out' }}>
                    <FaCompass className="text-primary fs-3" />
                  </div>
                </div>

                {/* Legend bar overlay */}
                <div className="position-absolute bottom-0 start-0 m-3 z-3 bg-white p-2.5 rounded-3 shadow-sm border d-flex gap-3 small text-secondary">
                  <div className="d-flex align-items-center gap-1.5"><span className="badge rounded-circle p-1" style={{ backgroundColor: '#3b82f6' }}> </span> Academic Block</div>
                  <div className="d-flex align-items-center gap-1.5"><span className="badge rounded-circle p-1" style={{ backgroundColor: '#06b6d4' }}> </span> Library Wing</div>
                  <div className="d-flex align-items-center gap-1.5"><span className="badge rounded-circle p-1" style={{ backgroundColor: '#14b8a6' }}> </span> Sports Ground</div>
                </div>

                {/* Three.js Canvas Container */}
                <canvas 
                  ref={canvasRef} 
                  className="w-100 rounded-4 flex-grow-1" 
                  style={{ minHeight: '420px', cursor: 'grab' }}
                />
              </>
            ) : (
              <div className="position-relative border rounded-4 overflow-hidden shadow-inner flex-grow-1" style={{ minHeight: '450px' }}>
                <iframe
                  title="Saranathan College Google Map"
                  src="https://maps.google.com/maps?q=10.7559647,78.6513248&t=k&z=18&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '450px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </div>
        </div>

        {/* Spot Details Panel */}
        <div className="col-lg-4">
          <div className="d-flex flex-column gap-4">
            
            {/* Main Interactive Details Card */}
            <div className="glass-card p-4 bg-white border-0 text-dark shadow-sm">
              {selectedSpot ? (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge px-3 py-1.5 rounded-pill text-white fw-bold" style={{ backgroundColor: selectedSpot.color }}>
                      {selectedSpot.block}
                    </span>
                    <button 
                      className="btn btn-outline-secondary btn-sm rounded-pill px-2.5 py-0.5"
                      onClick={() => {
                        setSelectedSpot(null);
                        setSelectedFloor(null);
                        setSelectedRoom(null);
                        setNavigateRoute(false);
                      }}
                    >
                      Reset View
                    </button>
                  </div>
                  
                  <h4 className="fw-bold text-dark mb-2">{activeSpot.name}</h4>
                  <p className="text-secondary small mb-4" style={{ lineHeight: '1.6' }}>{activeSpot.desc}</p>

                  <div className="row g-2 mb-4">
                    <div className="col-6 bg-light p-2.5 rounded-3 border text-start">
                      <span className="text-muted d-block small" style={{ fontSize: '0.68rem' }}>HOD OFFICE</span>
                      <strong className="text-dark small">Dr. {activeSpot.name.includes('IT') ? 'R. Thillaikarasi' : 'D. Valavan'}</strong>
                    </div>
                    <div className="col-6 bg-light p-2.5 rounded-3 border text-start">
                      <span className="text-muted d-block small" style={{ fontSize: '0.68rem' }}>HOURS ACTIVE</span>
                      <strong className="text-dark small">{activeSpot.hours}</strong>
                    </div>
                  </div>

                  {/* Explosive Floor plan viewer */}
                  <h6 className="fw-bold text-dark mb-2">🏢 Exploded View Floors Layout:</h6>
                  <div className="d-flex flex-column gap-2 mb-4">
                    {activeSpot.layout.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`d-flex align-items-center justify-content-between p-2.5 rounded-3 cursor-pointer border shadow-sm ${
                          selectedFloor?.level === item.level 
                            ? 'bg-primary-subtle border-primary text-primary' 
                            : 'bg-white text-secondary'
                        }`}
                        onClick={() => {
                          setSelectedFloor(item);
                          setSelectedRoom(null); // reset room selection
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-primary text-white rounded-circle">{item.level}</span>
                          <span className="fw-semibold small">{item.facility}</span>
                        </div>
                        <FaArrowRight size={12} className={selectedFloor?.level === item.level ? 'translate-x-1.5' : ''} />
                      </div>
                    ))}
                  </div>

                  {/* Room Details View inside selected floor */}
                  {selectedFloor && (
                    <div className="bg-light p-3 rounded-4 border mb-4 animate-fade-in">
                      <h6 className="fw-bold text-dark small mb-2">🚪 Rooms on {selectedFloor.level}:</h6>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {selectedFloor.rooms && selectedFloor.rooms.map((room, rIdx) => (
                          <button
                            key={rIdx}
                            className={`btn btn-sm px-3 rounded-pill fw-semibold border ${
                              selectedRoom?.name === room.name 
                                ? 'btn-primary text-white border-primary shadow-sm' 
                                : 'btn-white bg-white text-secondary'
                            }`}
                            onClick={() => setSelectedRoom(room)}
                          >
                            {room.name}
                          </button>
                        ))}
                      </div>

                      {selectedRoom && (
                        <div className="bg-white p-3 rounded-3 border small">
                          <div className="mb-2"><strong>Room Head:</strong> {selectedRoom.faculty}</div>
                          <div className="mb-2"><strong>Availability:</strong> <span className={`badge ${selectedRoom.availability === 'Available' ? 'bg-success' : 'bg-warning'}`}>{selectedRoom.availability}</span></div>
                          <div className="mb-2"><strong>Timetable:</strong> {selectedRoom.timetables}</div>
                          <div className="mb-2"><strong>Nearest Washroom:</strong> {selectedRoom.washroom}</div>
                          <div className="mb-0"><strong>Nearest Exit Point:</strong> {selectedRoom.exit}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation trigger button */}
                  <button 
                    onClick={() => setNavigateRoute(!navigateRoute)}
                    className={`btn w-100 py-3 rounded-pill fw-bold border-0 d-flex align-items-center justify-content-center gap-2 shadow-sm ${
                      navigateRoute ? 'btn-danger' : 'btn-gradient text-white'
                    }`}
                  >
                    <FaWalking className={navigateRoute ? 'animate-bounce' : ''} />
                    {navigateRoute ? 'Cancel Navigation' : 'Navigate Here'}
                  </button>

                </div>
              ) : (
                <div className="text-center py-5 text-secondary">
                  <FaMapMarkerAlt className="text-primary fs-2 mb-3 animate-bounce" />
                  <p className="small mb-0">Select an academic block from the 3D map or listing to display architectural layout details.</p>
                </div>
              )}
            </div>

            {/* Weather & Info widget */}
            <div className="glass-card p-4 bg-white border-0 text-dark shadow-sm">
              <h5 className="fw-bold mb-3 small text-muted">CAMPUS CLIMATE & INFO</h5>
              <div className="d-flex flex-column gap-3 small">
                <div className="d-flex align-items-center gap-3">
                  {getWeatherIcon()}
                  <div>
                    <span className="text-secondary d-block">Weather Today (Live)</span>
                    <strong>
                      {weather.loading ? 'Loading...' : `${weather.temp}°C / ${weather.condition}`}
                    </strong>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FaClock className="text-success fs-5" />
                  <div>
                    <span className="text-secondary d-block">Admissions desk hours</span>
                    <strong>09:00 AM – 04:00 PM</strong>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FaBus className="text-primary fs-5" />
                  <div>
                    <span className="text-secondary d-block">Active transport lines</span>
                    <strong>Bus Route 3A, 7B running</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMapPage;
