import React from 'react';

const accountTypes = [
  { type: 'student', icon: '👨‍🎓', label: 'Student', description: 'I am a student' },
  { type: 'teacher', icon: '👨‍🏫', label: 'Teacher', description: 'I am a teacher' },
  { type: 'staff', icon: '👨‍💼', label: 'Staff', description: 'I am a staff member' },
  { type: 'parent', icon: '👪', label: 'Parent', description: 'I am a parent' }
];

export default function AccountTypeSelector({ selectedType, onTypeChange }) {
  return (
    <div className="account-type-selector">
      <h3 className="account-type-title">Select Account Type</h3>
      <div className="account-type-grid">
        {accountTypes.map(({ type, icon, label, description }) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`account-type-card ${selectedType === type ? 'account-type-card-selected' : ''}`}
          >
            <div className="account-type-icon">{icon}</div>
            <div className="account-type-info">
              <div className="account-type-label">{label}</div>
              <div className="account-type-description">{description}</div>
            </div>
            {selectedType === type && <div className="account-type-check">✓</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
