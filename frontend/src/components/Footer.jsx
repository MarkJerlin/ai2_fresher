import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaGithub, FaGlobe, FaGoogle } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-5">
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4">
            <h5 className="fw-bold d-flex align-items-center mb-3">
              <span className="me-2 text-gradient">🎓</span> AI Freshers Connect
            </h5>
            <p className="text-secondary small">
              A comprehensive student gateway crafted for freshers entering campus life. Supported by Google Developer Groups (GDG) On Campus to empower learning and foster innovation.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="https://gdg.community.dev" className="text-muted hover-text-primary" target="_blank" rel="noreferrer"><FaGoogle /></a>
              <a href="https://github.com" className="text-muted hover-text-dark" target="_blank" rel="noreferrer"><FaGithub /></a>
              <a href="https://google.com" className="text-muted hover-text-primary" target="_blank" rel="noreferrer"><FaGlobe /></a>
            </div>
          </div>
          
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark mb-3">Portal Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/party" className="text-muted text-decoration-none hover-underline">Welcome Party</Link></li>
              <li><Link to="/departments" className="text-muted text-decoration-none hover-underline">Departments</Link></li>
              <li><Link to="/faculty" className="text-muted text-decoration-none hover-underline">Faculty Advisor</Link></li>
              <li><Link to="/clubs" className="text-muted text-decoration-none hover-underline">Campus Clubs</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark mb-3">Resources</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/resources" className="text-muted text-decoration-none hover-underline">Timetable & Syllabus</Link></li>
              <li><Link to="/map" className="text-muted text-decoration-none hover-underline">Interactive Map</Link></li>
              <li><Link to="/#faq" className="text-muted text-decoration-none hover-underline">FAQ & Helpdesk</Link></li>
              <li><Link to="/#contact" className="text-muted text-decoration-none hover-underline">Contact Office</Link></li>
            </ul>
          </div>

          <div className="col-md-4 col-lg-3">
            <h6 className="fw-bold text-dark mb-3">Need Help?</h6>
            <p className="text-secondary small">
              Ask our smart AI Assistant available at the bottom right of the page for instant college advice.
            </p>
            <span className="badge-gdg d-inline-block">Powered by Google Gemini</span>
          </div>
        </div>

        <hr className="my-4 text-muted opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="text-secondary small mb-0">
            &copy; 2026 AI Freshers Connect Portal. All rights reserved.
          </p>
          <p className="text-secondary small mb-0 d-flex align-items-center gap-1">
            Made with <FaHeart className="text-danger" /> by GDG Campus Ambassador Team.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
