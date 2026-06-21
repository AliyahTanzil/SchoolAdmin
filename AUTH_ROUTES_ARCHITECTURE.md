# Authentication Routes Architecture

## Overview

This document defines the routing architecture for authentication flows across both website and mobile app platforms, ensuring proper navigation, protected routes, and seamless user experience.

---

## Website Routes (React Router v6)

### Route Structure

```
website/src/
├── routes/
│   ├── index.jsx
│   ├── publicRoutes.jsx
│   ├── protectedRoutes.jsx
│   ├── authRoutes.jsx
│   └── index.js
```

### Route Definitions

#### Public Routes
```javascript
// routes/publicRoutes.jsx
import { Route } from 'react-router-dom';
import LoginPage from '../components/Auth/Login/LoginPage';
import RegisterPage from '../components/Auth/Register/RegisterPage';
import ForgotPasswordPage from '../components/Auth/Password/ForgotPasswordPage';
import ResetPasswordPage from '../components/Auth/Password/ResetPasswordPage';

export const publicRoutes = (
  <>
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<RegisterPage />} />
    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
  </>
);
```

#### Protected Routes
```javascript
// routes/protectedRoutes.jsx
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import ChangePasswordPage from '../components/Auth/Password/ChangePasswordPage';
import TwoFactorSetupPage from '../components/Auth/TwoFactor/TwoFactorSetupPage';
import TwoFactorVerifyPage from '../components/Auth/TwoFactor/TwoFactorVerifyPage';
import DeviceVerificationPage from '../components/Auth/Device/DeviceVerificationPage';
import AccountRecoveryPage from '../components/Auth/Recovery/AccountRecoveryPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  
  return children;
};

export const protectedRoutes = (
  <>
    <Route 
      path="/auth/change-password" 
      element={
        <ProtectedRoute>
          <ChangePasswordPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/auth/2fa/setup" 
      element={
        <ProtectedRoute>
          <TwoFactorSetupPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/auth/2fa/verify" 
      element={
        <ProtectedRoute>
          <TwoFactorVerifyPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/auth/device/verify" 
      element={
        <ProtectedRoute>
          <DeviceVerificationPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/auth/account/recover" 
      element={
        <ProtectedRoute>
          <AccountRecoveryPage />
        </ProtectedRoute>
      } 
    />
  </>
);
```

#### Authentication Routes with Middleware
```javascript
// routes/authRoutes.jsx
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import LoginPage from '../components/Auth/Login/LoginPage';
import RegisterPage from '../components/Auth/Register/RegisterPage';

const AuthRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  
  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  
  return children;
};

export const authRoutes = (
  <>
    <Route 
      path="/auth/login" 
      element={
        <AuthRoute>
          <LoginPage />
        </AuthRoute>
      } 
    />
    <Route 
      path="/auth/register" 
      element={
        <AuthRoute>
          <RegisterPage />
        </AuthRoute>
      } 
    />
  </>
);
```

