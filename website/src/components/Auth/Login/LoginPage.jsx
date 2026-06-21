import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout, AuthCard, FormField, PasswordInput, LoadingButton } from '../Shared';
import LoginMethodSelector from './LoginMethodSelector';
import { useLogin } from '../../../hooks/auth/useLogin';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const initialMethod = searchParams.get('method') || 'username';

  const [selectedMethod, setSelectedMethod] = useState(initialMethod);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loading } = useLogin(selectedMethod);

  const availableMethods = ['username', 'email', 'mobile', 'admission_number', 'staff_id', 'parent_id', 'qr_code'];

  const getPlaceholder = () => {
    const placeholders = {
      username: 'Enter your username',
      email: 'Enter your email address',
      mobile: '+1 (555) 123-4567',
      admission_number: 'ADM-2024-001',
      staff_id: 'STF-2024-001',
      parent_id: 'PAR-2024-001',
      qr_code: 'Scan QR code'
    };
    return placeholders[selectedMethod] || 'Enter your identifier';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!identifier) {
      newErrors.identifier = `${selectedMethod.replace('_', ' ')} is required`;
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(identifier, password);
      navigate(redirectPath);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back!"
        subtitle="Sign in to your account"
      >
        <form onSubmit={handleSubmit} className="login-form">
          <LoginMethodSelector
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            availableMethods={availableMethods}
          />

          <FormField
            label={selectedMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            name="identifier"
            type="text"
            placeholder={getPlaceholder()}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
            required
          />

          <div className="form-field">
            <label className="form-label">Password</label>
            <PasswordInput
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              showStrength={false}
            />
            <div className="form-actions">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                Remember me
              </label>
              <Link to="/auth/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <LoadingButton
            type="submit"
            loading={loading}
            fullWidth
          >
            Sign In
          </LoadingButton>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-button google">
              <span className="social-icon">G</span>
              Google
            </button>
            <button type="button" className="social-button microsoft">
              <span className="social-icon">M</span>
              Microsoft
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account? <Link to="/auth/register">Sign Up</Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
