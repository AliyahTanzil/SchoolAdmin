import React from 'react';

const recoveryMethods = [
  { method: 'email', icon: '📧', label: 'Email', description: 'Send reset link to email' },
  { method: 'sms', icon: '📱', label: 'SMS', description: 'Send code via text message' },
  { method: 'security_questions', icon: '❓', label: 'Security Questions', description: 'Answer security questions' }
];

export default function RecoveryMethodSelector({ selectedMethod, onMethodChange }) {
  return (
    <div className="recovery-method-selector">
      <h3 className="recovery-method-title">How would you like to reset your password?</h3>
      <div className="recovery-method-grid">
        {recoveryMethods.map(({ method, icon, label, description }) => (
          <button
            key={method}
            type="button"
            onClick={() => onMethodChange(method)}
            className={`recovery-method-card ${selectedMethod === method ? 'recovery-method-card-selected' : ''}`}
          >
            <div className="recovery-method-icon">{icon}</div>
            <div className="recovery-method-info">
              <div className="recovery-method-label">{label}</div>
              <div className="recovery-method-description">{description}</div>
            </div>
            {selectedMethod === method && <div className="recovery-method-check">✓</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