#### Main Routes Configuration
```javascript
// routes/index.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { protectedRoutes } from './protectedRoutes';
import { authRoutes } from './authRoutes';
import Landing from '../components/Landing';
import Dashboard from '../components/Dashboard';
import StudentList from '../components/Students/StudentList';
import TeacherList from '../components/Teachers/TeacherList';
import Attendance from '../components/Attendance';
import SubjectManager from '../components/Planning/SubjectManager';
import TimetableBuilder from '../components/Planning/TimetableBuilder';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      
      {/* Authentication Routes */}
      {authRoutes}
      {publicRoutes}
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/students" 
        element={
          <ProtectedRoute>
            <StudentList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teachers" 
        element={
          <ProtectedRoute>
            <TeacherList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/planning/subjects" 
        element={
          <ProtectedRoute>
            <SubjectManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/planning/timetable" 
        element={
          <ProtectedRoute>
            <TimetableBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/attendance" 
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected Auth Routes */}
      {protectedRoutes}
      
      {/* Catch-all - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

### Route Parameters

#### Login Page
- `?redirect=/dashboard` - Redirect after successful login
- `?method=username` - Pre-select login method

#### Register Page
- `?type=student` - Pre-select account type
- `?redirect=/dashboard` - Redirect after registration

#### Reset Password
- `:token` - Password reset token (required)

#### 2FA Verify
- `?redirect=/dashboard` - Redirect after verification

### Route Guards

#### Authentication Guard
```javascript
const requireAuth = (state) => {
  if (!state.isAuthenticated) {
    return {
      pathname: '/auth/login',
      state: { from: state.location }
    };
  }
  return null;
};
```

#### Guest Guard
```javascript
const requireGuest = (state) => {
  if (state.isAuthenticated) {
    return {
      pathname: '/dashboard',
      replace: true
    };
  }
  return null;
};
```

#### 2FA Required Guard
```javascript
const require2FA = (state) => {
  if (!state.isAuthenticated) {
    return {
      pathname: '/auth/login',
      state: { from: state.location }
    };
  }
  if (!state.user.twoFactorEnabled) {
    return {
      pathname: '/auth/2fa/setup',
      state: { from: state.location }
    };
  }
  return null;
};
```

#### Device Verification Guard
```javascript
const requireDeviceVerification = (state) => {
  if (!state.isAuthenticated) {
    return {
      pathname: '/auth/login',
      state: { from: state.location }
    };
  }
  if (!state.deviceVerified) {
    return {
      pathname: '/auth/device/verify',
      state: { from: state.location }
    };
  }
  return null;
};
```

---

## Mobile App Routes (React Navigation)

### Navigation Structure

```
mobileApp/
├── navigation/
│   ├── AuthNavigator.js
│   ├── AppNavigator.js
│   ├── TabNavigator.js
│   └── index.js
```

### Navigation Stack

#### Auth Navigator
```javascript
// navigation/AuthNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/Auth/LoginScreen';
import RegisterScreen from '../components/Auth/RegisterScreen';
import ForgotPasswordScreen from '../components/Auth/Password/ForgotPasswordScreen';
import ResetPasswordScreen from '../components/Auth/Password/ResetPasswordScreen';
import ChangePasswordScreen from '../components/Auth/Password/ChangePasswordScreen';
import TwoFactorSetupScreen from '../components/Auth/TwoFactor/TwoFactorSetupScreen';
import TwoFactorVerifyScreen from '../components/Auth/TwoFactor/TwoFactorVerifyScreen';
import DeviceVerificationScreen from '../components/Auth/Device/DeviceVerificationScreen';
import AccountRecoveryScreen from '../components/Auth/Recovery/AccountRecoveryScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="TwoFactorSetup" component={TwoFactorSetupScreen} />
      <Stack.Screen name="TwoFactorVerify" component={TwoFactorVerifyScreen} />
      <Stack.Screen name="DeviceVerification" component={DeviceVerificationScreen} />
      <Stack.Screen name="AccountRecovery" component={AccountRecoveryScreen} />
    </Stack.Navigator>
  );
}
```

#### App Navigator
```javascript
// navigation/AppNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import Landing from '../components/Landing';
import LoadingScreen from '../components/LoadingScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}
```

#### Tab Navigator
```javascript
// navigation/TabNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../components/Dashboard';
import Attendance from '../components/Attendance';
import StudentList from '../components/Students/StudentList';
import TeacherList from '../components/Teachers/TeacherList';
import Settings from '../components/Settings';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        headerShown: true
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Attendance" 
        component={Attendance}
        options={{ tabBarLabel: 'Attendance' }}
      />
      <Tab.Screen 
        name="Students" 
        component={StudentList}
        options={{ tabBarLabel: 'Students' }}
      />
      <Tab.Screen 
        name="Teachers" 
        component={TeacherList}
        options={{ tabBarLabel: 'Teachers' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={Settings}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
```

### Navigation Parameters

#### Login Screen
```javascript
navigation.navigate('Login', {
  redirect: 'Dashboard',
  method: 'username'
});
```

#### Register Screen
```javascript
navigation.navigate('Register', {
  accountType: 'student',
  redirect: 'Dashboard'
});
```

#### Reset Password Screen
```javascript
navigation.navigate('ResetPassword', {
  token: 'reset-token-123'
});
```

#### 2FA Verify Screen
```javascript
navigation.navigate('TwoFactorVerify', {
  redirect: 'Dashboard',
  method: 'authenticator'
});
```

### Navigation Guards

#### Authentication Guard
```javascript
const useAuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Landing' }]
      });
    }
  }, [isAuthenticated, navigation]);
};
```

#### 2FA Required Guard
```javascript
const use2FAGuard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated && !user.twoFactorEnabled) {
      navigation.navigate('TwoFactorSetup');
    }
  }, [user, isAuthenticated, navigation]);
};
```

#### Device Verification Guard
```javascript
const useDeviceVerificationGuard = () => {
  const { deviceVerified, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated && !deviceVerified) {
      navigation.navigate('DeviceVerification');
    }
  }, [deviceVerified, isAuthenticated, navigation]);
};
```

---

## Route Configuration

### Website Route Configuration

#### Route Metadata
```javascript
const routeConfig = {
  '/auth/login': {
    title: 'Login',
    description: 'Sign in to your SchoolAdmin account',
    requiresAuth: false,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  },
  '/auth/register': {
    title: 'Register',
    description: 'Create a new SchoolAdmin account',
    requiresAuth: false,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  },
  '/auth/forgot-password': {
    title: 'Forgot Password',
    description: 'Reset your SchoolAdmin password',
    requiresAuth: false,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  },
  '/auth/reset-password/:token': {
    title: 'Reset Password',
    description: 'Set a new password',
    requiresAuth: false,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  },
  '/auth/change-password': {
    title: 'Change Password',
    description: 'Update your password',
    requiresAuth: true,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  },
  '/auth/2fa/setup': {
    title: 'Setup Two-Factor Authentication',
    description: 'Add an extra layer of security',
    requiresAuth: true,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  },
  '/auth/2fa/verify': {
    title: 'Verify Two-Factor Authentication',
    description: 'Enter your 2FA code',
    requiresAuth: true,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  },
  '/auth/device/verify': {
    title: 'Verify Device',
    description: 'Verify your new device',
    requiresAuth: true,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  },
  '/auth/account/recover': {
    title: 'Account Recovery',
    description: 'Recover your account',
    requiresAuth: true,
    allowedRoles: ['*'],
    meta: {
      noIndex: true
    }
  }
};
```

### Mobile App Route Configuration

#### Screen Configuration
```javascript
const screenConfig = {
  Login: {
    title: 'Login',
    requiresAuth: false,
    headerShown: false
  },
  Register: {
    title: 'Register',
    requiresAuth: false,
    headerShown: false
  },
  ForgotPassword: {
    title: 'Forgot Password',
    requiresAuth: false,
    headerShown: false
  },
  ResetPassword: {
    title: 'Reset Password',
    requiresAuth: false,
    headerShown: false
  },
  ChangePassword: {
    title: 'Change Password',
    requiresAuth: true,
    headerShown: true,
    headerBackTitle: 'Back'
  },
  TwoFactorSetup: {
    title: 'Setup 2FA',
    requiresAuth: true,
    headerShown: true,
    headerBackTitle: 'Back'
  },
  TwoFactorVerify: {
    title: 'Verify 2FA',
    requiresAuth: true,
    headerShown: true,
    headerBackTitle: 'Back'
  },
  DeviceVerification: {
    title: 'Verify Device',
    requiresAuth: true,
    headerShown: true,
    headerBackTitle: 'Back'
  },
  AccountRecovery: {
    title: 'Account Recovery',
    requiresAuth: true,
    headerShown: true,
    headerBackTitle: 'Back'
  }
};
```

---

## Route Transitions

### Website Transitions

#### Login Flow
```
/ (Landing)
  ↓ [Sign In]
