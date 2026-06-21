# Authentication Component Architecture

## Overview

This document defines the component architecture for implementing multi-method authentication across both website and mobile app platforms, ensuring code reusability, maintainability, and scalability.

## Architecture Principles

- **Component Reusability**: Shared components between platforms where possible
- **Separation of Concerns**: Clear separation between UI, logic, and API layers
- **Type Safety**: TypeScript interfaces for all components
- **Testing**: Unit and integration testable components
- **Accessibility**: WCAG 2.1 AA compliant components
- **Performance**: Lazy loading and code splitting

---

## Website Component Structure

### Directory Structure
```
website/src/
├── components/
│   ├── Auth/
│   │   ├── Login/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── LoginMethodSelector.jsx
│   │   │   ├── LoginMethodCard.jsx
│   │   │   └── index.js
│   │   ├── Register/
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── RegisterSteps/
│   │   │   │   ├── AccountInfoStep.jsx
│   │   │   │   ├── AdditionalInfoStep.jsx
│   │   │   │   └── VerificationStep.jsx
│   │   │   ├── AccountTypeSelector.jsx
│   │   │   └── index.js
│   │   ├── Password/
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── ChangePasswordPage.jsx
│   │   │   ├── PasswordStrengthIndicator.jsx
│   │   │   ├── RecoveryMethodSelector.jsx
│   │   │   └── index.js
│   │   ├── TwoFactor/
│   │   │   ├── TwoFactorSetupPage.jsx
│   │   │   ├── TwoFactorVerifyPage.jsx
│   │   │   ├── TwoFactorMethodSelector.jsx
│   │   │   ├── QRCodeDisplay.jsx
│   │   │   ├── BackupCodesDisplay.jsx
│   │   │   └── index.js
│   │   ├── Device/
│   │   │   ├── DeviceVerificationPage.jsx
│   │   │   ├── DeviceInfoCard.jsx
│   │   │   ├── TrustedDevicesList.jsx
│   │   │   └── index.js
│   │   ├── Recovery/
│   │   │   ├── AccountRecoveryPage.jsx
│   │   │   ├── RecoveryMethodSelector.jsx
│   │   │   ├── IdentityVerification.jsx
│   │   │   └── index.js
│   │   ├── Shared/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── AuthCard.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── PasswordInput.jsx
│   │   │   ├── OTPInput.jsx
│   │   │   ├── LoadingButton.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── SuccessMessage.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── index.js
│   │   └── index.js
│   └── ...
├── hooks/
│   ├── auth/
│   │   ├── useAuth.js
│   │   ├── useLogin.js
│   │   ├── useRegister.js
│   │   ├── usePasswordReset.js
│   │   ├── useTwoFactor.js
│   │   ├── useDeviceVerification.js
│   │   └── index.js
├── context/
│   ├── AuthContext.jsx
│   └── SessionContext.jsx
├── services/
│   ├── auth/
│   │   ├── authService.js
│   │   ├── sessionService.js
│   │   ├── deviceService.js
│   │   └── index.js
├── utils/
│   ├── validation/
│   │   ├── authValidation.js
│   │   ├── passwordValidation.js
│   │   └── index.js
│   └── security/
│       ├── tokenManager.js
│       └── csrfProtection.js
└── types/
    ├── auth.types.js
    └── user.types.js
```

---

## Mobile App Component Structure

