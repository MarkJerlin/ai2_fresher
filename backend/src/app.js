const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { verifyToken } = require('./middleware/auth');
const { sendPartyPassEmail } = require('./utils/mailer');

const app = express();

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../uploads/avatars'),
  path.join(__dirname, '../uploads/resources')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Fallback dynamic routers
app.get('/api/events', (req, res) => {
  res.json([
    { id: 1, title: '🚀 GDG 48-Hour Hackathon Kickoff', category: 'party', description: 'Team coding hackathon with mentors from Google!' },
    { id: 2, title: '🤖 AI Studio Workshop', category: 'workshop', description: 'Intro to Gemini API and prompt engineering.' },
    { id: 3, title: '🛸 Drone Flight & Coding Trials', category: 'workshop', description: 'Learn to program quadcopter pathing.' }
  ]);
});

app.get('/api/clubs', (req, res) => {
  res.json([
    { id: 1, name: 'Google Developer Groups (GDG) On Campus', category: 'Technical' },
    { id: 2, name: 'Robotics & IoT Club', category: 'Technical' },
    { id: 3, name: 'Music & Dramatic Arts (MDA)', category: 'Cultural' }
  ]);
});

app.get('/api/departments', (req, res) => {
  res.json([
    { id: 1, name: 'Information Technology', code: 'IT' },
    { id: 2, name: 'Computer Science and Engineering', code: 'CSE' },
    { id: 3, name: 'Electrical and Electronics Engineering', code: 'EEE' },
    { id: 4, name: 'Electronics and Communication Engineering', code: 'ECE' },
    { id: 5, name: 'Artificial Intelligence & Data Science', code: 'AIDS' },
    { id: 6, name: 'Instrumentation and Control Engineering', code: 'ICE' },
    { id: 7, name: 'Civil Engineering', code: 'CIVIL' },
    { id: 8, name: 'Master of Business Administration', code: 'MBA' },
    { id: 9, name: 'English', code: 'ENGLISH' },
    { id: 10, name: 'Mechanical Engineering', code: 'MECH' }
  ]);
});

const partyRegistrations = new Map();

app.get('/api/party/status', verifyToken, (req, res) => {
  const email = req.user.email;
  if (partyRegistrations.has(email)) {
    return res.json({ registered: true, details: partyRegistrations.get(email) });
  }
  res.json({ registered: false });
});

app.post('/api/party/register', verifyToken, async (req, res) => {
  const { food_preference, tshirt_size } = req.body;
  const email = req.user.email;
  const name = req.user.name;

  const regInfo = {
    user_id: req.user.id,
    name,
    email,
    food_preference: food_preference || 'veg',
    tshirt_size: tshirt_size || 'M',
    created_at: new Date()
  };

  partyRegistrations.set(email, regInfo);

  try {
    await sendPartyPassEmail(email, name, food_preference || 'veg', tshirt_size || 'M');
  } catch (err) {
    console.error('Failed to dispatch party pass email:', err.message);
  }

  res.json({ message: 'Successfully registered for Freshers Party Fiesta 2026!', details: regInfo });
});

const djWishlist = new Set(['Alan Walker – Faded', 'Travis Scott – FE!N / Sicko Mode']);

app.get('/api/party/wishlist', (req, res) => {
  res.json({ wishlist: Array.from(djWishlist) });
});

app.post('/api/party/wishlist', verifyToken, (req, res) => {
  const { song } = req.body;
  if (song && song.trim()) {
    djWishlist.add(song);
  }
  res.json({ success: true, wishlist: Array.from(djWishlist) });
});

app.post('/api/clubs/register', verifyToken, async (req, res) => {
  const { clubName } = req.body;
  const email = req.user.email;
  const name = req.user.name;

  const { sendClubRegistrationEmail } = require('./utils/mailer');
  try {
    await sendClubRegistrationEmail(email, name, clubName);
  } catch (err) {
    console.error('Failed to dispatch club registration email:', err.message);
  }

  res.json({ success: true, message: `Successfully registered for ${clubName}!` });
});

app.get('/api/announcements', (req, res) => {
  res.json([
    { id: 1, title: 'Welcome Freshers Batch 2026!', content: 'Orientation week schedule has been posted.', created_at: new Date() }
  ]);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'GDG Connect AI Freshers Portal API Server Running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
