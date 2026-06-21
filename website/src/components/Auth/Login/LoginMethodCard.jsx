import React from 'react';

const loginMethods = {
  username: { icon: '👤', label: 'Username', description: 'Use your username' },
  email: { icon: '📧', label: 'Email', description: 'Use your email address' },
  mobile: { icon: '📱', label: 'Mobile Number', description: 'Use your mobile number' },
  admission_number: { icon: '🎓', label: 'Admission Number', description: 'Use your admission number' },
  staff_id: { icon: '👨‍🏫', label: 'Staff ID', description: 'Use your staff ID' },
  parent_id: { icon: '👪', label: 'Parent ID', description: 'Use your parent ID' },
  qr_code: { icon: '📷', label: 'QR Code', description: 'Scan QR code to login' }
};

export default function LoginMethodCard({ method, selected, onSelect, disabled = false }) {
  const methodInfo = loginMethods[method] || { icon: '🔑', label: method, description: '' };

  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      disabled={disabled}
      className={`login-method-card ${selected ? 'login-method-card-selected' : ''} ${disabled ? 'login-method-card-disabled' : ''}`}
    >
      <div className="login-method-icon">{methodInfo.icon}</div>
      <div className="login-method-info">
        <div className="login-method-label">{methodInfo.label}</div>
        <div className="login-method-description">{methodInfo.description}</div>
      </div>
      {selected && <div className="login-method-check">✓</div>}
    </button>
  );
}
