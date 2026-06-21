import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout, AuthCard, OTPInput, LoadingButton } from '../Shared';
import { useTwoFactor } from '../../../hooks/auth/useTwoFactor';

export default function TwoFactorVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const { verify, loading } = useTwoFactor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      await verify(code);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
      setAttempts(prev => prev + 1);
    }
  };

  const handleBackupCode = () => {
    // Navigate to backup code verification
    console.log('Navigate to backup code verification');
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Two-Factor Authentication"
        subtitle="Enter your verification code"
      >
        <form onSubmit={handleSubmit} className="two-factor-verify-form">
          <div className="two-factor-verify">
            <h4>Enter the 6-digit code from your authenticator app</h4>
            <OTPInput
              length={6}
              value={code}
              onChange={setCode}
              error={error}
            />
            <p className="code-expires">Code expires in: 0:28</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {attempts > 0 && (
            <p className="attempts-warning">
              {attempts} failed attempt{attempts > 1 ? 's' : ''}. Please try again.
            </p>
          )}

          <LoadingButton type="submit" loading={loading} fullWidth>
            Verify
          </LoadingButton>

          <div className="help-section">
            <p>Can't access your authenticator?</p>
            <button type="button" onClick={handleBackupCode} className="help-link">
              Use backup code
            </button>
            <button type="button" className="help-link">
              Contact support
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
