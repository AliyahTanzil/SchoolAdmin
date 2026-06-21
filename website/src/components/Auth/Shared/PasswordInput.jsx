import React, { useState } from 'react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

export default function PasswordInput({ 
  name, 
  value, 
  onChange, 
  placeholder = 'Password', 
  error, 
  showStrength = false, 
  onStrengthChange, 
  className = '' 
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`password-input-container ${className}`}>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input password-input ${error ? 'form-input-error' : ''}`}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={togglePassword}
          className="password-toggle"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {error && <span className="form-error">{error}</span>}
      {showStrength && (
        <PasswordStrengthIndicator 
          password={value} 
          onStrengthChange={onStrengthChange} 
        />
      )}
    </div>
  );
}
