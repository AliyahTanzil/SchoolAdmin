# Authentication State Management Architecture

## Overview

This document defines the state management architecture for authentication flows across both website and mobile app platforms, ensuring consistent state handling, persistence, and synchronization.

---

## State Management Strategy

### Website (React Context + Hooks)
- **Primary**: React Context API for global auth state
- **Secondary**: Component-level state for UI-specific data
- **Persistence**: HttpOnly cookies for tokens, localStorage for preferences
- **Synchronization**: Token refresh middleware, session polling

### Mobile App (React Context + AsyncStorage)
- **Primary**: React Context API for global auth state
- **Secondary**: Component-level state for UI-specific data
- **Persistence**: AsyncStorage for tokens, SecureStore for sensitive data
- **Synchronization**: Token refresh middleware, session polling

---

## Website State Management

### Context Structure

```javascript
// context/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext(null);

const initialState = {
  // User State
  user: null,
  isAuthenticated: false,
  
  // Session State
  session: null,
  sessions: [],
  currentSessionId: null,
  
  // Authentication State
  loading: false,
  error: null,
  
  // Login Method State
  loginMethod: 'username',
  loginMethodPreference: null,
  
  // 2FA State
  twoFactorEnabled: false,
  twoFactorMethod: null,
  twoFactorVerified: false,
  
  // Device State
  deviceVerified: false,
  trustedDevices: [],
  currentDevice: null,
  
  // Password State
  passwordChangedAt: null,
  passwordExpiry: null,
  
  // UI State
  currentAuthStep: 'login', // login, register, forgot-password, etc.
  redirectPath: null,
};
```

### Auth Reducer

```javascript
const authReducer = (state, action) => {
  switch (action.type) {
    // Authentication Actions
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true,
        session: action.payload.session,
        currentSessionId: action.payload.session.id,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        session: null,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        loginMethodPreference: state.loginMethodPreference,
      };
    
    // Session Actions
    case 'SESSION_UPDATE':
      return {
        ...state,
        session: action.payload,
      };
    
    case 'SESSIONS_LOADED':
      return {
        ...state,
        sessions: action.payload,
      };
    
    case 'SESSION_REVOKED':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
      };
    
    // 2FA Actions
    case '2FA_ENABLED':
      return {
        ...state,
        twoFactorEnabled: true,
        twoFactorMethod: action.payload.method,
      };
    
    case '2FA_DISABLED':
      return {
        ...state,
        twoFactorEnabled: false,
        twoFactorMethod: null,
      };
    
    case '2FA_VERIFIED':
      return {
        ...state,
        twoFactorVerified: true,
      };
    
    // Device Actions
    case 'DEVICE_VERIFIED':
      return {
        ...state,
        deviceVerified: true,
        currentDevice: action.payload,
      };
    
    case 'TRUSTED_DEVICES_LOADED':
      return {
        ...state,
        trustedDevices: action.payload,
      };
    
    case 'DEVICE_REVOKED':
      return {
        ...state,
        trustedDevices: state.trustedDevices.filter(d => d.id !== action.payload),
      };
    
    // Login Method Actions
    case 'LOGIN_METHOD_SET':
      return {
        ...state,
        loginMethod: action.payload,
      };
    
    case 'LOGIN_METHOD_PREFERENCE_SET':
      return {
        ...state,
        loginMethodPreference: action.payload,
      };
    
    // UI State Actions
    case 'AUTH_STEP_SET':
      return {
        ...state,
        currentAuthStep: action.payload,
      };
    
    case 'REDIRECT_PATH_SET':
      return {
        ...state,
        redirectPath: action.payload,
      };
    
    case 'ERROR_CLEAR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};
```

### Auth Provider

