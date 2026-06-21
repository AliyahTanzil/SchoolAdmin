import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout, AuthCard, ProgressBar } from '../Shared';
import AccountTypeSelector from './AccountTypeSelector';
import AccountInfoStep from './RegisterSteps/AccountInfoStep';
import AdditionalInfoStep from './RegisterSteps/AdditionalInfoStep';
import VerificationStep from './RegisterSteps/VerificationStep';
import { useRegister } from '../../../hooks/auth/useRegister';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'student';
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState(initialType);
  const [formData, setFormData] = useState({
    accountType: initialType,
    fullName: '',
    email: '',
    mobile: '',
    loginMethod: 'username',
    username: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    admissionNumber: '',
    gradeLevel: '',
    qualification: '',
    subject: '',
    department: '',
    parentId: '',
    studentAdmissionNumbers: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const { register, loading } = useRegister();

  const totalSteps = 3;

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCompleteRegistration();
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCompleteRegistration = async () => {
    try {
      await register(formData);
      navigate(redirectPath);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <AccountTypeSelector
              selectedType={accountType}
              onTypeChange={(type) => {
                setAccountType(type);
                handleFormDataChange('accountType', type);
              }}
            />
            <button
              type="button"
              onClick={handleNext}
              className="loading-button loading-button-full"
              disabled={!accountType}
            >
              Continue
            </button>
          </>
        );
      case 2:
        return (
          <AccountInfoStep
            formData={formData}
            onChange={handleFormDataChange}
            onNext={handleNext}
            loading={loading}
          />
        );
      case 3:
        return (
          <AdditionalInfoStep
            formData={formData}
            onChange={handleFormDataChange}
            onNext={handleNext}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 4:
        return (
          <VerificationStep
            formData={formData}
            onComplete={handleCompleteRegistration}
            onBack={handleBack}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create Account"
        subtitle="Join SchoolAdmin today"
      >
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        {renderStep()}
        
        <div className="auth-footer">
          Already have an account? <a href="/auth/login">Sign In</a>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