### Directory Structure
```
mobileApp/
├── components/
│   ├── Auth/
│   │   ├── LoginScreen.js
│   │   ├── LoginForm.js
│   │   ├── LoginMethodSelector.js
│   │   ├── LoginMethodBottomSheet.js
│   │   └── index.js
│   ├── Register/
│   │   ├── RegisterScreen.js
│   │   ├── RegisterSteps/
│   │   │   ├── AccountTypeStep.js
│   │   │   ├── AccountInfoStep.js
│   │   │   ├── AdditionalInfoStep.js
│   │   │   └── VerificationStep.js
│   │   └── index.js
│   ├── Password/
│   │   ├── ForgotPasswordScreen.js
│   │   ├── ResetPasswordScreen.js
│   │   ├── ChangePasswordScreen.js
│   │   ├── PasswordStrengthIndicator.js
│   │   └── index.js
│   ├── TwoFactor/
│   │   ├── TwoFactorSetupScreen.js
│   │   ├── TwoFactorVerifyScreen.js
│   │   ├── QRCodeScanner.js
│   │   ├── QRCodeDisplay.js
│   │   └── index.js
│   ├── Device/
│   │   ├── DeviceVerificationScreen.js
│   │   ├── DeviceInfoCard.js
│   │   └── index.js
│   ├── Recovery/
│   │   ├── AccountRecoveryScreen.js
│   │   └── index.js
│   ├── Shared/
│   │   ├── AuthLayout.js
│   │   ├── FormField.js
│   │   ├── PasswordInput.js
│   │   ├── OTPInput.js
│   │   ├── LoadingButton.js
│   │   ├── ProgressBar.js
│   │   ├── BottomSheet.js
│   │   └── index.js
│   └── index.js
├── hooks/
│   ├── useAuth.js
│   ├── useLogin.js
│   ├── useRegister.js
│   ├── usePasswordReset.js
│   ├── useTwoFactor.js
│   ├── useDeviceVerification.js
│   ├── useBiometric.js
│   └── index.js
├── context/
│   ├── AuthContext.js
│   └── SessionContext.js
├── services/
│   ├── authService.js
│   ├── sessionService.js
│   ├── deviceService.js
│   ├── biometricService.js
│   └── index.js
├── utils/
│   ├── validation.js
│   ├── passwordValidation.js
│   └── security.js
└── navigation/
    └── AuthNavigator.js
```

---

## Component Specifications

### Shared Components (Platform-Agnostic)

#### 1. AuthLayout
**Purpose**: Wrapper for authentication pages with consistent layout

**Props**:
- `children`: ReactNode
- `showLogo`: boolean (default: true)
- `showFooter`: boolean (default: true)
- `className`: string (optional)

**Features**:
- Responsive layout
- Logo placement
- Footer with links
- Background styling
- Loading state support

**Website**: `components/Auth/Shared/AuthLayout.jsx`
**Mobile**: `components/Shared/AuthLayout.js`

---

#### 2. AuthCard
**Purpose**: Card container for authentication forms

**Props**:
- `children`: ReactNode
- `title`: string
- `subtitle`: string (optional)
- `maxWidth`: string (default: '480px')
- `className`: string (optional)

**Features**:
- Centered card layout
- Title and subtitle
- Responsive width
- Shadow and border
- Loading overlay support

**Website**: `components/Auth/Shared/AuthCard.jsx`
**Mobile**: Not used (full-width layout)

---

#### 3. FormField
**Purpose**: Reusable form field with label, input, and error

**Props**:
- `label`: string
- `name`: string
- `type`: string (default: 'text')
- `placeholder`: string (optional)
- `value`: any
- `onChange`: function
- `onBlur`: function (optional)
- `error`: string (optional)
- `required`: boolean (default: false)
- `disabled`: boolean (default: false)
- `className`: string (optional)

**Features**:
- Label with required indicator
- Input with styling
- Error message display
- Focus states
- Disabled state
- Auto-complete support

**Website**: `components/Auth/Shared/FormField.jsx`
**Mobile**: `components/Shared/FormField.js`

---

#### 4. PasswordInput
**Purpose**: Password input with show/hide toggle

**Props**:
- `name`: string
- `value`: string
- `onChange`: function
- `placeholder`: string (optional)
- `error`: string (optional)
- `showStrength`: boolean (default: false)
- `onStrengthChange`: function (optional)
- `className`: string (optional)

