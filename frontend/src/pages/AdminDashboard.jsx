import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, facultyAPI, partyAPI, feedbackAPI, announcementsAPI, departmentsAPI } from '../services/api';
import { FaCalendarAlt, FaUserTie, FaQrcode, FaCommentDots, FaTrash, FaPlus, FaTachometerAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('events');

  // Backend data states
  const [events, setEvents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [msg, setMsg] = useState(null);

  // Form states
  const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', event_time: '', venue: '', category: 'cultural', coordinator: '', contact: '', max_registrations: 100 });
  const [eventPoster, setEventPoster] = useState(null);
  const [facultyForm, setFacultyForm] = useState({ name: '', designation: '', department_id: '', email: '', phone: '', room_no: '', specialization: '' });
  const [facultyImg, setFacultyImg] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', category: 'general' });

  const loadData = async () => {
    try {
      const eRes = await eventsAPI.getAll();
      setEvents(eRes.data);

      const fRes = await facultyAPI.getAll();
      setFaculty(fRes.data);

      const dRes = await departmentsAPI.getAll();
      setDepartments(dRes.data);

      const rRes = await partyAPI.getAllRegistrations();
      setRegistrations(rRes.data);

      const feedRes = await feedbackAPI.getAll();
      setFeedback(feedRes.data);
    } catch (err) {
      console.error("Error loading admin dashboard lists", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">Access Denied. You do not have administrator permissions.</div>
      </div>
    );
  }

  // Handle Event submit
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(eventForm).forEach(key => fd.append(key, eventForm[key]));
      if (eventPoster) fd.append('poster', eventPoster);

      await eventsAPI.create(fd);
      setMsg({ type: 'success', text: 'Event created successfully!' });
      setEventForm({ title: '', description: '', event_date: '', event_time: '', venue: '', category: 'cultural', coordinator: '', contact: '', max_registrations: 100 });
      setEventPoster(null);
      loadData();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Error creating event.' });
    }
  };

  // Handle Faculty submit
  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(facultyForm).forEach(key => fd.append(key, facultyForm[key]));
      if (facultyImg) fd.append('image', facultyImg);

      await facultyAPI.create(fd);
      setMsg({ type: 'success', text: 'Faculty member added successfully!' });
      setFacultyForm({ name: '', designation: '', department_id: '', email: '', phone: '', room_no: '', specialization: '' });
      setFacultyImg(null);
      loadData();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Error adding faculty member.' });
    }
  };

  // Handle Announcement submit
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      await announcementsAPI.create(announcementForm);
      setMsg({ type: 'success', text: 'Announcement broadcasted!' });
      setAnnouncementForm({ title: '', content: '', category: 'general' });
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Error creating announcement.' });
    }
  };

  const handleEventDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await eventsAPI.delete(id);
      loadData();
    }
  };

  const handleFacultyDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      await facultyAPI.delete(id);
      loadData();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-0">Admin Connect Portal</h2>
          <span className="text-muted small">GDG Ambassador Command Panel</span>
        </div>
        <div className="d-flex gap-3">
          <div className="p-3 bg-light rounded-3 border text-center">
            <span className="text-muted d-block small" style={{ fontSize: '0.65rem' }}>TOTAL FIESTA RSVPS</span>
            <strong className="text-dark fs-5">{registrations.length}</strong>
          </div>
        </div>
      </div>

      {msg && <div className={`alert alert-${msg.type} rounded-3 small`}>{msg.text}</div>}

      <div className="row g-4">
        {/* Navigation */}
        <div className="col-lg-3">
          <div className="glass-card p-3 bg-white border-0">
            <div className="d-flex flex-column gap-1">
              {[
                { id: 'events', name: 'Manage Events', icon: <FaCalendarAlt /> },
                { id: 'faculty', name: 'Manage Faculty', icon: <FaUserTie /> },
                { id: 'party', name: 'Party Registrations', icon: <FaQrcode /> },
                { id: 'announcements', name: 'Broadcast Notice', icon: <FaTachometerAlt /> },
                { id: 'feedback', name: 'User Feedback', icon: <FaCommentDots /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMsg(null); }}
                  className={`btn text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 transition ${activeTab === tab.id ? 'bg-primary text-white' : 'text-secondary hover-bg-light'}`}
                  style={{ fontSize: '0.9rem', fontWeight: 500 }}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="col-lg-9">
          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="d-flex flex-column gap-4">
              <div className="glass-card p-4 bg-white border-0">
                <h5 className="fw-bold text-dark mb-3"><FaPlus /> Add New Campus Event</h5>
                <form onSubmit={handleEventSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Event Title</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold text-secondary">Event Date</label>
                      <input type="date" className="form-control bg-light border-0 p-3 small text-dark" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold text-secondary">Event Time</label>
                      <input type="time" className="form-control bg-light border-0 p-3 small text-dark" value={eventForm.event_time} onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Venue</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold text-secondary">Category</label>
                      <select className="form-select bg-light border-0 p-3 small text-dark" value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}>
                        <option value="cultural">Cultural</option>
                        <option value="academic">Academic</option>
                        <option value="sports">Sports</option>
                        <option value="workshop">Workshop</option>
                        <option value="party">Party</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold text-secondary">Max Capacity</label>
                      <input type="number" className="form-control bg-light border-0 p-3 small text-dark" value={eventForm.max_registrations} onChange={(e) => setEventForm({ ...eventForm, max_registrations: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Coordinator Name</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={eventForm.coordinator} onChange={(e) => setEventForm({ ...eventForm, coordinator: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Contact Number</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={eventForm.contact} onChange={(e) => setEventForm({ ...eventForm, contact: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Event Description</label>
                      <textarea className="form-control bg-light border-0 p-3 small text-dark" rows="3" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Upload Event Poster Image</label>
                      <input type="file" className="form-control bg-light border-0 p-3 small text-dark" accept="image/*" onChange={(e) => setEventPoster(e.target.files[0])} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-gradient py-3 px-5 rounded-pill mt-4 shadow-none">Publish Event</button>
                </form>
              </div>

              {/* Event Lists */}
              <div className="glass-card p-4 bg-white border-0">
                <h5 className="fw-bold text-dark mb-3">Published Campus Events</h5>
                <div className="table-responsive">
                  <table className="table align-middle text-dark">
                    <thead className="table-light">
                      <tr className="small text-secondary">
                        <th>Title</th>
                        <th>Date & Time</th>
                        <th>Venue</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {events.map((e, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold">{e.title}</td>
                          <td>{e.event_date.split('T')[0]} @ {e.event_time}</td>
                          <td>{e.venue}</td>
                          <td><span className="badge bg-light text-primary border text-capitalize">{e.category}</span></td>
                          <td>
                            <button onClick={() => handleEventDelete(e.id)} className="btn btn-link text-danger p-0 shadow-none"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FACULTY TAB */}
          {activeTab === 'faculty' && (
            <div className="d-flex flex-column gap-4">
              <div className="glass-card p-4 bg-white border-0">
                <h5 className="fw-bold text-dark mb-3"><FaPlus /> Add Faculty Advisor</h5>
                <form onSubmit={handleFacultySubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Full Name</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Designation</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={facultyForm.designation} onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })} placeholder="e.g. Professor / Dean" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Academic Department</label>
                      <select className="form-select bg-light border-0 p-3 small text-dark" value={facultyForm.department_id} onChange={(e) => setFacultyForm({ ...facultyForm, department_id: e.target.value })} required>
                        <option value="">Select Branch</option>
                        {departments.map((dept, i) => (
                          <option key={i} value={dept.id}>{dept.name} ({dept.code})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Email Address</label>
                      <input type="email" className="form-control bg-light border-0 p-3 small text-dark" value={facultyForm.email} onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Office Room Number</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={facultyForm.room_no} onChange={(e) => setFacultyForm({ ...facultyForm, room_no: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Phone Ext</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={facultyForm.phone} onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Specialization</label>
                      <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={facultyForm.specialization} onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Upload Faculty Image</label>
                      <input type="file" className="form-control bg-light border-0 p-3 small text-dark" accept="image/*" onChange={(e) => setFacultyImg(e.target.files[0])} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-gradient py-3 px-5 rounded-pill mt-4 shadow-none">Save Faculty Member</button>
                </form>
              </div>

              {/* Faculty List */}
              <div className="glass-card p-4 bg-white border-0">
                <h5 className="fw-bold text-dark mb-3">Department Faculty List</h5>
                <div className="table-responsive">
                  <table className="table align-middle text-dark">
                    <thead className="table-light">
                      <tr className="small text-secondary">
                        <th>Advisor Name</th>
                        <th>Role / Designation</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {faculty.map((f, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold">{f.name}</td>
                          <td>{f.designation}</td>
                          <td>{f.department_name}</td>
                          <td>{f.email}</td>
                          <td>
                            <button onClick={() => handleFacultyDelete(f.id)} className="btn btn-link text-danger p-0 shadow-none"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FIESTA RSVPS TAB */}
          {activeTab === 'party' && (
            <div className="glass-card p-4 bg-white border-0">
              <h5 className="fw-bold text-dark mb-3">Freshers Fiesta 2026 Registrations</h5>
              <div className="table-responsive">
                <table className="table align-middle text-dark">
                  <thead className="table-light">
                    <tr className="small text-secondary">
                      <th>Student Name</th>
                      <th>Roll Number</th>
                      <th>Email Address</th>
                      <th>Food Choice</th>
                      <th>T-Shirt</th>
                      <th>Entrance QR Code</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {registrations.map((r, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{r.name}</td>
                        <td>{r.roll_no || 'Pending'}</td>
                        <td>{r.email}</td>
                        <td className="text-capitalize">{r.food_preference}</td>
                        <td><span className="badge bg-dark text-white">{r.tshirt_size}</span></td>
                        <td className="font-monospace small text-primary">{r.qr_code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BROADCAST TAB */}
          {activeTab === 'announcements' && (
            <div className="glass-card p-4 bg-white border-0">
              <h5 className="fw-bold text-dark mb-3">Broadcast Notice Board Announcement</h5>
              <form onSubmit={handleAnnouncementSubmit}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label small fw-semibold text-secondary">Notice Title</label>
                    <input type="text" className="form-control bg-light border-0 p-3 small text-dark" value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Notice Category</label>
                    <select className="form-select bg-light border-0 p-3 small text-dark" value={announcementForm.category} onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}>
                      <option value="academic">Academic</option>
                      <option value="events">Events</option>
                      <option value="exam">Exam</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Notice Content</label>
                    <textarea className="form-control bg-light border-0 p-3 small text-dark" rows="4" value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} required></textarea>
                  </div>
                </div>
                <button type="submit" className="btn btn-gradient py-3 px-5 rounded-pill mt-4 shadow-none">Broadcast Notice</button>
              </form>
            </div>
          )}

          {/* FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <div className="glass-card p-4 bg-white border-0">
              <h5 className="fw-bold text-dark mb-3">Submitted User Feedback</h5>
              <div className="d-flex flex-column gap-3">
                {feedback.map((f, idx) => (
                  <div key={idx} className="p-3 bg-light rounded-3 border">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <strong className="text-dark">{f.name} ({f.email})</strong>
                      <span className="badge bg-warning text-dark">Rating: {f.rating}/5</span>
                    </div>
                    <p className="text-secondary small mb-0">{f.message}</p>
                    <span className="text-muted d-block mt-2" style={{ fontSize: '0.65rem' }}>{new Date(f.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
