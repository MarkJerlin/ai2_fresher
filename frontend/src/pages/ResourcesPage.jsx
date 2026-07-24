import React, { useState, useEffect } from 'react';
import { resourcesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaFilePdf, FaDownload, FaUpload, FaFolderOpen, FaInfoCircle, FaFileAlt, FaYoutube, FaLink } from 'react-icons/fa';

const academicPlannerData = [
  {
    month: "July 2026",
    workingDays: 23,
    events: [
      { date: "Jul 1 (Wed)", details: "III, V, VII Semester Classes Commences", type: "academic", dayOrder: "I" },
      { date: "Jul 4 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Jul 5 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Jul 11 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Jul 12 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Jul 18 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Jul 19 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Jul 25 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Jul 26 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Jul 31 (Fri)", details: "Syllabus Completion for CIA-1 Portion", type: "milestone", dayOrder: "III" }
    ]
  },
  {
    month: "August 2026",
    workingDays: 21,
    events: [
      { date: "Aug 1 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Aug 2 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Aug 3 (Mon) - Aug 8 (Sat)", details: "CIA Test - 1 Series (Continuous Internal Assessment)", type: "exam" },
      { date: "Aug 9 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Aug 14 (Fri)", details: "Vinayagar Chaturthi - Holiday", type: "holiday" },
      { date: "Aug 15 (Sat)", details: "Independence Day - Holiday", type: "holiday" },
      { date: "Aug 16 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Aug 22 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Aug 23 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Aug 26 (Wed)", details: "Milad-un-Nabi - Holiday", type: "holiday" },
      { date: "Aug 27 (Thu)", details: "Avani Avittam - Holiday", type: "holiday" },
      { date: "Aug 30 (Sun)", details: "Weekly Holiday", type: "holiday" }
    ]
  },
  {
    month: "September 2026",
    workingDays: 21,
    events: [
      { date: "Sep 1 (Tue)", details: "Syllabus Completion for CIA-2 Portion", type: "milestone", dayOrder: "I" },
      { date: "Sep 2 (Wed)", details: "Krishna Jayanthi - Holiday", type: "holiday" },
      { date: "Sep 3 (Thu)", details: "Teachers Day - Holiday", type: "holiday" },
      { date: "Sep 4 (Fri)", details: "Weekly Holiday", type: "holiday" },
      { date: "Sep 5 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Sep 6 (Sun) - Sep 11 (Fri)", details: "CIA Test - 2 Series (Continuous Internal Assessment)", type: "exam" },
      { date: "Sep 12 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Sep 13 (Sun)", details: "Vinayagar Chaturthi - Holiday", type: "holiday" },
      { date: "Sep 14 (Mon)", details: "Engineer's Day Celebration", type: "academic", dayOrder: "III" },
      { date: "Sep 19 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Sep 20 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Sep 26 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Sep 27 (Sun)", details: "Weekly Holiday", type: "holiday" }
    ]
  },
  {
    month: "October 2026",
    workingDays: 12,
    events: [
      { date: "Oct 1 (Thu)", details: "Syllabus Completion for CIA-3 Portion", type: "milestone", dayOrder: "I" },
      { date: "Oct 2 (Fri)", details: "Gandhi Jayanthi - Holiday", type: "holiday" },
      { date: "Oct 3 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Oct 4 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Oct 5 (Mon) - Oct 10 (Sat)", details: "CIA Test - 3 Series (Continuous Internal Assessment)", type: "exam" },
      { date: "Oct 11 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Oct 12 (Mon) - Oct 16 (Fri)", details: "Model Practical Examinations", type: "exam" },
      { date: "Oct 17 (Sat)", details: "Weekly Holiday", type: "holiday" },
      { date: "Oct 18 (Sun)", details: "Weekly Holiday", type: "holiday" },
      { date: "Oct 19 (Mon)", details: "Ayudha Pooja - Holiday", type: "holiday" },
      { date: "Oct 20 (Tue)", details: "Vijayadhasami - Holiday", type: "holiday" },
      { date: "Oct 21 (Wed)", details: "End Semester Practical Examinations Begin", type: "milestone" },
      { date: "Oct 26 (Mon)", details: "End Semester Arrear Examinations Begin", type: "milestone" }
    ]
  },
  {
    month: "November 2026",
    workingDays: 0,
    events: [
      { date: "Nov 7 (Sat)", details: "Deepavali - Holiday", type: "holiday" },
      { date: "Nov 9 (Mon)", details: "End Semester Theory Examinations Begins", type: "milestone" },
      { date: "Nov 14 (Sat)", details: "Children's Day Celebration", type: "academic" }
    ]
  }
];

const ResourcesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [activePlannerMonth, setActivePlannerMonth] = useState('July 2026');
  const [plannerFilter, setPlannerFilter] = useState('all');
  const [activeTimetableImage, setActiveTimetableImage] = useState(null);

  // Academic assets mapping for Saranathan College of Engineering
  const defaultResources = {
    AIDS: [
      { id: 'aids-sy', title: 'Saranathan AI & DS Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Official Anna University syllabus for Artificial Intelligence & Data Science at Saranathan College.', link: 'https://drive.google.com/file/d/1FXw_yVW-gk5wCiB-I0WDcsmSOAaBThM1/view' },
      { id: 'aids-tt', title: 'AI & DS Semester Timetable & GPU Lab Slot', category: 'timetable', description: 'Weekly class lectures, CVR block Python lab schedules, and machine learning sessions.', image: '/resources/aids_timetable.jpg' },
      { id: 'aids-rf', title: 'References', category: 'references', description: 'Recommended external YouTube reference channels for Python and AI foundations.', links: [
        { name: 'Error Makes Clever', url: 'https://www.youtube.com/@ErrorMakesClever' },
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: 'Alex Maths Engineering', url: 'https://www.youtube.com/@AlexMathsEngineering' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    CSE: [
      { id: 'cse-sy', title: 'Saranathan CSE Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Official curriculum blueprint and semester-wise course details for CSE.', link: 'https://drive.google.com/file/d/1_AKHF0VyH-QEzkHz4u5aUQQJG3mBuG9W/view' },
      { id: 'cse-tt', title: 'CSE Odd Semester Timetable & Main Lab Slot', category: 'timetable', description: 'Weekly class lectures, tutorials, and computer laboratory scheduling.', image: '/resources/cse_timetable.jpg' },
      { id: 'cse-rf', title: 'References', category: 'references', description: 'Recommended external YouTube reference channels for computer science tutorials.', links: [
        { name: 'Error Makes Clever', url: 'https://www.youtube.com/@ErrorMakesClever' },
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: 'Alex Maths Engineering', url: 'https://www.youtube.com/@AlexMathsEngineering' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    IT: [
      { id: 'it-sy', title: 'Saranathan IT Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Curriculum blueprint covering data structures, databases, and network modules.', link: 'https://drive.google.com/file/d/1JZfQWcitxeixzgujcHXlIgD_sBE6sQ8P/view' },
      { id: 'it-tt', title: 'IT Odd Semester Timetable', category: 'timetable', description: 'Lecture schedules, server maintenance practice logs, and cyber labs.', image: '/resources/it_timetable.jpg' },
      { id: 'it-rf', title: 'References', category: 'references', description: 'Recommended YouTube reference channels for databases and web tech.', links: [
        { name: 'Error Makes Clever', url: 'https://www.youtube.com/@ErrorMakesClever' },
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: 'Alex Maths Engineering', url: 'https://www.youtube.com/@AlexMathsEngineering' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    ECE: [
      { id: 'ece-sy', title: 'Saranathan ECE Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Course objectives detailing digital electronics, signals, and VLSI design.', link: 'https://drive.google.com/file/d/1qxewU6JLRp5tqSRqYOlwVyvoY_AA4y8x/view' },
      { id: 'ece-tt', title: 'ECE Odd Semester Timetable', category: 'timetable', description: 'Class routines, circuits lab timings, and micro-controller design schedules.', image: '/resources/ece_timetable.jpg' },
      { id: 'ece-rf', title: 'References', category: 'references', description: 'Recommended YouTube channels for engineering maths and circuit designs.', links: [
        { name: 'Alex Maths Engineering', url: 'https://www.youtube.com/@AlexMathsEngineering' },
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: 'Error Makes Clever', url: 'https://www.youtube.com/@ErrorMakesClever' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    EEE: [
      { id: 'eee-sy', title: 'Saranathan EEE Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Syllabus covering electric circuits, power systems, and renewable energy.', link: 'https://drive.google.com/file/d/1BazKOpdXOxaofyohkCZEbXag02WXP9zx/view' },
      { id: 'eee-tt', title: 'EEE Odd Semester Timetable & Machines Lab Slot', category: 'timetable', description: 'Weekly schedule for electrical machines lab, transformers, and power electronics.', image: '/resources/eee_timetable.jpg' },
      { id: 'eee-rf', title: 'References', category: 'references', description: 'Recommended YouTube reference channels for electrical sciences.', links: [
        { name: 'Alex Maths Engineering', url: 'https://www.youtube.com/@AlexMathsEngineering' },
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    MECH: [
      { id: 'mech-sy', title: 'Saranathan Mechanical Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Syllabus details for engineering mechanics, CAD drawing, and manufacturing.', link: 'https://drive.google.com/file/d/1O9W4QTDEu-sOMt5oMEFG8Eepd7VlT1PS/view' },
      { id: 'mech-tt', title: 'Mechanical Odd Semester Timetable', category: 'timetable', description: 'Class hours, tooling workshop modules, and computer CAD drawing scheduling.', image: '/resources/mech_timetable.jpg' },
      { id: 'mech-rf', title: 'References', category: 'references', description: 'Recommended YouTube channels for mechanical engineering and maths.', links: [
        { name: 'Alex Maths Engineering', url: 'https://www.youtube.com/@AlexMathsEngineering' },
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    CIVIL: [
      { id: 'civil-sy', title: 'Saranathan Civil Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Curriculum covering surveying, structural analysis, and concrete technology.', link: 'https://drive.google.com/file/d/13EKzWLk4dGRosgfP8n-G9FeYPebhDGSb/view' },
      { id: 'civil-tt', title: 'Civil Engineering Odd Semester Timetable', category: 'timetable', description: 'Class routine for surveying field practice, CAD drafting, and structural labs.', image: '/resources/civil_timetable.jpg' },
      { id: 'civil-rf', title: 'References', category: 'references', description: 'Recommended YouTube channels for civil engineering and mathematics.', links: [
        { name: 'Alex Maths Engineering', url: 'https://www.youtube.com/@AlexMathsEngineering' },
        { name: 'Error Makes Clever', url: 'https://www.youtube.com/@ErrorMakesClever' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    ICE: [
      { id: 'ice-sy', title: 'Saranathan ICE Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Course details covering sensors, transducers, PLC, and process automation.', link: 'https://drive.google.com/file/d/1Xgk4hRiQVk6IMcTPXq7s1_6hEYwLq7m5/view' },
      { id: 'ice-tt', title: 'ICE Odd Semester Timetable & Instrumentation Lab Slot', category: 'timetable', description: 'Weekly routines for process control lab, SCADA tools, and bio-sensors.', image: '/resources/ice_timetable.jpg' },
      { id: 'ice-rf', title: 'References', category: 'references', description: 'Recommended YouTube reference channels for control instrumentation.', links: [
        { name: 'Alex Maths Engineering', url: 'https://www.youtube.com/@AlexMathsEngineering' },
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    MBA: [
      { id: 'mba-sy', title: 'Saranathan MBA Regulation 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Course details covering financial systems, operations, and management metrics.', link: 'https://drive.google.com/file/d/1ICAUhfVXuUA7M39WzjSunIXfavD2px1w/view' },
      { id: 'mba-tt', title: 'MBA Odd Semester Timetable', category: 'timetable', description: 'Class routine for managerial economics, business communication, and case studies.', image: '/resources/mba_timetable.jpg' },
      { id: 'mba-rf', title: 'References', category: 'references', description: 'Recommended business case study and accounting reference channels.', links: [
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: 'Error Makes Clever', url: 'https://www.youtube.com/@ErrorMakesClever' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ],
    ENGLISH: [
      { id: 'english-sy', title: 'Saranathan Humanities & English 2024 Curriculum & Syllabus', category: 'syllabus', description: 'Course details covering professional communications, grammar, and literature.', link: 'https://drive.google.com/file/d/1_AKHF0VyH-QEzkHz4u5aUQQJG3mBuG9W/view' },
      { id: 'english-tt', title: 'English Odd Semester Timetable', category: 'timetable', description: 'Class routine for language lab sessions, public speaking, and creative writing.', image: '/resources/english_timetable.jpg' },
      { id: 'english-rf', title: 'References', category: 'references', description: 'Recommended external YouTube reference channels for soft skills.', links: [
        { name: 'Error Makes Clever', url: 'https://www.youtube.com/@ErrorMakesClever' },
        { name: 'Codeio', url: 'https://www.youtube.com/@codeio' },
        { name: '4G Silver Academy', url: 'https://www.youtube.com/@4G_Silver_Academy_தமிழ்' }
      ] }
    ]
  };

  const getDocumentContent = (dept, category, title) => {
    if (category === 'syllabus') {
      if (dept === 'CSE') {
        return `REGULATIONS 2024 - COMPUTER SCIENCE & ENGINEERING
CURRICULUM & SYLLABUS OUTLINE (SEMESTERS I - IV)

SEMESTER I:
- 24IP101: Induction Programme (0 Credits)
- 24EN101: Professional English I (3 Credits)
- 24MA101: Engineering Mathematics I (4 Credits)
- 24PH101: Engineering Physics (3 Credits)
- 24CH101: Engineering Chemistry (3 Credits)
- 24ES101: Problem Solving & Python Programming (3 Credits)
- 24ES102: Engineering Graphics (4 Credits)
- 24TA101: Heritage of Tamils (1 Credit)
- Laboratories: Physics/Chemistry Lab (2), Python Lab (2), Communication Lab (1).

SEMESTER II:
- 24EN201: Professional English II (3 Credits)
- 24MA201: Engineering Mathematics II (4 Credits)
- 24PH201: Physics for Information Science (3 Credits)
- 24CS201: Programming in C (3 Credits)
- 24TA201: Tamils and Technology (1 Credit)
- 24ES201: Basic Electrical & Electronics Engineering (4 Credits)
- Laboratories: C Programming Lab (2), Communication Lab II (1).

SEMESTER III:
- 24MA301: Probability and Statistics (4 Credits)
- 24CS301: Data Structures (3 Credits)
- 24CS302: Object Oriented Programming (3 Credits)
- 24ES301: Digital Principles & Computer Organization (4 Credits)
- 24CS303: Essentials of Web Development (4 Credits)
- 24CS304: Foundations of Data Science (4 Credits)
- Laboratories: Data Structures Lab (1.5), OOP Lab (1.5), Employability Skills I (1).

SEMESTER IV:
- 24MA401: Discrete Mathematics (4 Credits)
- 24CH401: Environmental Sciences & Sustainability (2 Credits)
- 24CS401: Theory of Computation (3 Credits)
- 24CS402: Database Management Systems (3 Credits)
- 24CS403: Operating Systems (3 Credits)
- 24CS404: Design and Analysis of Algorithms (4 Credits)
- Laboratories: DBMS Lab (1.5), OS Lab (1.5), Employability Skills II (1).`;
      }
      if (dept === 'IT') {
        return `REGULATIONS 2024 - INFORMATION TECHNOLOGY
CURRICULUM & SYLLABUS OUTLINE (SEMESTERS I - IV)

SEMESTER I & II (Common Engineering & Computing Foundation):
- 24IP101: Induction Programme (0 Credits)
- 24EN101: Professional English I (3 Credits)
- 24MA101: Engineering Mathematics I (4 Credits)
- 24PH101: Engineering Physics (3 Credits)
- 24CH101: Engineering Chemistry (3 Credits)
- 24ES101: Problem Solving & Python Programming (3 Credits)
- 24CS201: Programming in C (3 Credits)

SEMESTER III:
- 24MA301: Probability and Statistics (4 Credits)
- 24IT301: Data Structures & Algorithms (3 Credits)
- 24IT302: Software Engineering Methodologies (3 Credits)
- 24IT303: Computer Networks & Protocols (4 Credits)
- 24IT304: Object Oriented Programming with Java (4 Credits)

SEMESTER IV:
- 24MA402: Discrete Mathematics & Automata (4 Credits)
- 24IT401: Database Design & SQL (3 Credits)
- 24IT402: Web Technologies & APIs (4 Credits)
- 24IT403: Operating Systems & Virtualization (3 Credits)
- 24IT404: Cryptography & Cyber Security (4 Credits)`;
      }
      if (dept === 'ECE') {
        return `REGULATIONS 2024 - ELECTRONICS & COMMUNICATION
CURRICULUM & SYLLABUS OUTLINE (SEMESTERS I - IV)

SEMESTER I & II (Basic Engineering Core):
- 24MA101: Engineering Mathematics I (4 Credits)
- 24PH101: Engineering Physics (3 Credits)
- 24CH101: Engineering Chemistry (3 Credits)
- 24ES101: Problem Solving & Python Programming (3 Credits)
- 24EC201: Basic Circuit Theory & Networks (4 Credits)

SEMESTER III:
- 24MA302: Linear Algebra & Complex Analysis (4 Credits)
- 24EC301: Electronic Devices & Semiconductor Theory (3 Credits)
- 24EC302: Digital Electronics & Logic Design (3 Credits)
- 24EC303: Signals and Systems (4 Credits)
- 24EC304: Electromagnetic Fields & Waves (3 Credits)

SEMESTER IV:
- 24EC401: Analog Integrated Circuits & Op-Amps (4 Credits)
- 24EC402: Microprocessors & Microcontrollers (4 Credits)
- 24EC403: Principles of Digital Communication (4 Credits)
- 24EC404: Transmission Lines & Waveguides (3 Credits)`;
      }
      if (dept === 'MECH') {
        return `REGULATIONS 2024 - MECHANICAL ENGINEERING
CURRICULUM & SYLLABUS OUTLINE (SEMESTERS I - IV)

SEMESTER I & II (Engineering Core):
- 24MA101: Engineering Mathematics I (4 Credits)
- 24PH101: Engineering Physics (3 Credits)
- 24CH101: Engineering Chemistry (3 Credits)
- 24ME201: Engineering Mechanics (4 Credits)
- 24ME202: Basic Electrical & Electronics Engineering (3 Credits)

SEMESTER III:
- 24MA303: Transforms & Partial Differential Equations (4)
- 24ME301: Engineering Thermodynamics (4 Credits)
- 24ME302: Mechanics of Solids & Materials (3 Credits)
- 24ME303: Fluid Mechanics and Machinery (3 Credits)
- 24ME304: Manufacturing Processes & Tooling (3 Credits)

SEMESTER IV:
- 24ME401: Kinematics and Dynamics of Machinery (4 Credits)
- 24ME402: Thermal Engineering & Heat Engines (4 Credits)
- 24ME403: Metrology and Computer-Aided Inspection (3 Credits)
- 24ME404: Computer Aided Design & CAD/CAM (4 Credits)`;
      }
    }

    if (category === 'timetable') {
      return `WEEKLY LECTURE TIMETABLE - DEPARTMENT OF ${dept}
Academic Session: Odd Semester 2026-27

Hour 1 (09:00 AM - 10:00 AM) | Hour 2 (10:00 AM - 11:00 AM) | Hour 3 (11:15 AM - 12:15 PM) | Hour 4 (01:30 PM - 02:30 PM) | Hour 5 (02:30 PM - 03:30 PM)

MONDAY:
- Hour 1: Engineering Mathematics
- Hour 2: Core Department Theory
- Hour 3: Professional Communication
- Hour 4 & 5: Practical Laboratory (Batch A)

TUESDAY:
- Hour 1: Core Department Theory
- Hour 2: Environmental Sciences
- Hour 3: Seminar Presentation
- Hour 4 & 5: Library / Mentor Advisory Session

WEDNESDAY:
- Hour 1: Engineering Mathematics
- Hour 2: Humanities / Heritage Study
- Hour 3: Core Department Theory
- Hour 4 & 5: Practical Laboratory (Batch B)

THURSDAY:
- Hour 1: Core Department Theory
- Hour 2: Technical Seminar / GDG Session
- Hour 3: Engineering Mathematics
- Hour 4 & 5: Placement & Aptitude Training

FRIDAY:
- Hour 1: Core Department Theory
- Hour 2: Humanities / Heritage Study
- Hour 3: Open Elective Forum
- Hour 4 & 5: Sports / Club Activity Hour`;
    }

    if (category === 'notes') {
      if (dept === 'CSE') {
        return `LECTURE NOTES - PYTHON PROGRAMMING (24ES101)
UNIT I: COMPUTATIONAL THINKING & ALGORITHMS

1. Introduction to Algorithms:
- An algorithm is a step-by-step procedure to solve a given problem.
- Key properties: Finiteness, Definiteness, Input, Output, Effectiveness.
- Representation: Pseudo-code (structured text), Flowcharts (graphical).

2. Control Flow Constructs:
- Sequential: Executes statements one after the other.
- Selection (Conditional): Branching based on true/false conditions (if-else).
- Iteration (Looping): Repeating a block of code (for, while).

3. Python Basics:
- Dynamic typing: Variable type is inferred at runtime.
- Indentation: Used to define code blocks instead of curly braces.`;
      }
      if (dept === 'IT') {
        return `LECTURE NOTES - DATABASE SYSTEMS (24IT401)
UNIT I: INTRODUCTION TO DATABASES & ER MODEL

1. File Systems vs. DBMS:
- File Systems suffer from data redundancy and inconsistency.
- DBMS provides data independence, data integrity, and concurrent access.

2. Three-Schema Architecture:
- External Level: User view of the database.
- Conceptual Level: Logical structure of the database (tables, relationships).
- Internal Level: Physical storage layout and indexing structures.

3. Entity-Relationship (ER) Model:
- Entity: Object or concept in the real world.
- Attribute: Property or characteristic of an entity.
- Relationship: Association among several entities.`;
      }
      if (dept === 'ECE') {
        return `LECTURE NOTES - BASIC CIRCUIT THEORY (24EC201)
UNIT I: CIRCUIT VARIABLES & BASIC LAWS

1. Electrical Charge and Current:
- Current is the rate of flow of charge (I = dq/dt), measured in Amperes.
- Voltage is the energy per unit charge (V = dw/dq), measured in Volts.

2. Ohm's Law:
- Voltage across a conductor is proportional to current flowing through it (V = IR).
- R is resistance, measured in Ohms.

3. Kirchhoff's Laws:
- Kirchhoff's Current Law (KCL): Sum of currents entering a node equals sum of currents leaving.
- Kirchhoff's Voltage Law (KVL): Algebraic sum of voltages around a closed loop is zero.`;
      }
      if (dept === 'MECH') {
        return `LECTURE NOTES - THERMODYNAMICS (24ME301)
UNIT I: BASIC CONCEPTS & SYSTEM PROPERTIES

1. Thermodynamic Systems:
- Closed System: Energy crosses boundary, mass does not.
- Open System: Both mass and energy cross boundaries.
- Isolated System: Neither mass nor energy crosses boundary.

2. State and Equilibrium:
- A system is in thermodynamic equilibrium when properties (P, V, T) do not change over time.
- State is the condition of a system as described by its properties.

3. Zeroth Law of Thermodynamics:
- If two systems are in thermal equilibrium with a third system, they are in thermal equilibrium with each other.`;
      }
    }
    
    return `STUDY RESOURCE DOCUMENT
Document: ${title}
Category: ${category.toUpperCase()}
Department: ${dept}

Welcome freshman! Please refer to the syllabus guidelines.`;
  };

  const downloadPDFFile = (title, category, dept) => {
    const textContent = getDocumentContent(dept, category, title);
    
    // A minimal valid PDF v1.4 structure
    const pdfData = [
      '%PDF-1.4',
      '1 0 obj',
      '<< /Type /Catalog /Pages 2 0 R >>',
      'endobj',
      '2 0 obj',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      'endobj',
      '3 0 obj',
      '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>',
      'endobj',
      '4 0 obj',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      'endobj',
      '5 0 obj',
      `<< /Length ${150 + textContent.length * 2} >>`,
      'stream',
      'BT',
      '/F1 11 Tf',
      '40 800 Td',
      '14 TL',
      `(UNIVERSITY ACADEMICS PORTAL - DEPT OF ${dept.toUpperCase()}) Tj T*`,
      `(Document: ${title.toUpperCase()}) Tj T*`,
      `(Category: ${category.toUpperCase()} | Date: Odd Sem 2026) Tj T*`,
      '() Tj T*',
      '------------------------------------------------------------------------------------------------------ Tj T*',
      '() Tj T*',
      ...textContent.split('\n').map(line => `(${line.replace(/[()]/g, '\\$&')}) Tj T*`),
      'ET',
      'endstream',
      'endobj',
      'xref',
      '0 6',
      '0000000000 65535 f ',
      'trailer',
      '<< /Size 6 /Root 1 0 R >>',
      '%%EOF'
    ].join('\n');

    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dept}_${category}_${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadMockFile = (res, dept) => {
    if (res.image) {
      setActiveTimetableImage(res.image);
      return;
    }
    if (res.link) {
      window.open(res.link, '_blank');
      return;
    }
    downloadPDFFile(res.title, res.category, dept);
  };
  
  // Upload state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('syllabus');
  const [description, setDescription] = useState('');
  const [resFile, setResFile] = useState(null);
  const [msg, setMsg] = useState(null);

  const loadResources = async () => {
    try {
      const res = await resourcesAPI.getAll();
      setResources(res.data);
    } catch (err) {
      console.error("Failed to load resources", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    if (user && user.department) {
      const deptUpper = user.department.toUpperCase();
      const validDepts = ['IT', 'CSE', 'EEE', 'ECE', 'AIDS', 'ICE', 'CIVIL', 'MBA', 'ENGLISH', 'MECH'];
      if (validDepts.includes(deptUpper)) {
        setSelectedDept(deptUpper);
      } else if (deptUpper === 'AI&DS') {
        setSelectedDept('AIDS');
      }
    }
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resFile) return;

    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('category', category);
      fd.append('description', description);
      fd.append('file', resFile);

      await resourcesAPI.upload(fd);
      setMsg({ type: 'success', text: 'Resource uploaded successfully!' });
      setTitle('');
      setDescription('');
      setResFile(null);
      loadResources();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Upload failed.' });
    }
  };

  const uploadBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '/uploads') || 'http://localhost:5000/uploads';

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <span className="badge-gdg mb-2">CAMPUS ARCHIVES</span>
        <h2 className="fw-bold text-dark">{t('resources_title')}</h2>
        <p className="text-secondary">{t('resources_sub')}</p>
      </div>

      <div className="row g-4">
        {/* Resource List */}
        <div className="col-lg-8">
          <div className="glass-card p-4 bg-white border-0">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 border-bottom pb-3">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2"><FaFolderOpen /> Available Archives</h5>
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small fw-semibold">Filter Department:</span>
                <select 
                  className="form-select bg-light border p-2 small text-dark fw-bold rounded-3" 
                  style={{ width: '130px' }}
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="IT">IT</option>
                  <option value="CSE">CSE</option>
                  <option value="EEE">EEE</option>
                  <option value="ECE">ECE</option>
                  <option value="AIDS">AIDS</option>
                  <option value="ICE">ICE</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="MBA">MBA</option>
                  <option value="ENGLISH">ENGLISH</option>
                  <option value="MECH">MECH</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                
                {/* Section A: Core Department Resources */}
                <div>
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                    🏫 Core Academic Files ({selectedDept})
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {defaultResources[selectedDept]?.map((res) => (
                      <div key={res.id} className="p-3 bg-light rounded-4 border d-flex align-items-center justify-content-between bg-white animate-fade-in">
                        <div className="d-flex align-items-center gap-3">
                          <div className={`p-3 bg-white rounded-3 border d-flex align-items-center justify-content-center ${res.links ? 'text-danger border-danger-subtle' : 'text-danger'}`}>
                            {res.links ? <FaYoutube size={24} /> : <FaFilePdf size={24} />}
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem' }}>{res.title}</h6>
                            <span className="badge bg-light text-secondary border me-2 text-capitalize" style={{ fontSize: '0.65rem' }}>{res.category}</span>
                            <span className="text-muted small d-block mb-1" style={{ fontSize: '0.75rem' }}>{res.description}</span>
                            {res.links && (
                              <div className="d-flex flex-wrap gap-2 mt-2">
                                {res.links.map((lnk, lIdx) => (
                                  <a
                                    key={lIdx}
                                    href={lnk.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-light border py-1 px-2.5 rounded-pill text-danger fw-bold d-inline-flex align-items-center gap-1.5 hover-bg-light shadow-sm"
                                    style={{ fontSize: '0.7rem' }}
                                  >
                                    <FaYoutube className="text-danger" size={12} /> {lnk.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {!res.links && (
                          <button
                            type="button"
                            onClick={() => downloadMockFile(res, selectedDept)}
                            className="btn btn-outline-primary p-3 rounded-circle border-0 bg-white d-flex align-items-center justify-content-center shadow-sm hover-shadow-md transition-all"
                            title={res.image ? "View Timetable Image" : res.link ? "View/Download Google Drive Syllabus" : "Download PDF File"}
                          >
                            <FaDownload size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Community Uploads */}
                <div className="border-top pt-4">
                  <h6 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                    📤 Student Shared Archives
                  </h6>
                  {resources.length === 0 ? (
                    <div className="text-center py-4 bg-light bg-opacity-50 rounded-4 border text-secondary small">
                      No student contributions uploaded yet. Be the first to upload lecture notes or materials on the right!
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {resources.map((res, i) => (
                        <div key={i} className="p-3 bg-light rounded-4 border d-flex align-items-center justify-content-between bg-white">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-white rounded-3 border text-danger d-flex align-items-center justify-content-center">
                              <FaFilePdf size={24} />
                            </div>
                            <div>
                              <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem' }}>{res.title}</h6>
                              <span className="badge bg-light text-primary border me-2 text-capitalize" style={{ fontSize: '0.65rem' }}>{res.category}</span>
                              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{res.description}</span>
                            </div>
                          </div>
                          
                          <a
                            href={`${uploadBaseUrl}/resources/${res.file_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-primary p-3 rounded-circle border-0 bg-white d-flex align-items-center justify-content-center shadow-sm"
                            title="Download PDF"
                          >
                            <FaDownload size={13} />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Upload panel */}
        <div className="col-lg-4">
          <div className="glass-card p-4 bg-white border-0">
            <h5 className="fw-bold text-dark mb-3"><FaUpload /> Contribute File</h5>
            
            {msg && <div className={`alert alert-${msg.type} rounded-3 small`}>{msg.text}</div>}

            {!isAuthenticated ? (
              <div className="text-center py-4 bg-light rounded-4 border small">
                <FaInfoCircle className="text-secondary mb-2 fs-4" />
                <p className="text-secondary mb-0">Please sign in to upload files or documents to this resources page.</p>
              </div>
            ) : (
              <form onSubmit={handleUpload}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Document Title</label>
                  <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Category</label>
                  <select className="form-select bg-light border-0 p-3 small text-dark" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="syllabus">Syllabus</option>
                    <option value="references">References</option>
                    <option value="timetable">Timetable</option>
                    <option value="circular">Circular</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Description</label>
                  <textarea className="form-control bg-light border-0 p-3 small text-dark" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">Select PDF File</label>
                  <input type="file" className="form-control bg-light border-0 p-3 small text-dark" accept=".pdf" onChange={(e) => setResFile(e.target.files[0])} required />
                </div>
                <button type="submit" className="btn btn-gradient w-100 py-3 shadow-none">Upload Resource</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* -------------------- Academic Planner Section -------------------- */}
      <div className="mt-5 border-top pt-5">
        <div className="text-center mb-5 animate-fade-in">
          <span className="badge bg-primary-subtle text-primary border rounded-pill px-3 py-1.5 fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Saranathan College of Engineering</span>
          <h3 className="fw-bold text-dark mt-2 mb-1">📅 Academic Planner — Odd Semester 2026-27</h3>
          <p className="text-secondary small">Autonomous Odd Semester Calendar Overview (Except First Year Students)</p>
        </div>

        <div className="glass-card p-4 bg-white border-0 shadow-sm rounded-4 animate-fade-in">
          
          {/* Monthly Tab Swapper */}
          <div className="d-flex flex-wrap gap-2 justify-content-center mb-4 border-bottom pb-3">
            {academicPlannerData.map((m) => (
              <button
                key={m.month}
                onClick={() => {
                  setActivePlannerMonth(m.month);
                  setPlannerFilter('all');
                }}
                className={`btn btn-sm px-4 py-2.5 rounded-pill fw-bold transition-all ${
                  activePlannerMonth === m.month
                    ? 'btn-primary shadow-sm'
                    : 'btn-outline-secondary border-2 bg-transparent text-secondary'
                }`}
                style={{ fontSize: '0.8rem' }}
              >
                {m.month}
              </button>
            ))}
          </div>

          {/* Monthly Info / Stats */}
          {(() => {
            const currentMonthObj = academicPlannerData.find(m => m.month === activePlannerMonth);
            const eventsList = currentMonthObj ? currentMonthObj.events : [];
            const filteredEvents = eventsList.filter(e => {
              if (plannerFilter === 'all') return true;
              return e.type === plannerFilter;
            });

            return (
              <div>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-4 border text-center">
                      <span className="text-muted small d-block mb-1">📆 Monthly Working Days</span>
                      <strong className="fs-4 text-dark">{currentMonthObj?.workingDays} days</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-4 border text-center">
                      <span className="text-muted small d-block mb-1">🎯 Scheduled Events</span>
                      <strong className="fs-4 text-dark">{eventsList.length} events</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-4 border text-center">
                      <span className="text-muted small d-block mb-1">🏁 Semester Progress</span>
                      <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                        <strong className="fs-5 text-dark">77 Days Total</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start mb-4">
                  {[
                    { id: 'all', label: 'All Dates' },
                    { id: 'exam', label: '📝 Exams & Assessments' },
                    { id: 'holiday', label: '🎉 Holidays' },
                    { id: 'milestone', label: '🚀 Key Milestones' },
                    { id: 'academic', label: '🏫 Academic Events' }
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => setPlannerFilter(chip.id)}
                      className={`btn btn-sm px-3 py-1.5 rounded-pill border fw-semibold small transition-all ${
                        plannerFilter === chip.id
                          ? 'bg-dark text-white border-dark shadow-sm'
                          : 'bg-light text-secondary border-light-subtle'
                      }`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Event Schedule Display */}
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-4 border text-secondary small">
                    No scheduled events match the active filter criteria for this month.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2.5">
                    {filteredEvents.map((evt, idx) => (
                      <div key={idx} className="p-3 rounded-4 border bg-white d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 hover-shadow-sm transition-all animate-fade-in">
                        <div className="d-flex align-items-center gap-3">
                          {/* Calendar Badge Icon */}
                          <div className="p-2.5 rounded-3 text-center fw-bold d-flex flex-column align-items-center justify-content-center shadow-none"
                            style={{
                              width: '56px',
                              backgroundColor: evt.type === 'holiday' ? '#E8F5E9' : evt.type === 'exam' ? '#FFEBEE' : evt.type === 'milestone' ? '#F3E5F5' : '#E3F2FD',
                              color: evt.type === 'holiday' ? '#2E7D32' : evt.type === 'exam' ? '#C62828' : evt.type === 'milestone' ? '#6A1B9A' : '#1565C0',
                              fontSize: '0.7rem',
                              lineHeight: '1.2'
                            }}
                          >
                            <span>DATE</span>
                            <span className="fs-6 mt-0.5">{evt.date.split(' ')[1]}</span>
                          </div>

                          <div>
                            <span className="text-dark fw-bold d-block" style={{ fontSize: '0.85rem' }}>{evt.details}</span>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Scheduled: {evt.date}</span>
                              {evt.dayOrder && (
                                <span className="badge bg-secondary-subtle text-secondary border" style={{ fontSize: '0.65rem' }}>Day Order: {evt.dayOrder}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Event Category Tag */}
                        <div>
                          <span className="badge rounded-pill border py-1.5 px-3 fw-bold text-uppercase"
                            style={{
                              fontSize: '0.65rem',
                              backgroundColor: evt.type === 'holiday' ? '#E8F5E9' : evt.type === 'exam' ? '#FFEBEE' : evt.type === 'milestone' ? '#F3E5F5' : '#E3F2FD',
                              color: evt.type === 'holiday' ? '#2E7D32' : evt.type === 'exam' ? '#C62828' : evt.type === 'milestone' ? '#6A1B9A' : '#1565C0',
                              borderColor: evt.type === 'holiday' ? '#C8E6C9' : evt.type === 'exam' ? '#FFCDD2' : evt.type === 'milestone' ? '#E1BEE7' : '#BBDEFB'
                            }}
                          >
                            {evt.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
      {/* Timetable Lightbox Modal */}
      {activeTimetableImage && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 bg-dark text-white overflow-hidden shadow-lg">
              <div className="modal-header border-0 d-flex justify-content-between align-items-center p-3 text-white">
                <h6 className="modal-title fw-bold">📅 Academic Timetable View</h6>
                <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setActiveTimetableImage(null)}></button>
              </div>
              <div className="modal-body p-1 text-center bg-black d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <img 
                  src={activeTimetableImage} 
                  alt="Department Timetable" 
                  className="img-fluid rounded-2 shadow-sm"
                  style={{ maxHeight: '75vh', objectFit: 'contain' }}
                />
              </div>
              <div className="modal-footer border-0 bg-dark p-3 d-flex justify-content-between align-items-center">
                <a 
                  href={activeTimetableImage} 
                  download 
                  className="btn btn-primary px-4 py-2 rounded-pill fw-bold small d-flex align-items-center gap-2"
                >
                  <FaDownload size={12} /> Download Original Image
                </a>
                <button type="button" className="btn btn-outline-light px-4 py-2 rounded-pill small" onClick={() => setActiveTimetableImage(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