**Features**:
- Show/hide password toggle
- Password strength indicator
- Error message display
- Focus states
- Auto-complete off

**Website**: `components/Auth/Shared/PasswordInput.jsx`
**Mobile**: `components/Shared/PasswordInput.js`

---

#### 5. OTPInput
**Purpose**: One-time password input with auto-focus

**Props**:
- `length`: number (default: 6)
- `value`: string
- `onChange`: function
- `onComplete`: function
- `error`: string (optional)
- `disabled`: boolean (default: false)
- `className`: string (optional)

**Features**:
- Individual digit inputs
- Auto-focus next input
- Backspace navigation
- Paste support
- Countdown timer (optional)
- Error state

**Website**: `components/Auth/Shared/OTPInput.jsx`
**Mobile**: `components/Shared/OTPInput.js`

---

#### 6. LoadingButton
**Purpose**: Button with loading state

**Props**:
- `children`: ReactNode
- `onClick`: function
- `loading`: boolean (default: false)
- `disabled`: boolean (default: false)
- `variant`: 'primary' | 'secondary' | 'danger' (default: 'primary')
- `fullWidth`: boolean (default: false)
- `className`: string (optional)

**Features**:
- Loading spinner
- Disabled state
- Variant styling
- Full width option
- Ripple effect (mobile)

**Website**: `components/Auth/Shared/LoadingButton.jsx`
**Mobile**: `components/Shared/LoadingButton.js`

---

#### 7. ProgressBar
**Purpose**: Progress indicator for multi-step forms

**Props**:
- `currentStep`: number
- `totalSteps`: number
- `showLabel`: boolean (default: true)
- `className`: string (optional)

**Features**:
- Visual progress bar
- Step indicator
- Percentage display
- Animated transitions
- Customizable colors

**Website**: `components/Auth/Shared/ProgressBar.jsx`
**Mobile**: `components/Shared/ProgressBar.js`

---

### Login Components

#### 1. LoginPage / LoginScreen
**Purpose**: Main login page with multi-method support

**Props**:
- `onLoginSuccess`: function
- `redirectTo`: string (optional)

**State**:
- `selectedMethod`: LoginMethod
- `identifier`: string
- `password`: string
- `rememberMe`: boolean
- `loading`: boolean
- `error`: string | null

**Features**:
- Login method selection
- Form validation
- Error handling
- Loading states
- Remember me functionality
- QR code option (mobile)
- Forgot password link
- Registration link

**Website**: `components/Auth/Login/LoginPage.jsx`
**Mobile**: `components/Auth/LoginScreen.js`

---

#### 2. LoginMethodSelector
**Purpose**: Component for selecting login method

**Props**:
- `selectedMethod`: LoginMethod
- `onMethodChange`: function
- `availableMethods`: LoginMethod[]
- `variant`: 'card' | 'bottom-sheet' (default: 'card')

**Features**:
- Method cards with icons
- Selection highlighting
- Responsive layout
- Bottom sheet for mobile
- Accessibility support

**Website**: `components/Auth/Login/LoginMethodSelector.jsx`
**Mobile**: `components/Auth/Login/LoginMethodBottomSheet.js`

---

#### 3. LoginMethodCard
**Purpose**: Individual login method card

**Props**:
- `method`: LoginMethod
- `selected`: boolean
- `onSelect`: function
- `disabled`: boolean (default: false)

**Features**:
- Icon display
- Method name
- Description
- Selection state
- Disabled state
- Hover effects

**Website**: `components/Auth/Login/LoginMethodCard.jsx`
**Mobile**: Integrated into bottom sheet

---

### Registration Components

#### 1. RegisterPage / RegisterScreen
**Purpose**: Multi-step registration flow

**Props**:
- `onRegisterSuccess`: function
- `initialAccountType`: AccountType (optional)

**State**:
- `currentStep`: number
- `accountType`: AccountType
- `formData`: RegistrationFormData
- `errors`: Record<string, string>
- `loading`: boolean

