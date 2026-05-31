import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>SchoolAdmin</h3>
            <p>Modern management for progressive schools.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/students">Students</a></li>
              <li><a href="/attendance">Attendance</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Email: support@schooladmin.com</p>
            <p>Phone: +1 (555) 000-1111</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 SchoolAdmin Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
