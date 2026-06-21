import React from 'react';

export default function AuthCard({ children, title, subtitle, maxWidth = '480px', className = '' }) {
  return (
    <div className={`auth-card-container ${className}`} style={{ maxWidth }}>
      <div className="auth-card">
        {(title || subtitle) && (
          <div className="auth-card-header">
            {title && <h1 className="auth-card-title">{title}</h1>}
            {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="auth-card-body">
          {children}
        </div>
      </div>
    </div>
  );
}
