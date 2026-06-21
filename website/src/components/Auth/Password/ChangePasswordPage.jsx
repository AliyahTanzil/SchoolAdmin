import React, { useState } from 'react';
import { AuthLayout, AuthCard, PasswordInput, LoadingButton } from '../Shared';
import { usePasswordReset } from '../../../hooks/auth/usePasswordReset';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { changePassword, loading } = usePasswordReset();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (strength < 50) {
      setError('Password is too weak');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Change Password"
        subtitle="Keep your account secure"
      >
        {success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>Password changed successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="change-password-form">
            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

            <LoadingButton type="submit" loading={loading} fullWidth>
              Update Password
            </LoadingButton>
          </form>
        )}
        
        <div className="password-info">
          <p>Last password changed: 30 days ago</p>
          <p>Next password change required: Never</p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
