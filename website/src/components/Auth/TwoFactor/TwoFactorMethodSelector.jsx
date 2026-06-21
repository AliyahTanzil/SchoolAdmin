import React from 'react';

const twoFactorMethods = [
  { method: 'authenticator', icon: '📱', label: 'Authenticator App', description: 'Use Google Authenticator, Authy, or similar', recommended: true },
  { method: 'sms', icon: '💬', label: 'SMS', description: 'Receive codes via text message' },
  { method: 'email', icon: '📧', label: 'Email', description: 'Receive codes via email' },
  { method: 'hardware_token', icon: '🔑', label: 'Hardware Token', description: 'Use a physical security key' }
];

export default function TwoFactorMethodSelector({ selectedMethod, onMethodChange }) {
  return (
    <div className="two-factor-method-selector">
      <h3 className="two-factor-title">Select your preferred 2FA method</h3>
      <div className="two-factor-method-grid">
        {twoFactorMethods.map(({ method, icon, label, description, recommended }) => (
          <button
            key={method}
            type="button"
            onClick={() => onMethodChange(method)}
            className={`two-factor-method-card ${selectedMethod === method ? 'two-factor-method-card-selected' : ''}`}
          >
            <div className="two-factor-method-icon">{icon}</div>
            <div className="two-factor-method-info">
              <div className="two-factor-method-label">
                {label}
                {recommended && <span className="recommended-badge">Recommended</span>}
              </div>
              <div className="two-factor-method-description">{description}</div>
            </div>
            {selectedMethod === method && <div className="two-factor-method-check">✓</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
