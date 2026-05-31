import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-modern">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="badge">New: Attendance v2.0 Released</span>
            <h1>The Intelligent Operating System for <span className="text-gradient">Modern Schools</span></h1>
            <p className="hero-lead">
              Streamline your institution with an all-in-one platform for student success, teacher coordination, and automated attendance tracking.
            </p>
            <div className="hero-actions">
              <button className="btn-gradient" onClick={() => navigate('/dashboard')}>
                Start for Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <button className="btn-secondary-outline" onClick={() => navigate('/attendance')}>
                Live Demo
              </button>
            </div>
            <div className="hero-trust">
              <p>Trusted by 500+ educators worldwide</p>
              <div className="trust-icons">
                {/* Placeholder for trust logos or avatars */}
                <div className="avatar-group">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="avatar-small" style={{ backgroundColor: `hsl(${i * 60}, 70%, 60%)` }}></div>
                  ))}
                  <span className="avatar-plus">+10k</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="browser-mockup">
              <div className="browser-header">
                <div className="dots"><span></span><span></span><span></span></div>
                <div className="address-bar">schooladmin.app/dashboard</div>
              </div>
              <div className="browser-content">
                <img src="/Hero1.png" alt="SchoolAdmin Dashboard Preview" className="mockup-img" />
              </div>
            </div>
            <div className="floating-card stat-card-float">
              <div className="icon-box-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div>
                <span className="float-label">Attendance Rate</span>
                <span className="float-value">98.4%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-modern">
        <div className="container">
          <div className="stats-grid-modern">
            <div className="stat-card-modern">
              <h3>500+</h3>
              <p>Schools Empowered</p>
            </div>
            <div className="stat-card-modern">
              <h3>10k+</h3>
              <p>Active Teachers</p>
            </div>
            <div className="stat-card-modern">
              <h3>1M+</h3>
              <p>Students Tracked</p>
            </div>
            <div className="stat-card-modern">
              <h3>99.9%</h3>
              <p>Platform Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-modern" id="features">
        <div className="container">
          <div className="section-header-centered">
            <span className="tag-line">Core Capabilities</span>
            <h2>Everything you need to <span className="text-gradient">scale success</span></h2>
            <p>Our modular architecture grows with your institution, from single classrooms to entire school districts.</p>
          </div>
          
          <div className="features-grid-modern">
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Student Portfolios</h3>
              <p>Centralized digital records with performance tracking, behavioral insights, and history.</p>
            </div>
            
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3>Smart Attendance</h3>
              <p>Rapid class-aware tracking with automated daily reports and parent notifications.</p>
            </div>
            
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <h3>Academic Planning</h3>
              <p>Dynamic scheduling and curriculum management designed for collaborative teaching.</p>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-wrapper orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              </div>
              <h3>Advanced Analytics</h3>
              <p>Visualize trends and identify students who need extra support with built-in BI tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-modern">
        <div className="container">
          <div className="cta-gradient-box">
            <div className="cta-content">
              <h2>Ready to transform your school?</h2>
              <p>Join thousands of educators who have simplified their administrative workflow.</p>
              <div className="cta-actions">
                <button className="btn-white" onClick={() => navigate('/dashboard')}>Get Started Now</button>
                <button className="btn-outline-transparent">Contact Sales</button>
              </div>
            </div>
            <div className="cta-decoration">
              {/* Abstract decorative elements */}
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
