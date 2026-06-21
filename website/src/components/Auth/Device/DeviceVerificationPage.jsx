import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, AuthCard, DeviceInfoCard, OTPInput, LoadingButton } from '../Shared';
import { useDeviceVerification } from '../../../hooks/auth/useDeviceVerification';

export default function DeviceVerificationPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('email');
  const [code, setCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState('');

  // Mock device info - in real app, this would come from browser detection
  const deviceInfo = {
    type: 'Desktop',
    model: 'MacBook Pro',
    browser: 'Chrome 120',
    os: 'macOS 14',
    isTrusted: false
  };

  const locationInfo = {
    city: 'San Francisco',
    country: 'CA'
  };

  const ipAddress = '192.168.1.100';

  const { verify, loading } = useDeviceVerification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      await verify(code, selectedMethod, rememberDevice);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReport = () => {
    // Navigate to suspicious activity report
    console.log('Report suspicious activity');
  };

  return (
    <AuthLayout>
      <AuthCard
        title="New Device Detected"
        subtitle="Verify it's really you"
      >
        <DeviceInfoCard
          device={deviceInfo}
          location={locationInfo}
          ip={ipAddress}
        />

        <form onSubmit={handleSubmit} className="device-verification-form">
          <div className="verification-method-section">
            <h4>Choose a verification method:</h4>
            <div className="verification-method-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="email"
                  checked={selectedMethod === 'email'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                />
                Send code to email (j***@gmail.com)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="sms"
                  checked={selectedMethod === 'sms'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                />
                Send code to mobile (+1 ***-***-1234)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="authenticator"
                  checked={selectedMethod === 'authenticator'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                />
                Use authenticator app
              </label>
            </div>
          </div>

          <div className="otp-section">
            <h4>Enter verification code:</h4>
            <OTPInput
              length={6}
              value={code}
              onChange={setCode}
              error={error}
            />
          </div>

          <div className="remember-device-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="checkbox-input"
              />
              Remember this device for 30 days
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <LoadingButton type="submit" loading={loading} fullWidth>
            Verify Device
          </LoadingButton>

          <div className="report-section">
            <p>Not you? <button type="button" onClick={handleReport} className="report-link">
              Report suspicious activity
            </button></p>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
