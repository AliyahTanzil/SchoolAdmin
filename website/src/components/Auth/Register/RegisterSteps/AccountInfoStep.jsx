import React, { useState } from 'react';
import { FormField, PasswordInput, LoadingButton } from '../../Shared';

export default function AccountInfoStep({ formData, onChange, onNext, loading }) {
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const handlePasswordStrengthChange = (strength) => {
    setPasswordStrength(strength);
  };

  const validateStep = () => {
    const errors = {};

    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
    }

    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (passwordStrength < 50) {
      errors.password = 'Password is too weak';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms and conditions';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateStep();
    
    if (Object.keys(errors).length > 0) {
      // Handle errors
      return;
    }
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="register-step">
      <FormField
        label="Full Name"
        name="fullName"
        type="text"
        placeholder="Enter your full name"
        value={formData.fullName || ''}
        onChange={(e) => handleChange('fullName', e.target.value)}
        required
      />

      <FormField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email || ''}
        onChange={(e) => handleChange('email', e.target.value)}
        required
      />

      <FormField
        label="Mobile Number"
        name="mobile"
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={formData.mobile || ''}
        onChange={(e) => handleChange('mobile', e.target.value)}
        required
      />

      <div className="form-field">
        <label className="form-label">Preferred Login Method</label>
        <div className="login-method-options">
          <label className="radio-label">
            <input
              type="radio"
              name="loginMethod"
              value="username"
              checked={formData.loginMethod === 'username'}
              onChange={(e) => handleChange('loginMethod', e.target.value)}
            />
            Username
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="loginMethod"
              value="email"
              checked={formData.loginMethod === 'email'}
              onChange={(e) => handleChange('loginMethod', e.target.value)}
            />
            Email
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="loginMethod"
              value="mobile"
              checked={formData.loginMethod === 'mobile'}
              onChange={(e) => handleChange('loginMethod', e.target.value)}
            />
            Mobile
          </label>
        </div>
      </div>

      {formData.loginMethod === 'username' && (
        <FormField
          label="Create Username"
          name="username"
          type="text"
          placeholder="Choose a username"
          value={formData.username || ''}
          onChange={(e) => handleChange('username', e.target.value)}
          required
        />
      )}

      <PasswordInput
        label="Password"
        name="password"
        value={formData.password || ''}
        onChange={(e) => handleChange('password', e.target.value)}
        showStrength
        onStrengthChange={handlePasswordStrengthChange}
        required
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword || ''}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        required
      />

      <div className="form-field">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.termsAccepted || false}
            onChange={(e) => handleChange('termsAccepted', e.target.checked)}
            className="checkbox-input"
          />
          I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
        </label>
      </div>

      <LoadingButton type="submit" loading={loading} fullWidth>
        Continue
      </LoadingButton>
    </form>
  );
}
