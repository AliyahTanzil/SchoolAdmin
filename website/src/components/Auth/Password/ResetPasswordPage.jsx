import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthLayout, AuthCard, PasswordInput, LoadingButton } from '../Shared';
import { usePasswordReset } from '../../../hooks/auth/usePasswordReset';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState('');

  const { resetPassword, loading } = usePasswordReset();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (strength < 50) {
      setError('Password is too weak');
      return;
    }

    try {
      await resetPassword(token, password);
      navigate('/auth/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Set New Password"
        subtitle="Create a secure password"
      >
        <form onSubmit={handleSubmit} className="reset-password-form">
          <PasswordInput
            label="New Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showStrength
            onStrengthChange={setStrength}
            required
          />

          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
              <li>Cannot be same as previous password</li>
            </ul>
          </div>

          <LoadingButton type="submit" loading={loading} fullWidth>
            Update Password
          </LoadingButton>

          <div className="auth-footer">
            <button type="button" onClick={() => navigate('/auth/login')} className="back-link">
              Back to Login
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
