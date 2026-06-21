# Authentication UI Wireframes

## Overview

This document provides detailed UI wireframes for all authentication pages across both website and mobile app platforms, supporting multiple login methods and comprehensive authentication flows.

## Design Principles

- **Consistent Branding**: Maintain SchoolAdmin visual identity
- **Mobile-First**: Responsive design for all screen sizes
- **Accessibility**: WCAG 2.1 AA compliant
- **Progressive Enhancement**: Basic functionality without JavaScript
- **Security**: Clear security indicators and guidance
- **User-Friendly**: Clear error messages and validation feedback

---

## Website Wireframes

### 1. Login Page (`/auth/login`)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin                    [Language] [Theme]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│              │                             │                │
│              │      Welcome Back!          │                │
│              │    Sign in to your account  │                │
│              │                             │                │
│              └─────────────────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Select Login Method:                                │  │
│  │  [•] Username  [ ] Email  [ ] Mobile  [ ] QR Code   │  │
│  │  [ ] Admission #  [ ] Staff ID  [ ] Parent ID      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [Username/Email/Mobile #]                           │  │
│  │  ••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │                                                       │  │
│  │  [Password]                    [Show/Hide] [Forgot?]  │  │
│  │  ••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │                                                       │  │
│  │  [Remember me]  [Keep me signed in]                  │  │
│  │                                                       │  │
│  │  [              Sign In              ]               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│  Or continue with:                                         │
│  [Google] [Microsoft] [SSO]                               │
│                                                             │
│  Don't have an account? [Sign Up]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Login Method Selection States

**Username Selected:**
- Label: "Username"
- Placeholder: "Enter your username"
- Validation: 3+ characters, alphanumeric

**Email Selected:**
- Label: "Email Address"
- Placeholder: "Enter your email"
- Validation: Valid email format

**Mobile Selected:**
- Label: "Mobile Number"
- Placeholder: "+1 (555) 123-4567"
- Validation: Valid phone format, country code

**Admission Number Selected:**
- Label: "Admission Number"
- Placeholder: "ADM-2024-001"
- Validation: School format

**Staff ID Selected:**
- Label: "Staff ID"
- Placeholder: "STF-2024-001"
- Validation: School format

**Parent ID Selected:**
- Label: "Parent ID"
- Placeholder: "PAR-2024-001"
- Validation: School format

**QR Code Selected:**
- Display QR code scanner interface
- Camera permission request
- Alternative: "Enter QR code manually"

#### Responsive Breakpoints

**Desktop (>1024px):**
- Centered card layout (480px width)
- Side-by-side with hero image
- Full keyboard navigation

**Tablet (768px-1024px):**
- Centered card layout (400px width)
- Simplified hero section
- Touch-optimized inputs

**Mobile (<768px):**
- Full-width layout
- Stacked login method selector
- Bottom sheet for QR scanner

---