/auth/login
  ↓ [Login Success]
/auth/2fa/verify (if 2FA enabled)
  ↓ [Verify Success]
/auth/device/verify (if new device)
  ↓ [Verify Success]
/dashboard (redirect)
```

#### Registration Flow
```
/ (Landing)
  ↓ [Sign Up]
/auth/register
  ↓ [Step 1 Complete]
/auth/register (Step 2)
  ↓ [Step 2 Complete]
/auth/register (Step 3)
  ↓ [Registration Complete]
/auth/2fa/setup (optional)
  ↓ [Setup Complete/Skip]
/dashboard (redirect)
```

#### Password Reset Flow
```
/auth/login
  ↓ [Forgot Password]
/auth/forgot-password
  ↓ [Send Reset Link]
/auth/forgot-password (confirmation)
  ↓ [Email Link Clicked]
/auth/reset-password/:token
  ↓ [Reset Complete]
/auth/login (redirect)
```

### Mobile App Transitions

#### Login Flow
```
Landing
  ↓ [Sign In]
Login
  ↓ [Login Success]
TwoFactorVerify (if 2FA enabled)
  ↓ [Verify Success]
DeviceVerification (if new device)
  ↓ [Verify Success]
Main (Tab Navigator)
```

#### Registration Flow
```
Landing
  ↓ [Sign Up]
