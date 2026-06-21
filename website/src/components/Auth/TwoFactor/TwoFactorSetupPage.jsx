import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, AuthCard, OTPInput, LoadingButton, ProgressBar } from '../Shared';
import TwoFactorMethodSelector from './TwoFactorMethodSelector';
import QRCodeDisplay from './QRCodeDisplay';
import BackupCodesDisplay from './BackupCodesDisplay';
import { useTwoFactor } from '../../../hooks/auth/useTwoFactor';

export default function TwoFactorSetupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('method-select');
  const [selectedMethod, setSelectedMethod] = useState('authenticator');
  const [qrCode, setQrCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const { setup, verify, loading } = useTwoFactor();

  const handleMethodSelect = async () => {
    try {
      const result = await setup(selectedMethod);
      if (result.qrCode) {
        setQrCode(result.qrCode);
        setManualCode(result.manualCode);
        setCurrentStep('setup');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify = async () => {
    try {
      await verify(verificationCode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'method-select': return 1;
      case 'setup': return 2;
      case 'verify': return 3;
      default: return 1;
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Two-Factor Authentication"
        subtitle="Add an extra security layer"
      >
        <ProgressBar currentStep={getStepNumber()} totalSteps={3} />

        {currentStep === 'method-select' && (
          <>
            <TwoFactorMethodSelector
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
            />
            <LoadingButton onClick={handleMethodSelect} loading={loading} fullWidth>
              Continue
            </LoadingButton>
            <button type="button" onClick={handleSkip} className="skip-button">
              Skip for now (Not recommended)
            </button>
          </>
        )}

        {currentStep === 'setup' && (
          <>
            <QRCodeDisplay
              qrCode={qrCode}
              manualCode={manualCode}
              onCopy={() => console.log('Copied')}
            />
            <div className="step-actions">
              <LoadingButton
                type="button"
                onClick={() => setCurrentStep('method-select')}
                variant="secondary"
                loading={loading}
              >
                Back
              </LoadingButton>
              <LoadingButton
                type="button"
                onClick={() => setCurrentStep('verify')}
                loading={loading}
              >
                Continue to Verification
              </LoadingButton>
            </div>
          </>
        )}

        {currentStep === 'verify' && (
          <>
            <div className="two-factor-verify">
              <h4>Enter the 6-digit code from your app</h4>
              <OTPInput
                length={6}
                value={verificationCode}
                onChange={setVerificationCode}
                onComplete={handleVerify}
                error={error}
              />
              <p className="code-expires">Code expires in: 0:28</p>
            </div>

            <BackupCodesDisplay
              codes={backupCodes}
              onDownload={() => console.log('Downloaded')}
              onCopy={() => console.log('Copied')}
            />

            <div className="step-actions">
              <LoadingButton
                type="button"
                onClick={() => setCurrentStep('setup')}
                variant="secondary"
                loading={loading}
              >
                Back
              </LoadingButton>
              <LoadingButton onClick={handleVerify} loading={loading}>
                Verify
              </LoadingButton>
            </div>

            <div className="help-section">
              <p>Need help? <button type="button" className="help-link">Use backup code</button></p>
              <p><button type="button" className="help-link">Contact support</button></p>
            </div>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