### 2. Registration Page (`/auth/register`)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin                    [Language] [Theme]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│              │         Create Account       │                │
│              │    Join SchoolAdmin today     │                │
│              └─────────────────────────────┘                │
│                                                             │
│  Step 1 of 3: Account Information    [Progress: 33%]        │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Account Type:                                        │  │
│  │  [•] Student  [ ] Teacher  [ ] Staff  [ ] Parent    │  │
│  │                                                       │  │
│  │  Full Name *                                         │  │
│  │  [Enter your full name]                              │  │
│  │                                                       │  │
│  │  Email Address *                                     │  │
│  │  [Enter your email]                                  │  │
│  │                                                       │  │
│  │  Mobile Number *                                     │  │
│  │  [+1 ▼] [Enter mobile number]                        │  │
│  │                                                       │  │
│  │  Preferred Login Method:                              │  │
│  │  [•] Username  [ ] Email  [ ] Mobile                 │  │
│  │                                                       │  │
│  │  [Create Username *] (if username selected)         │  │
│  │  [Enter username]                                    │  │
│  │                                                       │  │
│  │  Password *                                          │  │
│  │  [••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │  Strength: [████████░░] Strong                        │  │
│  │  ✓ 8+ characters  ✓ Uppercase  ✓ Number  ✓ Special  │  │
│  │                                                       │  │
│  │  Confirm Password *                                  │  │
│  │  [••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │                                                       │  │
│  │  [I agree to Terms & Conditions] [Privacy Policy]   │  │
│  │                                                       │  │
│  │  [              Continue              ]               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Already have an account? [Sign In]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Multi-Step Registration Flow

**Step 1: Account Information**
- Account type selection
- Personal information
- Login method preference
- Password setup

**Step 2: Additional Information**
- Role-specific fields (student: admission #, teacher: qualification)
- Address information
- Emergency contact

**Step 3: Verification**
- Email verification
- Mobile verification (OTP)
- 2FA setup (optional)
- Device registration

---

### 3. Forgot Password Page (`/auth/forgot-password`)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin                    [Language] [Theme]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│              │        Reset Password        │                │
│              │   We'll help you recover it  │                │
│              └─────────────────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  How would you like to reset your password?         │  │
│  │                                                       │  │
│  │  [•] Email    [ ] SMS    [ ] Security Questions    │  │
│  │                                                       │  │
│  │  Enter your identifier:                               │  │
│  │  [Username/Email/Mobile #]                            │  │
│  │  ••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │                                                       │  │
│  │  [Send Reset Link]                                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│  Remember your password? [Sign In]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Recovery Method Options

**Email Recovery:**
- Send password reset link to email
- Link expires in 1 hour
- Single-use token

**SMS Recovery:**
- Send 6-digit OTP to mobile
- OTP expires in 15 minutes
- Rate limited (3 attempts)

**Security Questions:**
- Pre-configured security questions
- Answer verification
- Fallback method

---

### 4. Reset Password Page (`/auth/reset-password`)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin                    [Language] [Theme]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│              │        Set New Password      │                │
│              │    Create a secure password   │                │
│              └─────────────────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  New Password *                                      │  │
│  │  [••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │  Strength: [████████░░] Strong                        │  │
│  │  ✓ 8+ characters  ✓ Uppercase  ✓ Number  ✓ Special  │  │
│  │                                                       │  │
│  │  Confirm New Password *                              │  │
│  │  [••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │                                                       │  │
│  │  Password Requirements:                              │  │
│  │  • Minimum 8 characters                              │  │
│  │  • At least one uppercase letter                      │  │
│  │  • At least one number                                │  │
│  │  • At least one special character                      │  │
│  │  • Cannot be same as previous password                 │  │
│  │                                                       │  │
│  │  [              Update Password         ]               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│  [Back to Login]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Change Password Page (`/auth/change-password`)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin  [Dashboard] [Profile] [Settings] [Logout]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Settings > Security > Change Password                      │
│                                                             │
│              ┌─────────────────────────────┐                │
│              │        Change Password       │                │
│              │    Keep your account secure  │                │
│              └─────────────────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Current Password *                                  │  │
│  │  [••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │                                                       │  │
│  │  New Password *                                      │  │
│  │  [••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │  Strength: [████████░░] Strong                        │  │
│  │                                                       │  │
│  │  Confirm New Password *                              │  │
│  │  [••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │                                                       │  │
│  │  [              Update Password         ]               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Last password changed: 30 days ago                        │
│  Next password change required: Never                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. Two-Factor Authentication Page (`/auth/2fa`)

#### Setup Mode
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin                    [Language] [Theme]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│              │   Two-Factor Authentication  │                │
│              │     Add an extra security layer │             │
│              └─────────────────────────────┘                │
│                                                             │
│  Step 1 of 2: Choose 2FA Method    [Progress: 50%]          │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Select your preferred 2FA method:                   │  │
│  │                                                       │  │
│  │  [•] Authenticator App (Recommended)                  │  │
│  │      Use Google Authenticator, Authy, or similar     │  │
│  │                                                       │  │
│  │  [ ] SMS                                             │  │
│  │      Receive codes via text message                  │  │
│  │                                                       │  │
│  │  [ ] Email                                           │  │
│  │      Receive codes via email                         │  │
│  │                                                       │  │
│  │  [ ] Hardware Token                                   │  │
│  │      Use a physical security key                     │  │
│  │                                                       │  │
│  │  [              Continue              ]               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [Skip for now] (Not recommended)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Verification Mode (Authenticator App)
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin                    [Language] [Theme]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│              │   Two-Factor Authentication  │                │
│              │     Enter your verification code │            │
│              └─────────────────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Scan the QR code with your authenticator app:       │  │
│  │                                                       │  │
│  │              ┌─────────────┐                          │  │
│  │              │             │                          │  │
│  │              │   [QR]      │                          │  │
│  │              │   CODE      │                          │  │
│  │              │             │                          │  │
│  │              └─────────────┘                          │  │
│  │                                                       │  │
│  │  Or enter code manually:                              │  │
│  │  ABC123XYZ456                                         │  │
│  │  [Copy]                                               │  │
│  │                                                       │  │
│  │  Enter the 6-digit code from your app:               │  │
│  │  [•••••••]                                            │  │
│  │                                                       │  │
│  │  [              Verify               ]               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Can't scan? [Enter code manually]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7. Device Verification Page (`/auth/device/verify`)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin                    [Language] [Theme]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│              │       New Device Detected     │                │
│              │  Verify it's really you       │                │
│              └─────────────────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Device Information:                                 │  │
│  │  • Device: MacBook Pro                              │  │
│  │  • Browser: Chrome 120                              │  │
│  │  • Location: San Francisco, CA                       │  │
│  │  • IP Address: 192.168.1.100                         │  │
│  │                                                       │  │
│  │  Choose a verification method:                       │  │
│  │                                                       │  │
│  │  [•] Send code to email (j***@gmail.com)            │  │
│  │  [ ] Send code to mobile (+1 ***-***-1234)          │  │
│  │  [ ] Use authenticator app                           │  │
│  │                                                       │  │
│  │  Enter verification code:                            │  │
│  │  [•••••••]                                            │  │
│  │                                                       │  │
│  │  [Remember this device for 30 days]                 │  │
│  │                                                       │  │
│  │  [              Verify Device          ]               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Not you? [Report suspicious activity]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8. Account Recovery Page (`/auth/account/recover`)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SchoolAdmin                    [Language] [Theme]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│              │       Account Recovery       │                │
│              │   Regain access to your account │              │
│              └─────────────────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  What information can you provide?                  │  │
│  │                                                       │  │
│  │  [•] Username                                         │  │
│  │  [ ] Email Address                                    │  │
│  │  [ ] Mobile Number                                    │  │
│  │  [ ] Admission Number (Students)                      │  │
│  │  [ ] Staff ID (Teachers/Staff)                        │  │
│  │  [ ] Parent ID (Parents)                             │  │
│  │                                                       │  │
│  │  [Enter identifier]                                   │  │
│  │  ••••••••••••••••••••••••••••••••••••••••••••••••••│  │
│  │                                                       │  │
│  │  [              Continue              ]               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│  For account recovery, you may need to verify:             │
│  • Email address                                           │
│  • Mobile number                                           │
│  • Security questions                                      │
│  • Identity verification (document upload)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile App Wireframes

### 1. Login Screen

#### Portrait Layout
```
┌─────────────────────────────┐
│  [Logo] SchoolAdmin         │
├─────────────────────────────┤
│                             │
│      Welcome Back!          │
│   Sign in to your account    │
│                             │
│  ┌───────────────────────┐  │
│  │ Login Method:          │  │
│  │ [▼ Username]           │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ [Username/Email]       │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ [Password]      [👁]  │  │
│  └───────────────────────┘  │
│                             │
│  [☑ Remember me]            │
│                             │
│  [    Sign In    ]          │
│                             │
│  ─────────────────────      │
│  Or scan QR code:            │
│  [   [📷] Scan QR   ]       │
│                             │
│  Forgot password?            │
│  Don't have account? Sign up │
│                             │
└─────────────────────────────┘
```

#### Login Method Bottom Sheet
```
┌─────────────────────────────┐
│  Select Login Method    [×]  │
├─────────────────────────────┤
│                             │
│  [👤] Username              │
│  [📧] Email                 │
│  [📱] Mobile Number          │
│  [🎓] Admission Number       │
│  [👨‍🏫] Staff ID              │
│  [👪] Parent ID              │
│  [📷] QR Code                │
│                             │
│  [Cancel]                   │
└─────────────────────────────┘
```

---

### 2. Registration Screen

#### Step 1: Account Type
```
┌─────────────────────────────┐
│  [←] Create Account         │
├─────────────────────────────┤
│                             │
│  Step 1 of 3                │
│  ████████░░░░░░░░░░         │
│                             │
│  Select Account Type:        │
│                             │
│  ┌───────────────────────┐  │
│  │   [👨‍🎓] Student        │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   [👨‍🏫] Teacher        │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   [👨‍💼] Staff           │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   [👪] Parent          │  │
│  └───────────────────────┘  │
│                             │
│  [Continue →]              │
│                             │
└─────────────────────────────┘
```

---

### 3. QR Code Scanner

#### Scanner Interface
```
┌─────────────────────────────┐
│  [←] Scan QR Code          │
├─────────────────────────────┤
│                             │
│     Position QR code        │
│     within the frame        │
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   ╔═══════════════╗   │  │
│  │   ║               ║   │  │
│  │   ║   [CAMERA]    ║   │  │
│  │   ║   VIEWFINDER   ║   │  │
│  │   ║               ║   │  │
│  │   ╚═══════════════╝   │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  Flash: [⚡ Off]             │
│                             │
│  Can't scan?                │
│  [Enter code manually]      │
│                             │
└─────────────────────────────┘
```

---

### 4. 2FA Verification

#### Authenticator App
```
┌─────────────────────────────┐
│  [←] 2FA Verification       │
├─────────────────────────────┤
│                             │
│  Enter the 6-digit code     │
│  from your authenticator    │
│                             │
│  ┌───────────────────────┐  │
│  │   [••••••]            │  │
│  └───────────────────────┘  │
│                             │
│  Code expires in: 0:28      │
│                             │
│  [Verify]                   │
│                             │
│  ─────────────────────      │
│  Need help?                 │
│  [Use backup code]          │
│  [Contact support]          │
│                             │
└─────────────────────────────┘
```

---

## Component Specifications

### Shared Components

#### 1. LoginMethodSelector
- Props: `selectedMethod`, `onMethodChange`, `availableMethods`
- State: `isOpen` (for mobile bottom sheet)
- Responsive: Card on desktop, bottom sheet on mobile

#### 2. PasswordStrengthIndicator
- Props: `password`, `onStrengthChange`
- Visual: Progress bar with color coding
- Requirements: Length, uppercase, number, special

#### 3. OTPInput
- Props: `length`, `onComplete`, `onResend`
- Auto-focus next input
- Paste support
- Countdown timer for resend

#### 4. QRCodeScanner
- Props: `onScan`, `onError`
- Camera permission handling
- Fallback to manual entry
- Flash toggle

#### 5. DeviceInfoCard
- Props: `device`, `location`, `ip`
- Security indicators
- Trust toggle

### Form Validation Patterns

#### Username
- Min 3 characters, max 50
- Alphanumeric + underscore + hyphen
- No spaces or special characters

#### Email
- Standard email format
- Case insensitive
- Domain validation

#### Mobile Number
- International format (+1 XXX-XXX-XXXX)
- Country code validation
- Digit-only after country code

#### Password
- Min 8 characters
- At least 1 uppercase
- At least 1 number
- At least 1 special character
- No common passwords
- Not same as username

### Error Handling Patterns

#### Inline Validation
- Real-time feedback
- Clear error messages
- Visual indicators (red border, icon)

#### Submit Validation
- Comprehensive error list
- Scroll to first error
- Focus on first invalid field

#### API Errors
- User-friendly messages
- Retry suggestions
- Contact support option

### Loading States

#### Button Loading
- Spinner or progress indicator
- Disabled state
- Text change ("Processing...")

#### Page Loading
- Skeleton screens
- Progress indicators
- Smooth transitions

### Success States

#### Confirmation Messages
- Clear success indication
- Next step guidance
- Auto-redirect option

#### Toast Notifications
- Brief success message
- Dismiss action
- Auto-dismiss timer

---

## Accessibility Features

### Keyboard Navigation
- Tab order logical
- Enter/Space for buttons
- Escape to cancel
- Focus indicators visible

### Screen Reader Support
- ARIA labels
- Live regions for errors
- Descriptive link text
- Form field associations

### Color Contrast
- WCAG AA compliant
- High contrast mode support
- Color-independent indicators

### Touch Targets
- Minimum 44x44px
- Spacing between elements
- Gesture support

---

## Responsive Behavior

### Desktop (>1024px)
- Max-width containers
- Hover states
- Tooltips
- Side-by-side layouts

### Tablet (768px-1024px)
- Touch-optimized
- Simplified layouts
- Larger touch targets
- Bottom navigation

### Mobile (<768px)
- Full-width elements
- Bottom sheets
- Swipe gestures
- Hamburger menu

---

## Security UI Elements

### Security Indicators
- Lock icons for secure fields
- HTTPS badge
- Session timeout warnings
- Device trust indicators

### Privacy Controls
- Data collection notices
- Consent checkboxes
- Privacy policy links
- Data deletion options

### Trust Signals
- Verified badges
- Security certifications
- Compliance badges
- Trust seals