Register (Account Type)
  ↓ [Select Type]
Register (Account Info)
  ↓ [Complete]
Register (Additional Info)
  ↓ [Complete]
Register (Verification)
  ↓ [Complete]
TwoFactorSetup (optional)
  ↓ [Setup Complete/Skip]
Main (Tab Navigator)
```

---

## Deep Linking

### Website Deep Links
- `schooladmin://auth/login` - Open login page
- `schooladmin://auth/register` - Open registration page
- `schooladmin://auth/reset-password/TOKEN` - Open reset password with token

### Mobile App Deep Links
- `schooladmin://login` - Open login screen
- `schooladmin://register` - Open registration screen
- `schooladmin://reset-password/TOKEN` - Open reset password with token
- `schooladmin://dashboard` - Open dashboard (requires auth)

---

## Route Error Handling

### 404 Handling
```javascript
// Website
<Route path="*" element={<NotFoundPage />} />

// Mobile App
<Stack.Screen name="NotFound" component={NotFoundScreen} />
```

### Error Boundary
```javascript
// Website
<ErrorBoundary fallback={<ErrorPage />}>
  <Routes>
    {/* routes */}
  </Routes>
</ErrorBoundary>

// Mobile App
<ErrorBoundary>
  <NavigationContainer>
    {/* navigators */}
  </NavigationContainer>
</ErrorBoundary>
```

---

## Route Performance

### Code Splitting
```javascript
// Website
const LazyLoginPage = lazy(() => import('../components/Auth/Login/LoginPage'));
const LazyRegisterPage = lazy(() => import('../components/Auth/Register/RegisterPage'));

// Mobile App
const LazyLoginScreen = lazy(() => import('../components/Auth/LoginScreen'));
const LazyRegisterScreen = lazy(() => import('../components/Auth/RegisterScreen'));
```

### Preloading
```javascript
// Website - Preload auth routes on landing page
useEffect(() => {
  import('../components/Auth/Login/LoginPage');
  import('../components/Auth/Register/RegisterPage');
}, []);

// Mobile App - Preload auth screens on landing
useEffect(() => {
  Navigation.preload('Auth');
}, []);
```

---

## Route Testing

### Website Route Testing
```javascript
describe('Authentication Routes', () => {
  test('redirects to login when accessing protected route', async () => {
    render(<AppRoutes />);
    await userEvent.click(screen.getByText('Dashboard'));
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
  
  test('allows access to public routes', async () => {
    render(<AppRoutes />);
    await userEvent.click(screen.getByText('Sign In'));
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });
});
```

### Mobile App Route Testing
```javascript
describe('Authentication Navigation', () => {
  test('navigates to login screen', () => {
    const { getByText } = render(<AppNavigator />);
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Welcome Back')).toBeTruthy();
  });
  
  test('redirects unauthenticated users to landing', () => {
    const { getByText } = render(<AppNavigator />);
    expect(getByText('The Intelligent OS')).toBeTruthy();
  });
});
```

---

## Route Security

### CSRF Protection
```javascript
// Website - Add CSRF token to protected routes
const csrfProtectedRoutes = ['/auth/change-password', '/auth/2fa/setup'];
```

### Rate Limiting
```javascript
// Website - Rate limit auth routes
const rateLimitedRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
```

### Session Validation
```javascript
// Both platforms - Validate session on protected route access
const validateSession = async () => {
  const isValid = await sessionService.validate();
  if (!isValid) {
    // Redirect to login
  }
};
```

---

## Summary

This routing architecture provides a comprehensive, secure, and user-friendly navigation system for authentication flows across both website and mobile platforms. The design emphasizes security, performance, and maintainability while ensuring a seamless user experience.
