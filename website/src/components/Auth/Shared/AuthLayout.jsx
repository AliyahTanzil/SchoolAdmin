import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, showLogo = true, showFooter = true, className = '' }) {
  return (
    <div className={`auth-layout ${className}`}>
      {showLogo && (
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <img src="/logo.png" alt="SchoolAdmin" className="logo-image" />
            <span className="logo-text">SchoolAdmin</span>
          </Link>
        </div>
      )}
      
      <main className="auth-main">
        {children}
      </main>
      
      {showFooter && (
        <footer className="auth-footer">
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/help">Help Center</Link>
          </div>
          <p className="copyright">© 2024 SchoolAdmin. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}
