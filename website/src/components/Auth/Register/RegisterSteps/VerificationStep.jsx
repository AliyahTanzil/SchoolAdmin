import React, { useState } from 'react';
import { OTPInput, LoadingButton } from '../../Shared';

export default function VerificationStep({ formData, onComplete, onBack, loading }) {
  const [emailCode, setEmailCode] = useState('');
  const [mobileCode, setMobileCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [setup2FA, setSetup2FA] = useState(false);

  const handleEmailVerify = () => {
    // Simulate email verification
    setEmailVerified(true);
  };

  const handleMobileVerify = () => {
    // Simulate mobile verification
    setMobileVerified(true);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="register-step verification-step">
      <h3>Verify Your Information</h3>
      
      <div className="verification-section">
        <h4>Email Verification</h4>
        <p>We've sent a verification code to {formData.email}</p>
        <OTPInput
          length={6}
          value={emailCode}
          onChange={setEmailCode}
          onComplete={handleEmailVerify}
        />
        {emailVerified && <div className="verification-success">✓ Email verified</div>}
      </div>

      <div className="verification-section">
        <h4>Mobile Verification</h4>
        <p>We've sent a verification code to {formData.mobile}</p>
        <OTPInput
          length={6}
          value={mobileCode}
          onChange={setMobileCode}
          onComplete={handleMobileVerify}
        />
        {mobileVerified && <div className="verification-success">✓ Mobile verified</div>}
      </div>

      <div className="verification-section">
        <h4>Two-Factor Authentication (Optional)</h4>
        <p>Add an extra layer of security to your account</p>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={setup2FA}
            onChange={(e) => setSetup2FA(e.target.checked)}
            className="checkbox-input"
          />
          Enable Two-Factor Authentication
        </label>
      </div>

      <div className="step-actions">
        <LoadingButton
          type="button"
          onClick={onBack}
          variant="secondary"
          loading={loading}
        >
          Back
        </LoadingButton>
        <LoadingButton
          type="button"
          onClick={handleComplete}
          loading={loading}
          disabled={!emailVerified || !mobileVerified}
        >
          Complete Registration
        </LoadingButton>
      </div>

      <div className="skip-option">
        <button type="button" className="skip-button" onClick={onComplete}>
          Skip for now (Not recommended)
        </button>
      </div>
    </div>
  );
}
