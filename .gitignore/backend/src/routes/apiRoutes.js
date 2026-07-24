const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getEvents,
  createEvent,
  deleteEvent,
  registerForParty,
  getPartyRegistrationStatus,
  getAllPartyRegistrations,
  getFaculty,
  createFaculty,
  deleteFaculty,
  getDepartments,
  getAnnouncements,
  createAnnouncement,
  getClubs,
  getResources,
  uploadResource,
  submitFeedback,
  getFeedbackList
} = require('../controllers/apiController');
const { handleChatMessage, getChatHistory } = require('../controllers/chatController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Multer Storage Configuration
const posterStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/posters')),
  filename: (req, file, cb) => cb(null, `poster-${Date.now()}${path.extname(file.originalname)}`)
});
const uploadPoster = multer({ storage: posterStorage });

const resourceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/resources')),
  filename: (req, file, cb) => cb(null, `resource-${Date.now()}${path.extname(file.originalname)}`)
});
const uploadResourceFile = multer({ storage: resourceStorage });

const facultyStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/faculty')),
  filename: (req, file, cb) => cb(null, `faculty-${Date.now()}${path.extname(file.originalname)}`)
});
const uploadFacultyImg = multer({ storage: facultyStorage });

// ==========================================
// PUBLIC & PROTECTED ROUTES
// ==========================================

// Events
router.get('/events', getEvents);
router.post('/events', verifyAdmin, uploadPoster.single('poster'), createEvent);
router.delete('/events/:id', verifyAdmin, deleteEvent);

// Party Registration
router.post('/party/register', verifyToken, registerForParty);
router.get('/party/status', verifyToken, getPartyRegistrationStatus);
router.get('/party/registrations', verifyAdmin, getAllPartyRegistrations);

// Faculty & Departments
router.get('/faculty', getFaculty);
router.post('/faculty', verifyAdmin, uploadFacultyImg.single('image'), createFaculty);
router.delete('/faculty/:id', verifyAdmin, deleteFaculty);
router.get('/departments', getDepartments);

// Announcements & Clubs
router.get('/announcements', getAnnouncements);
router.post('/announcements', verifyAdmin, createAnnouncement);
router.get('/clubs', getClubs);

// Resources
router.get('/resources', getResources);
router.post('/resources', verifyToken, uploadResourceFile.single('file'), uploadResource);

// Feedback
router.post('/feedback', submitFeedback);
router.get('/feedback', verifyAdmin, getFeedbackList);

// AI Chatbot
router.post('/chat', verifyToken, handleChatMessage);
router.get('/chat/history', verifyToken, getChatHistory);

module.exports = router;
