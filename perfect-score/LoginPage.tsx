import React, { useState } from 'react';
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
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const email = useInput('');
  const password = useInput('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onLogin(email.value, password.value);
    } catch (error) {
      setGeneralError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.gray50
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing.xl,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: tokens.spacing.xl }}>
          <h1 style={{
            fontSize: tokens.fontSize['3xl'],
            fontWeight: 'bold',
            color: tokens.colors.gray900,
            marginBottom: tokens.spacing.sm
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: tokens.colors.gray600,
            fontSize: tokens.fontSize.base
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email.value}
              onChange={email.onChange}
              disabled={isLoading}
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
              aria-describedby={email.error ? 'email-error' : undefined}
            />
            {email.error && (
              <p 
                id="email-error"
                style={{
                  color: tokens.colors.error,
                  fontSize: tokens.fontSize.sm,
                  marginTop: tokens.spacing.xs,
                  marginBottom: 0
                }}
              >
                {email.error}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: tokens.spacing.lg }}>
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
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password.value}
              onChange={password.onChange}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                border: `1px solid ${password.error ? tokens.colors.error : tokens.colors.gray300}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
                backgroundColor: 'white',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
              aria-describedby={password.error ? 'password-error' : undefined}
            />
            {password.error && (
              <p 
                id="password-error"
                style={{
                  color: tokens.colors.error,
                  fontSize: tokens.fontSize.sm,
                  marginTop: tokens.spacing.xs,
                  marginBottom: 0
                }}
              >
                {password.error}
              </p>
            )}
          </div>

          {/* General Error */}
          {generalError && (
            <div style={{
              backgroundColor: tokens.colors.errorLight,
              border: `1px solid ${tokens.colors.error}`,
              borderRadius: tokens.borderRadius.md,
              padding: tokens.spacing.md,
              marginBottom: tokens.spacing.md
            }}>
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
        </form>

        {/* Footer */}
        <div style={{
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
            <a 
              href="#"
              style={{
                color: tokens.colors.primary,
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Sign up
            </a>
          </p>
        </div>
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