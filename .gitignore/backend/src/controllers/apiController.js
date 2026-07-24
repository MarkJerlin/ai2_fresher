const db = require('../db');

// ==========================================
// EVENTS CONTROLLERS
// ==========================================
const getEvents = async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, event_time, venue, category, coordinator, contact, max_registrations } = req.body;
    const poster_url = req.file ? req.file.filename : null;

    const [result] = await db.query(
      'INSERT INTO events (title, description, event_date, event_time, venue, poster_url, category, coordinator, contact, max_registrations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, event_date, event_time, venue, poster_url, category, coordinator, contact, max_registrations]
    );

    res.status(201).json({ message: 'Event created successfully!', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM events WHERE id = ?', [id]);
    res.status(200).json({ message: 'Event deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// ==========================================
// PARTY REGISTRATION CONTROLLERS
// ==========================================
const registerForParty = async (req, res) => {
  try {
    const { food_preference, tshirt_size } = req.body;
    const userId = req.user.id;

    // Find the Freshers Fiesta event ID
    const [events] = await db.query("SELECT id FROM events WHERE title LIKE '%Freshers Fiesta%' LIMIT 1");
    if (events.length === 0) {
      return res.status(404).json({ message: 'Freshers Fiesta event not found in database.' });
    }
    const eventId = events[0].id;

    // Check if already registered
    const [existing] = await db.query('SELECT * FROM party_registration WHERE user_id = ? AND event_id = ?', [userId, eventId]);
    if (existing.length > 0) {
      await db.query(
        'UPDATE party_registration SET food_preference = ?, tshirt_size = ? WHERE user_id = ? AND event_id = ?',
        [food_preference || 'veg', tshirt_size || 'M', userId, eventId]
      );
      return res.status(200).json({ message: 'Registration details updated successfully!', qrCode: existing[0].qr_code });
    }

    // Generate unique QR payload: userId-eventId-random
    const qrCode = `QR-FIESTA-${userId}-${eventId}-${Math.floor(1000 + Math.random() * 9000)}`;

    await db.query(
      'INSERT INTO party_registration (user_id, event_id, food_preference, tshirt_size, qr_code) VALUES (?, ?, ?, ?, ?)',
      [userId, eventId, food_preference || 'veg', tshirt_size || 'M', qrCode]
    );

    res.status(201).json({ message: 'Registered successfully!', qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const getPartyRegistrationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const [registrations] = await db.query(
      `SELECT pr.*, e.title, e.event_date, e.event_time, e.venue 
       FROM party_registration pr
       JOIN events e ON pr.event_id = e.id
       WHERE pr.user_id = ? AND e.title LIKE '%Freshers Fiesta%'`,
      [userId]
    );

    if (registrations.length === 0) {
      return res.status(200).json({ registered: false });
    }

    res.status(200).json({ registered: true, details: registrations[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error checking registration status', error: error.message });
  }
};

const getAllPartyRegistrations = async (req, res) => {
  try {
    const [registrations] = await db.query(
      `SELECT pr.*, u.name, u.email, u.roll_no, u.department, e.title 
       FROM party_registration pr
       JOIN users u ON pr.user_id = u.id
       JOIN events e ON pr.event_id = e.id`
    );
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching party registrations', error: error.message });
  }
};

// ==========================================
// FACULTY & DEPARTMENTS CONTROLLERS
// ==========================================
const getFaculty = async (req, res) => {
  try {
    const [faculty] = await db.query(
      `SELECT f.*, d.name AS department_name 
       FROM faculty f
       LEFT JOIN departments d ON f.department_id = d.id`
    );
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving faculty list', error: error.message });
  }
};

const createFaculty = async (req, res) => {
  try {
    const { name, designation, department_id, email, phone, room_no, specialization } = req.body;
    const image_url = req.file ? req.file.filename : 'default_faculty.png';

    const [result] = await db.query(
      'INSERT INTO faculty (name, designation, department_id, email, phone, room_no, specialization, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, designation, department_id, email, phone, room_no, specialization, image_url]
    );

    res.status(201).json({ message: 'Faculty member added successfully!', facultyId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding faculty member', error: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM faculty WHERE id = ?', [id]);
    res.status(200).json({ message: 'Faculty member deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting faculty member', error: error.message });
  }
};

const getDepartments = async (req, res) => {
  try {
    const [departments] = await db.query('SELECT * FROM departments');
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving departments', error: error.message });
  }
};

// ==========================================
// ANNOUNCEMENTS, CLUBS, RESOURCES, FEEDBACK
// ==========================================
const getAnnouncements = async (req, res) => {
  try {
    const [announcements] = await db.query('SELECT * FROM announcements ORDER BY date_posted DESC');
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving announcements', error: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const [result] = await db.query(
      'INSERT INTO announcements (title, content, category) VALUES (?, ?, ?)',
      [title, content, category || 'general']
    );
    res.status(201).json({ message: 'Announcement created!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

const getClubs = async (req, res) => {
  try {
    const [clubs] = await db.query('SELECT * FROM clubs');
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving clubs', error: error.message });
  }
};

const getResources = async (req, res) => {
  try {
    const [resources] = await db.query('SELECT * FROM resources ORDER BY created_at DESC');
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving resources', error: error.message });
  }
};

const uploadResource = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const file_url = req.file ? req.file.filename : null;

    if (!file_url) {
      return res.status(400).json({ message: 'Resource file is required.' });
    }

    const [result] = await db.query(
      'INSERT INTO resources (title, category, file_url, description, uploaded_by) VALUES (?, ?, ?, ?, ?)',
      [title, category, file_url, description, req.user.id]
    );

    res.status(201).json({ message: 'Resource uploaded successfully!', resourceId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resource', error: error.message });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    const userId = req.user ? req.user.id : null;

    await db.query(
      'INSERT INTO feedback (user_id, name, email, message, rating) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, message, rating || 5]
    );

    res.status(201).json({ message: 'Feedback submitted successfully! Thank you!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
};

const getFeedbackList = async (req, res) => {
  try {
    const [feedback] = await db.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving feedback list', error: error.message });
  }
};

module.exports = {
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
};