**Features**:
- Multi-step wizard
- Progress tracking
- Form validation
- Step navigation
- Data persistence
- Error handling

**Website**: `components/Auth/Register/RegisterPage.jsx`
**Mobile**: `components/Auth/RegisterScreen.js`

---

#### 2. AccountTypeSelector
**Purpose**: Select user account type

**Props**:
- `selectedType`: AccountType
- `onTypeChange`: function
- `availableTypes`: AccountType[]

**Features**:
- Type cards with icons
- Selection highlighting
- Type descriptions
- Accessibility support

**Website**: `components/Auth/Register/AccountTypeSelector.jsx`
**Mobile**: `components/Auth/RegisterSteps/AccountTypeStep.js`

---

#### 3. Registration Steps

**AccountInfoStep**:
- Personal information fields
- Login method selection
- Password setup
- Terms acceptance

**AdditionalInfoStep**:
- Role-specific fields
- Address information
- Emergency contact

**VerificationStep**:
- Email verification
- Mobile verification
- 2FA setup
- Device registration

**Website**: `components/Auth/Register/RegisterSteps/`
**Mobile**: `components/Auth/RegisterSteps/`

---

### Password Components

#### 1. ForgotPasswordPage / ForgotPasswordScreen
**Purpose**: Initiate password recovery

**Props**:
- `onSuccess`: function

**State**:
- `selectedMethod`: RecoveryMethod
- `identifier`: string
- `loading`: boolean
- `error`: string | null
- `success`: boolean

**Features**:
- Recovery method selection
- Identifier input
- Method-specific validation
- Success confirmation
- Error handling

**Website**: `components/Auth/Password/ForgotPasswordPage.jsx`
**Mobile**: `components/Auth/Password/ForgotPasswordScreen.js`

---

#### 2. ResetPasswordPage / ResetPasswordScreen
**Purpose**: Reset password with token

**Props**:
- `token`: string
- `onSuccess`: function

**State**:
- `password`: string
- `confirmPassword`: string
- `strength`: PasswordStrength
- `loading`: boolean
- `error`: string | null

**Features**:
- Password input
- Confirm password
- Strength indicator
- Validation
- Token verification
- Success handling

**Website**: `components/Auth/Password/ResetPasswordPage.jsx`
**Mobile**: `components/Auth/Password/ResetPasswordScreen.js`

---

#### 3. ChangePasswordPage / ChangePasswordScreen
**Purpose**: Authenticated password change

**Props**: None (requires authentication)

**State**:
- `currentPassword`: string
- `newPassword`: string
- `confirmPassword`: string
- `strength`: PasswordStrength
- `loading`: boolean
- `error`: string | null

**Features**:
- Current password verification
- New password input
- Strength indicator
- Validation
- Success handling

**Website**: `components/Auth/Password/ChangePasswordPage.jsx`
**Mobile**: `components/Auth/Password/ChangePasswordScreen.js`

---

#### 4. PasswordStrengthIndicator
**Purpose**: Visual password strength indicator

**Props**:
- `password`: string
- `onStrengthChange`: function (optional)

**Features**:
- Strength calculation
- Visual progress bar
- Color coding
- Requirement checklist
- Real-time feedback

**Website**: `components/Auth/Password/PasswordStrengthIndicator.jsx`
**Mobile**: `components/Auth/Password/PasswordStrengthIndicator.js`

---

#### 5. RecoveryMethodSelector
**Purpose**: Select password recovery method

**Props**:
- `selectedMethod`: RecoveryMethod
- `onMethodChange`: function
- `availableMethods`: RecoveryMethod[]

**Features**:
- Method cards
- Selection highlighting
- Method descriptions
- Accessibility support

**Website**: `components/Auth/Password/RecoveryMethodSelector.jsx`
**Mobile**: Integrated into ForgotPasswordScreen

---

### Two-Factor Authentication Components

