import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout, AuthCard, FormField, LoadingButton } from '../Shared';
import RecoveryMethodSelector from './RecoveryMethodSelector';
import { usePasswordReset } from '../../../hooks/auth/usePasswordReset';

export default function ForgotPasswordPage() {
  const [selectedMethod, setSelectedMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { initiateReset, loading } = usePasswordReset();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier) {
      setError('Please enter your identifier');
      return;
    }

    try {
      await initiateReset(identifier, selectedMethod);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <AuthCard
          title="Reset Link Sent"
          subtitle="Check your email or phone"
        >
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>We've sent a password reset link to your {selectedMethod === 'email' ? 'email' : 'phone'}.</p>
            <p>Please check your {selectedMethod === 'email' ? 'inbox' : 'messages'} and follow the instructions.</p>
          </div>
          <div className="auth-footer">
            <Link to="/auth/login" className="back-link">Back to Login</Link>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        subtitle="We'll help you recover it"
      >
        {!success && (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <RecoveryMethodSelector
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
            />

            <FormField
              label="Username / Email / Mobile #"
              name="identifier"
              type="text"
              placeholder="Enter your identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            {error && <div className="error-message">{error}</div>}

            <LoadingButton type="submit" loading={loading} fullWidth>
              Send Reset Link
            </LoadingButton>

            <div className="auth-footer">
              Remember your password? <Link to="/auth/login">Sign In</Link>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
