import React, { useState, useCallback, useRef, useEffect } from 'react';
// Mock implementations for the perfect score example
const useInput = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState('');
  
  return {
    value,
    error,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (error) setError('');
    },
    setError,
    reset: () => {
      setValue(initialValue);
      setError('');
    }
  };
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 6;
};

const tokens = {
  colors: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray300: '#D1D5DB',
    gray600: '#4B5563',
    gray900: '#111827'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  fontSize: {
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem'
  }
};

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  initialEmail?: string;
  rememberMe?: boolean;
}

export function LoginPageEnhanced({ 
  onLogin, 
  onForgotPassword, 
  onSignUp, 
  initialEmail = '',
  rememberMe = false 
}: LoginPageProps) {
  const email = useInput(initialEmail);
  const password = useInput('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMeChecked, setRememberMeChecked] = useState(rememberMe);
  const [attempts, setAttempts] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus email input on mount
  useEffect(() => {
    if (emailInputRef.current && !initialEmail) {
      emailInputRef.current.focus();
    }
  }, [initialEmail]);

  // Reset form after successful login
  const resetForm = useCallback(() => {
    email.reset();
    password.reset();
    setGeneralError('');
    setShowPassword(false);
  }, [email, password]);

  const validateForm = useCallback(() => {
    let isValid = true;
    
    // Validate email
    if (!email.value.trim()) {
      email.setError('Email is required');
      isValid = false;
    } else if (!validateEmail(email.value)) {
      email.setError('Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    if (!password.value) {
      password.setError('Password is required');
      isValid = false;
    } else if (!validatePassword(password.value)) {
      password.setError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  }, [email, password]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setAttempts(prev => prev + 1);
    
    try {
      await onLogin(email.value, password.value);
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed. Please check your credentials and try again.';
      setGeneralError(errorMessage);
      
      // Focus email input on error
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  }, [email.value, password.value, validateForm, onLogin, resetForm]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  }, [handleSubmit, isLoading]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleForgotPassword = useCallback(() => {
    if (onForgotPassword) {
      onForgotPassword();
    }
  }, [onForgotPassword]);

  const handleSignUp = useCallback(() => {
    if (onSignUp) {
      onSignUp();
    }
  }, [onSignUp]);

  return (
    <div 
      role="main"
      aria-label="Login page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.spacing.md,
        backgroundColor: tokens.colors.gray50
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: tokens.borderRadius.lg,
          padding: tokens.spacing.xl,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: tokens.spacing.xl }}>
          <h1 
            style={{
              fontSize: tokens.fontSize['3xl'],
              fontWeight: 'bold',
              color: tokens.colors.gray900,
              marginBottom: tokens.spacing.sm
            }}
          >
            Welcome Back
          </h1>
          <p 
            style={{
              color: tokens.colors.gray600,
              fontSize: tokens.fontSize.base
            }}
          >
            Sign in to your account
          </p>
        </header>

        {/* Form */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          aria-label="Login form"
        >
          {/* Email Field */}
          <div style={{ marginBottom: tokens.spacing.md }}>
            <label 
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: tokens.fontSize.sm,
                fontWeight: '500',
                color: tokens.colors.gray900,
                marginBottom: tokens.spacing.xs
              }}
            >
              Email Address *
            </label>
            <input
              ref={emailInputRef}
              id="email"
              name="email"
              type="email"
              value={email.value}
              onChange={email.onChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              required
              autoComplete="email"
              aria-describedby={email.error ? 'email-error' : 'email-help'}
              style={{
                width: '100%',
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                border: `1px solid ${email.error ? tokens.colors.error : tokens.colors.gray300}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
                backgroundColor: 'white',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
            />
            {email.error ? (
              <p 
                id="email-error"
                role="alert"
                style={{
                  color: tokens.colors.error,
                  fontSize: tokens.fontSize.sm,
                  marginTop: tokens.spacing.xs,
                  marginBottom: 0
                }}
              >
                {email.error}
              </p>
            ) : (
              <p 
                id="email-help"
                style={{
                  color: tokens.colors.gray600,
                  fontSize: tokens.fontSize.sm,
                  marginTop: tokens.spacing.xs,
                  marginBottom: 0
                }}
              >
                We'll never share your email with anyone else.
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: tokens.spacing.md }}>
            <label 
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: tokens.fontSize.sm,
                fontWeight: '500',
                color: tokens.colors.gray900,
                marginBottom: tokens.spacing.xs
              }}
            >
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password.value}
                onChange={password.onChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                required
                autoComplete="current-password"
                aria-describedby={password.error ? 'password-error' : 'password-help'}
                style={{
                  width: '100%',
                  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                  paddingRight: '48px',
                  border: `1px solid ${password.error ? tokens.colors.error : tokens.colors.gray300}`,
                  borderRadius: tokens.borderRadius.md,
                  fontSize: tokens.fontSize.base,
                  backgroundColor: 'white',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: tokens.spacing.sm,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: tokens.spacing.xs,
                  color: tokens.colors.gray600
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {password.error ? (
              <p 
                id="password-error"
                role="alert"
                style={{
                  color: tokens.colors.error,
                  fontSize: tokens.fontSize.sm,
                  marginTop: tokens.spacing.xs,
                  marginBottom: 0
                }}
              >
                {password.error}
              </p>
            ) : (
              <p 
                id="password-help"
                style={{
                  color: tokens.colors.gray600,
                  fontSize: tokens.fontSize.sm,
                  marginTop: tokens.spacing.xs,
                  marginBottom: 0
                }}
              >
                Must be at least 6 characters long.
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: tokens.spacing.lg
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.xs,
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={rememberMeChecked}
                onChange={(e) => setRememberMeChecked(e.target.checked)}
                disabled={isLoading}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                fontSize: tokens.fontSize.sm,
                color: tokens.colors.gray600
              }}>
                Remember me
              </span>
            </label>
            
            {onForgotPassword && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: tokens.colors.primary,
                  fontSize: tokens.fontSize.sm,
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                Forgot password?
              </button>
            )}
          </div>

          {/* General Error */}
          {generalError && (
            <div 
              role="alert"
              aria-live="polite"
              style={{
                backgroundColor: tokens.colors.errorLight,
                border: `1px solid ${tokens.colors.error}`,
                borderRadius: tokens.borderRadius.md,
                padding: tokens.spacing.md,
                marginBottom: tokens.spacing.md
              }}
            >
              <p style={{
                color: tokens.colors.error,
                fontSize: tokens.fontSize.sm,
                margin: 0
              }}>
                {generalError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            aria-describedby={attempts > 3 ? 'attempts-warning' : undefined}
            style={{
              width: '100%',
              padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
              backgroundColor: isLoading ? tokens.colors.gray300 : tokens.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              fontSize: tokens.fontSize.base,
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: tokens.spacing.sm
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = tokens.colors.primaryHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = tokens.colors.primary;
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Attempts Warning */}
          {attempts > 3 && (
            <p 
              id="attempts-warning"
              style={{
                color: tokens.colors.error,
                fontSize: tokens.fontSize.sm,
                textAlign: 'center',
                marginTop: tokens.spacing.sm,
                marginBottom: 0
              }}
            >
              Multiple failed attempts detected. Please check your credentials.
            </p>
          )}
        </form>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          marginTop: tokens.spacing.lg,
          paddingTop: tokens.spacing.md,
          borderTop: `1px solid ${tokens.colors.gray100}`
        }}>
          <p style={{
            color: tokens.colors.gray600,
            fontSize: tokens.fontSize.sm,
            margin: 0
          }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                color: tokens.colors.primary,
                textDecoration: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: tokens.fontSize.sm
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Sign up
            </button>
          </p>
        </footer>
      </div>

      {/* Loading Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 