#### 1. TwoFactorSetupPage / TwoFactorSetupScreen
**Purpose**: Setup 2FA for account

**Props**:
- `onComplete`: function
- `onSkip`: function

**State**:
- `selectedMethod`: TwoFactorMethod
- `qrCode`: string
- `backupCodes`: string[]
- `currentStep`: 'method-select' | 'setup' | 'verify'
- `loading`: boolean
- `error`: string | null

**Features**:
- Method selection
- QR code display
- Backup codes generation
- Verification flow
- Skip option

**Website**: `components/Auth/TwoFactor/TwoFactorSetupPage.jsx`
**Mobile**: `components/Auth/TwoFactor/TwoFactorSetupScreen.js`

---

#### 2. TwoFactorVerifyPage / TwoFactorVerifyScreen
**Purpose**: Verify 2FA during login

**Props**:
- `onVerify`: function
- `onBackupCode`: function

**State**:
- `code`: string
- `loading`: boolean
- `error`: string | null
- `attempts`: number

**Features**:
- OTP input
- Countdown timer
- Backup code option
- Error handling
- Attempt tracking

**Website**: `components/Auth/TwoFactor/TwoFactorVerifyPage.jsx`
**Mobile**: `components/Auth/TwoFactor/TwoFactorVerifyScreen.js`

---

#### 3. TwoFactorMethodSelector
**Purpose**: Select 2FA method

**Props**:
- `selectedMethod`: TwoFactorMethod
- `onMethodChange`: function
- `availableMethods`: TwoFactorMethod[]

**Features**:
- Method cards with icons
- Selection highlighting
- Method descriptions
- Recommendation indicators

**Website**: `components/Auth/TwoFactor/TwoFactorMethodSelector.jsx`
**Mobile**: Integrated into setup screen

---

#### 4. QRCodeDisplay
**Purpose**: Display QR code for authenticator app

**Props**:
- `qrCode`: string
- `manualCode`: string
- `onCopy`: function

**Features**:
- QR code rendering
- Manual code display
- Copy to clipboard
- Download option
- Instructions

**Website**: `components/Auth/TwoFactor/QRCodeDisplay.jsx`
**Mobile**: `components/Auth/TwoFactor/QRCodeDisplay.js`

---

#### 5. QRCodeScanner (Mobile Only)
**Purpose**: Scan QR code for login

**Props**:
- `onScan`: function
- `onError`: function

**Features**:
- Camera integration
- Permission handling
- Flash toggle
- Manual entry fallback
- Error handling

**Mobile**: `components/Auth/TwoFactor/QRCodeScanner.js`

---

#### 6. BackupCodesDisplay
**Purpose**: Display backup codes for 2FA

**Props**:
- `codes`: string[]
- `onDownload`: function
- `onCopy`: function

**Features**:
- Code list display
- Download option
- Copy all option
- Warning message
- Confirmation dialog

**Website**: `components/Auth/TwoFactor/BackupCodesDisplay.jsx`
**Mobile**: `components/Auth/TwoFactor/BackupCodesDisplay.js`

---

### Device Verification Components

#### 1. DeviceVerificationPage / DeviceVerificationScreen
**Purpose**: Verify new device

**Props**:
- `deviceInfo`: DeviceInfo
- `onVerify`: function
- `onReport`: function

**State**:
- `selectedMethod`: VerificationMethod
- `code`: string
- `rememberDevice`: boolean
- `loading`: boolean
- `error`: string | null

**Features**:
- Device information display
- Verification method selection
- OTP input
- Remember device option
- Report suspicious activity

**Website**: `components/Auth/Device/DeviceVerificationPage.jsx`
**Mobile**: `components/Auth/Device/DeviceVerificationScreen.js`

---

#### 2. DeviceInfoCard
**Purpose**: Display device information

**Props**:
- `device`: DeviceInfo
- `location`: LocationInfo
- `ip`: string

