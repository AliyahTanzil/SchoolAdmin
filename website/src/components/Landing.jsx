import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <div className="hero-text-area">
            <h1>Empowering Educators, Inspiring Students</h1>
            <p>SchoolAdmin is the comprehensive digital workspace designed to streamline every aspect of school management, from attendance tracking to teacher coordination and student success.</p>
            <div className="hero-btns">
              <button className="btn-primary-lg" onClick={() => navigate('/dashboard')}>Launch Dashboard</button>
              <button className="btn-outline-white" onClick={() => navigate('/attendance')}>Try Attendance Tracking</button>
            </div>
          </div>
        </div>
      </header>

      <section className="stats-strip">
        <div className="container stats-strip-grid">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Schools Empowered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Active Teachers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1M+</span>
            <span className="stat-label">Students Tracked</span>
          </div>
        </div>
      </section>

      <section className="features-section container" id="features">
        <div className="section-header">
          <span className="section-subtitle">Core Capabilities</span>
          <h2>A Complete SIS Solution</h2>
          <p>Everything you need to manage your institution in one unified platform.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>Student Portfolios</h3>
            <p>Maintain detailed digital records for every student, including academic history, attendance trends, and behavioral notes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
              </svg>
            </div>
            <h3>Smart Attendance</h3>
            <p>Class-aware attendance tracking that takes seconds. Automated reporting for daily, weekly, and monthly trends.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3>Academic Planning</h3>
            <p>Coordinate classes, manage teacher schedules, and track curriculum progress across different grades and subjects.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works bg-secondary">
        <div className="container">
          <div className="section-header">
            <h2>Seamless Integration</h2>
            <p>Get your school up and running in three simple steps.</p>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-num">01</div>
              <h4>Configure Your Data</h4>
              <p>Import or create records for your students and teaching staff.</p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h4>Establish Classes</h4>
              <p>Organize students into classes and assign dedicated teachers.</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h4>Go Live</h4>
              <p>Start tracking attendance and managing academic performance instantly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Experience the Future of Education Management</h2>
            <p>Join the community of modern educators who are spending less time on paperwork and more time on student growth.</p>
            <div className="cta-btns">
              <button className="btn-white-lg" onClick={() => navigate('/dashboard')}>Get Started for Free</button>
              <button className="btn-outline-white-lg">Request a Demo</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