```javascript
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAccessToken();
        const user = getUserFromStorage();
        const session = getSessionFromStorage();
        
        if (token && user) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, session: session || null }
          });
          
          // Refresh token if needed
          await refreshTokenIfNeeded();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      }
    };
    
    initializeAuth();
  }, []);
  
  // Token refresh polling
  useEffect(() => {
    if (!state.isAuthenticated) return;
    
    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Token refresh error:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes
    
    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated]);
  
  // Session activity polling
  useEffect(() => {
    if (!state.isAuthenticated || !state.currentSessionId) return;
    
    const activityInterval = setInterval(async () => {
      try {
        await updateSessionActivity(state.currentSessionId);
      } catch (error) {
        console.error('Session activity update error:', error);
      }
    }, 5 * 60 * 1000); // Update every 5 minutes
    
    return () => clearInterval(activityInterval);
  }, [state.isAuthenticated, state.currentSessionId]);
  
  const value = {
    state,
    dispatch,
    // Convenience methods
    login: async (identifier, password, method) => {
      dispatch({ type: 'AUTH_START' });
      try {
        const result = await authService.login(identifier, password, method);
        
        // Store tokens securely
        setAccessToken(result.accessToken);
        setRefreshToken(result.refreshToken);
        setSession(result.session);
        setUser(result.user);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: result.user, session: result.session }
        });
        
        return result;
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: error.message });
        throw error;
      }
    },
    
    logout: async () => {
      try {
        if (state.currentSessionId) {
          await authService.logout(state.currentSessionId);
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        clearTokens();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    },
    
    refreshToken: async () => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');
        
        const result = await authService.refreshToken(refreshToken);
        
        setAccessToken(result.accessToken);
        setSession(result.session);
        
        dispatch({
          type: 'SESSION_UPDATE',
          payload: result.session
        });
        
        return result;
      } catch (error) {
        dispatch({ type: 'AUTH_LOGOUT' });
        throw error;
      }
    },
    
    // Additional methods...
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Session Context

```javascript
// context/SessionContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionService.getSessions();
      setSessions(data);
      setCurrentSession(data.find(s => s.isCurrent) || null);
    } catch (error) {
      console.error('Load sessions error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const revokeSession = async (sessionId) => {
    try {
      await sessionService.revokeSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Revoke session error:', error);
      throw error;
    }
  };
  
  const revokeAllSessions = async (currentSessionId) => {
    try {
      await sessionService.revokeAllSessions(currentSessionId);
      setSessions(sessions.filter(s => s.id === currentSessionId));
    } catch (error) {
      console.error('Revoke all sessions error:', error);
      throw error;
    }
  };
  
  const value = {
    sessions,
    currentSession,
    loading,
    loadSessions,
    revokeSession,
    revokeAllSessions,
  };
  
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
```

---

## Mobile App State Management

### Context Structure

```javascript
// context/AuthContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const initialState = {
  // User State
  user: null,
  isAuthenticated: false,
  
  // Session State
  session: null,
  sessions: [],
  currentSessionId: null,
  
  // Authentication State
  loading: false,
  error: null,
  
  // Login Method State
  loginMethod: 'username',
  loginMethodPreference: null,
  
  // 2FA State
  twoFactorEnabled: false,
  twoFactorMethod: null,
  twoFactorVerified: false,
  
  // Device State
  deviceVerified: false,
  trustedDevices: [],
  currentDevice: null,
  biometricEnabled: false,
  
  // Password State
  passwordChangedAt: null,
  passwordExpiry: null,
  
  // UI State
  currentAuthStep: 'login',
  redirectScreen: null,
};
```

### Auth Reducer (Mobile)

```javascript
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true,
        session: action.payload.session,
        currentSessionId: action.payload.session.id,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        session: null,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        loginMethodPreference: state.loginMethodPreference,
      };
    
    // Biometric Actions (Mobile Only)
    case 'BIOMETRIC_ENABLED':
      return {
        ...state,
        biometricEnabled: true,
      };
    
    case 'BIOMETRIC_DISABLED':
      return {
        ...state,
        biometricEnabled: false,
      };
    
    // Same as website for other actions...
    default:
      return state;
  }
};
```

### Auth Provider (Mobile)

```javascript
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const userJson = await AsyncStorage.getItem('user');
        const sessionJson = await AsyncStorage.getItem('session');
        
        if (token && userJson) {
          const user = JSON.parse(userJson);
          const session = sessionJson ? JSON.parse(sessionJson) : null;
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, session }
          });
          
          // Check biometric availability
          const biometricAvailable = await biometricService.isAvailable();
          if (biometricAvailable) {
            const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
            if (biometricEnabled === 'true') {
              dispatch({ type: 'BIOMETRIC_ENABLED' });
            }
          }
          
          // Refresh token if needed
          await refreshTokenIfNeeded();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      }
    };
    
    initializeAuth();
  }, []);
  
  // Token refresh polling
  useEffect(() => {
    if (!state.isAuthenticated) return;
    
    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Token refresh error:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    }, 14 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated]);
  
  const value = {
    state,
    dispatch,
    login: async (identifier, password, method) => {
      dispatch({ type: 'AUTH_START' });
      try {
        const result = await authService.login(identifier, password, method);
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('accessToken', result.accessToken);
        await AsyncStorage.setItem('refreshToken', result.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        await AsyncStorage.setItem('session', JSON.stringify(result.session));
        
        // Store sensitive data in SecureStore
        await SecureStore.setItemAsync('refreshTokenSecure', result.refreshToken);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: result.user, session: result.session }
        });
        
        return result;
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: error.message });
        throw error;
      }
    },
    
    logout: async () => {
      try {
        if (state.currentSessionId) {
          await authService.logout(state.currentSessionId);
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        await AsyncStorage.multiRemove([
          'accessToken',
          'refreshToken',
          'user',
          'session'
        ]);
        await SecureStore.deleteItemAsync('refreshTokenSecure');
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    },
    
    enableBiometric: async () => {
      try {
        const success = await biometricService.enroll();
        if (success) {
          await AsyncStorage.setItem('biometricEnabled', 'true');
          dispatch({ type: 'BIOMETRIC_ENABLED' });
        }
        return success;
      } catch (error) {
        console.error('Enable biometric error:', error);
        throw error;
      }
    },
    
    authenticateWithBiometric: async () => {
      try {
        const success = await biometricService.authenticate();
        if (success) {
          // Auto-login with stored credentials
          const identifier = await SecureStore.getItemAsync('identifier');
          const password = await SecureStore.getItemAsync('password');
          if (identifier && password) {
            return await login(identifier, password, state.loginMethodPreference);
          }
        }
        return false;
      } catch (error) {
        console.error('Biometric authentication error:', error);
        throw error;
      }
    },
    
    // Additional methods...
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## State Synchronization

### Website Synchronization

#### Token Refresh Middleware
```javascript
// utils/security/tokenManager.js
export const tokenRefreshMiddleware = (store) => (next) => (action) => {
  if (action.type === 'API_REQUEST') {
    const token = getAccessToken();
    if (token && isTokenExpiringSoon(token)) {
      refreshToken().catch(console.error);
    }
  }
  return next(action);
};
```

#### Session Polling
```javascript
// services/auth/sessionService.js
export const startSessionPolling = (sessionId) => {
  const interval = setInterval(async () => {
    try {
      await updateSessionActivity(sessionId);
    } catch (error) {
      console.error('Session poll error:', error);
      clearInterval(interval);
    }
  }, 5 * 60 * 1000); // 5 minutes
  
  return () => clearInterval(interval);
};
```

### Mobile App Synchronization

#### Background Token Refresh
```javascript
// services/authService.js
export const setupBackgroundRefresh = () => {
  AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      refreshToken().catch(console.error);
    }
  });
};
```

#### Network State Handling
```javascript
// utils/network.js
export const setupNetworkListener = (callback) => {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      callback();
    }
  });
};
```

---

## State Persistence

### Website Persistence

#### Token Storage
```javascript
// utils/security/tokenManager.js
export const setAccessToken = (token) => {
  document.cookie = `accessToken=${token}; path=/; secure; HttpOnly; SameSite=Strict; max-age=${15 * 60}`;
};

export const setRefreshToken = (token) => {
  document.cookie = `refreshToken=${token}; path=/; secure; HttpOnly; SameSite=Strict; max-age=${7 * 24 * 60 * 60}`;
};

export const getAccessToken = () => {
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : null;
};

export const getRefreshToken = () => {
  const match = document.cookie.match(/refreshToken=([^;]+)/);
  return match ? match[1] : null;
};

export const clearTokens = () => {
  document.cookie = 'accessToken=; path=/; secure; HttpOnly; SameSite=Strict; max-age=0';
  document.cookie = 'refreshToken=; path=/; secure; HttpOnly; SameSite=Strict; max-age=0';
};
```

#### User Data Storage
```javascript
// utils/storage/userStorage.js
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

export const clearUser = () => {
  localStorage.removeItem('user');
};
```

#### Preferences Storage
```javascript
// utils/storage/preferencesStorage.js
export const setLoginMethodPreference = (method) => {
  localStorage.setItem('loginMethodPreference', method);
};

export const getLoginMethodPreference = () => {
  return localStorage.getItem('loginMethodPreference') || 'username';
};
```

### Mobile App Persistence

#### Token Storage
```javascript
// services/storage/tokenStorage.js
export const setAccessToken = async (token) => {
  await AsyncStorage.setItem('accessToken', token);
};

export const setRefreshToken = async (token) => {
  await AsyncStorage.setItem('refreshToken', token);
  await SecureStore.setItemAsync('refreshTokenSecure', token);
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem('accessToken');
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refreshTokenSecure');
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  await SecureStore.deleteItemAsync('refreshTokenSecure');
};
```

#### User Data Storage
```javascript
// services/storage/userStorage.js
export const setUser = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async () => {
  const userJson = await AsyncStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

export const clearUser = async () => {
  await AsyncStorage.removeItem('user');
};
```

#### Biometric Credentials Storage
```javascript
// services/storage/biometricStorage.js
export const storeBiometricCredentials = async (identifier, password) => {
  await SecureStore.setItemAsync('biometricIdentifier', identifier);
  await SecureStore.setItemAsync('biometricPassword', password);
};

export const getBiometricCredentials = async () => {
  const identifier = await SecureStore.getItemAsync('biometricIdentifier');
  const password = await SecureStore.getItemAsync('biometricPassword');
  return { identifier, password };
};

export const clearBiometricCredentials = async () => {
  await SecureStore.deleteItemAsync('biometricIdentifier');
  await SecureStore.deleteItemAsync('biometricPassword');
};
```

---

## State Validation

### Website Validation

#### Token Validation
```javascript
// utils/security/tokenValidation.js
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (error) {
    return false;
  }
};

export const isTokenExpiringSoon = (token, thresholdMinutes = 5) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    const threshold = thresholdMinutes * 60;
    return decoded.exp - now < threshold;
  } catch (error) {
    return false;
  }
};
```

### Mobile App Validation

#### Token Validation
```javascript
// utils/security/tokenValidation.js
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (error) {
    return false;
  }
};
```

---

## State Recovery

### Website Recovery

#### Session Recovery
```javascript
// utils/recovery/sessionRecovery.js
export const recoverSession = async () => {
  const token = getAccessToken();
  const user = getUser();
  
  if (token && user) {
    try {
      // Validate token with server
      const isValid = await authService.validateToken(token);
      if (isValid) {
        return { user, token };
      } else {
        // Token invalid, clear and redirect to login
        clearTokens();
        clearUser();
        return null;
      }
    } catch (error) {
      console.error('Session recovery error:', error);
      clearTokens();
      clearUser();
      return null;
    }
  }
  
  return null;
};
```

### Mobile App Recovery

#### Session Recovery
```javascript
// utils/recovery/sessionRecovery.js
export const recoverSession = async () => {
  try {
    const token = await getAccessToken();
    const user = await getUser();
    
    if (token && user) {
      const isValid = await authService.validateToken(token);
      if (isValid) {
        return { user, token };
      } else {
        await clearTokens();
        await clearUser();
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Session recovery error:', error);
    await clearTokens();
    await clearUser();
    return null;
  }
};
```

---

## State Testing

### Website State Testing

```javascript
// __tests__/context/AuthContext.test.jsx
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

describe('AuthContext', () => {
  test('initial state is correct', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.user).toBe(null);
  });
  
  test('login updates state correctly', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('testuser', 'password123', 'username');
    });
    
    expect(result.current.state.isAuthenticated).toBe(true);
    expect(result.current.state.user).toBeTruthy();
  });
  
  test('logout clears state correctly', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('testuser', 'password123', 'username');
      await result.current.logout();
    });
    
    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.user).toBe(null);
  });
});
```

### Mobile App State Testing

```javascript
// __tests__/context/AuthContext.test.js
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

describe('AuthContext', () => {
  test('initial state is correct', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.user).toBe(null);
  });
  
  test('login updates state correctly', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('testuser', 'password123', 'username');
    });
    
    expect(result.current.state.isAuthenticated).toBe(true);
    expect(result.current.state.user).toBeTruthy();
  });
});
```

---

## Performance Optimization

### Memoization

```javascript
// hooks/auth/useAuth.js
import { useMemo } from 'react';

export const useAuth = () => {
  const { state, dispatch, login, logout, refreshToken } = useContext(AuthContext);
  
  const authValue = useMemo(() => ({
    state,
    dispatch,
    login,
    logout,
    refreshToken,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }), [state, login, logout, refreshToken]);
  
  return authValue;
};
```

### Lazy Loading

```javascript
// context/AuthContext.jsx
const LazyTwoFactorSetup = lazy(() => import('../components/Auth/TwoFactor/TwoFactorSetupPage'));
const LazyDeviceVerification = lazy(() => import('../components/Auth/Device/DeviceVerificationPage'));
```

---

## Error Handling

### Global Error Handler

```javascript
// utils/errorHandler.js
export const handleAuthError = (error) => {
  console.error('Auth error:', error);
  
  // Specific error handling
  if (error.message.includes('token expired')) {
    return 'Your session has expired. Please login again.';
  }
  
  if (error.message.includes('invalid credentials')) {
    return 'Invalid username or password.';
  }
  
  if (error.message.includes('network')) {
    return 'Network error. Please check your connection.';
  }
  
  return 'An error occurred. Please try again.';
};
```

---

## Security Considerations

### State Encryption

```javascript
// utils/security/encryption.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY;

export const encryptState = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptState = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

### State Sanitization

```javascript
// utils/security/sanitization.js
export const sanitizeUserState = (user) => {
  const { password, passwordHash, ...sanitized } = user;
  return sanitized;
};
```

---

## Summary

This state management architecture provides a comprehensive, secure, and performant solution for authentication state across both website and mobile platforms. The design emphasizes security, performance, and maintainability while ensuring a seamless user experience with proper state synchronization and persistence.