**Features**:
- Device type and model
- Browser information
- Location display
- IP address
- Trust indicator

**Website**: `components/Auth/Device/DeviceInfoCard.jsx`
**Mobile**: `components/Auth/Device/DeviceInfoCard.js`

---

#### 3. TrustedDevicesList (Website Only)
**Purpose**: List and manage trusted devices

**Props**:
- `devices`: TrustedDevice[]
- `onRevoke`: function

**Features**:
- Device list
- Trust status
- Last activity
- Revoke action
- Current device indicator

**Website**: `components/Auth/Device/TrustedDevicesList.jsx`

---

### Account Recovery Components

#### 1. AccountRecoveryPage / AccountRecoveryScreen
**Purpose**: Full account recovery flow

**Props**:
- `onComplete`: function

**State**:
- `currentStep`: 'identifier' | 'verify' | 'recover'
- `selectedMethod': RecoveryMethod
- `identifier`: string
- `verificationCode`: string
- `loading`: boolean
- `error`: string | null

**Features**:
- Multi-step recovery
- Method selection
- Identity verification
- Account recovery
- Security questions

**Website**: `components/Auth/Recovery/AccountRecoveryPage.jsx`
**Mobile**: `components/Auth/Recovery/AccountRecoveryScreen.js`

---

#### 2. RecoveryMethodSelector
**Purpose**: Select account recovery method

**Props**:
- `selectedMethod`: RecoveryMethod
- `onMethodChange`: function
- `availableMethods`: RecoveryMethod[]

**Features**:
- Method cards
- Selection highlighting
- Method descriptions
- Security level indicators

**Website**: `components/Auth/Recovery/RecoveryMethodSelector.jsx`
**Mobile**: Integrated into recovery screen

---

#### 3. IdentityVerification
**Purpose**: Verify user identity

**Props**:
- `identifier`: string
- `onVerify`: function

**State**:
- `verificationMethod`: VerificationMethod
- `document`: File | null
- `selfie`: File | null
- `loading`: boolean
- `error`: string | null

**Features**:
- Document upload
- Selfie verification
- Security questions
- Email verification
- SMS verification

**Website**: `components/Auth/Recovery/IdentityVerification.jsx`
**Mobile**: `components/Auth/Recovery/IdentityVerification.js`

---

## Custom Hooks

### useAuth
**Purpose**: Main authentication hook

**Returns**:
- `user`: User | null
- `loading`: boolean
- `error`: Error | null
- `login`: function
- `logout`: function
- `refreshToken`: function
- `isAuthenticated`: boolean

**Features**:
- Authentication state management
- Token refresh
- Session management
- Error handling

**Website**: `hooks/auth/useAuth.js`
**Mobile**: `hooks/useAuth.js`

---

### useLogin
**Purpose**: Login functionality

**Parameters**:
- `method`: LoginMethod

**Returns**:
- `login`: function
- `loading`: boolean
- `error`: Error | null
- `resetError`: function

**Features**:
- Multi-method login
- Form validation
- Error handling
- Success handling

**Website**: `hooks/auth/useLogin.js`
**Mobile**: `hooks/useLogin.js`

---

### useRegister
**Purpose**: Registration functionality

**Returns**:
- `register`: function
- `loading`: boolean
- `error`: Error | null
- `resetError`: function

**Features**:
- Multi-step registration
- Form validation
- Error handling
- Success handling

**Website**: `hooks/auth/useRegister.js`
**Mobile**: `hooks/useRegister.js`

---

### usePasswordReset
**Purpose**: Password reset functionality

**Returns**:
- `initiateReset`: function
- `resetPassword`: function
- `loading`: boolean
- `error`: Error | null

**Features**:
- Reset initiation
- Password update
- Token verification
- Error handling

**Website**: `hooks/auth/usePasswordReset.js`
**Mobile**: `hooks/usePasswordReset.js`

---

### useTwoFactor
**Purpose**: 2FA functionality

**Returns**:
- `setup`: function
- `verify`: function
- `disable`: function
- `loading`: boolean
- `error`: Error | null

**Features**:
- 2FA setup
- Code verification
- Backup codes
- Disable 2FA

**Website**: `hooks/auth/useTwoFactor.js`
**Mobile**: `hooks/useTwoFactor.js`

---

### useDeviceVerification
**Purpose**: Device verification functionality

**Returns**:
- `verify`: function
- `getDevices`: function
- `revokeDevice`: function
- `loading`: boolean
- `error`: Error | null

**Features**:
- Device verification
- Device list
- Device revocation
- Trust management

**Website**: `hooks/auth/useDeviceVerification.js`
**Mobile**: `hooks/useDeviceVerification.js`

---

### useBiometric (Mobile Only)
**Purpose**: Biometric authentication

**Returns**:
- `isAvailable`: boolean
- `authenticate`: function
- `enroll`: function
- `error`: Error | null

**Features**:
- Biometric availability check
- Fingerprint/Face ID
- Secure storage
- Error handling

**Mobile**: `hooks/useBiometric.js`

---

## Context Providers

### AuthContext
**Purpose**: Global authentication state

**State**:
- `user`: User | null
- `session`: Session | null
- `isAuthenticated`: boolean
- `loading`: boolean

**Methods**:
- `login`: function
- `logout`: function
- `refreshToken`: function
- `updateUser`: function

**Website**: `context/AuthContext.jsx`
**Mobile**: `context/AuthContext.js`

---

### SessionContext
**Purpose**: Session management

**State**:
- `sessions`: Session[]
- `currentSession`: Session | null
- `lastActivity`: Date

**Methods**:
- `refreshSession`: function
- `revokeSession`: function
- `revokeAllSessions`: function
- `updateActivity`: function

**Website**: `context/SessionContext.jsx`
**Mobile**: `context/SessionContext.js`

---

## Services

### authService
**Purpose**: Authentication API calls

**Methods**:
- `login(identifier, password, method)`
- `register(userData)`
- `logout(sessionId)`
- `refreshToken(refreshToken)`
- `verify2FA(code)`
- `setup2FA(method)`

**Website**: `services/auth/authService.js`
**Mobile**: `services/authService.js`

---

### sessionService
**Purpose**: Session management

**Methods**:
- `getSessions()`
- `revokeSession(sessionId)`
- `revokeAllSessions(currentSessionId)`
- `updateSessionActivity()`

**Website**: `services/auth/sessionService.js`
**Mobile**: `services/sessionService.js`

---

### deviceService
**Purpose**: Device management

**Methods**:
- `getDeviceInfo()`
- `verifyDevice(code)`
- `rememberDevice()`
- `getTrustedDevices()`
- `revokeDevice(deviceId)`

**Website**: `services/auth/deviceService.js`
**Mobile**: `services/deviceService.js`

---

### biometricService (Mobile Only)
**Purpose**: Biometric authentication

**Methods**:
- `isAvailable()`
- `authenticate()`
- `enroll()`
- `storeCredentials()`

**Mobile**: `services/biometricService.js`

---

## Utility Functions

### Validation

#### authValidation
**Functions**:
- `validateUsername(username)`
- `validateEmail(email)`
- `validateMobile(mobile)`
- `validateIdentifier(identifier, method)`

**Website**: `utils/validation/authValidation.js`
**Mobile**: `utils/validation.js`

---

#### passwordValidation
**Functions**:
- `validatePassword(password)`
- `calculateStrength(password)`
- `checkCommonPasswords(password)`

**Website**: `utils/validation/passwordValidation.js`
**Mobile**: `utils/passwordValidation.js`

---

### Security

#### tokenManager (Website Only)
**Functions**:
- `setAccessToken(token)`
- `setRefreshToken(token)`
- `getAccessToken()`
- `getRefreshToken()`
- `clearTokens()`
- `isTokenExpired(token)`

**Website**: `utils/security/tokenManager.js`

---

#### csrfProtection (Website Only)
**Functions**:
- `getCSRFToken()`
- `validateCSRFToken(token)`
- `refreshCSRFToken()`

**Website**: `utils/security/csrfProtection.js`

---

## Type Definitions

### Authentication Types

```typescript
// Login Methods
type LoginMethod = 
  | 'username'
  | 'email'
  | 'mobile'
  | 'admission_number'
  | 'staff_id'
  | 'parent_id'
  | 'qr_code';

// Account Types
type AccountType = 
  | 'student'
  | 'teacher'
  | 'staff'
  | 'parent';

// Recovery Methods
type RecoveryMethod = 
  | 'email'
  | 'sms'
  | 'security_questions';

// Two-Factor Methods
type TwoFactorMethod = 
  | 'authenticator'
  | 'sms'
  | 'email'
  | 'hardware_token';

// Verification Methods
type VerificationMethod = 
  | 'email'
  | 'sms'
  | 'authenticator';

// Password Strength
type PasswordStrength = 
  | 'weak'
  | 'fair'
  | 'good'
  | 'strong';

// User
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  accountType: AccountType;
  profile: UserProfile;
}

// Session
interface Session {
  id: string;
  userId: number;
  deviceId: string;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  isTrusted: boolean;
}

// Device Info
interface DeviceInfo {
  type: string;
  model: string;
  browser: string;
  os: string;
  location: LocationInfo;
  ip: string;
}
```

---

## Component Communication

### Parent-Child Communication
- Props for data flow down
- Callbacks for events up
- Context for global state

### Sibling Communication
- Lift state up to common parent
- Use context for shared state
- Custom hooks for logic sharing

### Cross-Platform Communication
- Shared service layer
- Shared validation utilities
- Shared type definitions
- Platform-specific components

---

## Performance Optimization

### Code Splitting
- Lazy load authentication components
- Route-based code splitting
- Dynamic imports for heavy components

### Memoization
- React.memo for expensive components
- useMemo for computed values
- useCallback for callback functions

### Lazy Loading
- React.lazy for component lazy loading
- Suspense for loading states
- Intersection Observer for images

---

## Testing Strategy

### Unit Tests
- Component rendering
- Props validation
- State management
- Hook functionality

### Integration Tests
- Component interactions
- Form submissions
- API calls
- Navigation flows

### E2E Tests
- Complete authentication flows
- Multi-step processes
- Error scenarios
- Cross-browser testing

---

## Accessibility Compliance

### WCAG 2.1 AA Requirements
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus indicators
- Error accessibility
- Form labels
- ARIA attributes

### Testing Tools
- axe DevTools
- WAVE
- Lighthouse
- Screen reader testing
- Keyboard navigation testing

---

## Security Considerations

### Input Validation
- Client-side validation
- Server-side validation
- Sanitization
- Length limits

### Data Protection
- Secure storage (HttpOnly cookies, Keychain)
- Token encryption
- CSRF protection
- XSS prevention

### Rate Limiting
- Login attempt limiting
- OTP request limiting
- API rate limiting
- CAPTCHA integration

---

## Migration Strategy

### Phase 1: Foundation
- Set up directory structure
- Create shared components
- Implement authentication context
- Set up service layer

### Phase 2: Core Flows
- Implement login flow
- Implement registration flow
- Implement password reset flow

### Phase 3: Advanced Features
- Implement 2FA
- Implement device verification
- Implement account recovery

### Phase 4: Integration
- Integrate with existing components
- Update navigation
- Update state management
- Test all flows

---

## Summary

This component architecture provides a comprehensive, scalable, and maintainable structure for implementing multi-method authentication across both website and mobile platforms. The design emphasizes code reusability, separation of concerns, and user experience while ensuring security and accessibility compliance.
