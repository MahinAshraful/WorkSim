import { FrontendTask } from '@/types';

export const frontendTasks: FrontendTask[] = [
  {
    id: 'login-page-task',
    title: 'Login Page Component',
    description: 'Create a login page for our application with email and password validation',
    userStory: 'As a user, I want to be able to log in to the application so that I can access my personalized content',
    acceptanceCriteria: [
      'Form has email and password inputs',
      'Form validates email format',
      'Form shows error messages for invalid inputs',
      'Form has a submit button that calls login function',
      'Loading state is shown while login is in progress',
      'Form is responsive and looks good on mobile'
    ],
    priority: 'high',
    managerPrompt: `Hey! I need you to build a login page for our app. This is pretty important since users can't access anything without logging in first.

Here's what I'm thinking:
- Standard email/password form
- Make sure the email validation works properly
- Show error messages when things go wrong
- Add a loading state when they submit
- Oh, and make sure it looks good on mobile too

I've set up some starter files for you. We have a useInput hook for form state and a validateEmail function already available. The design tokens are in the styles folder.

Let me know if you have any questions about the requirements!`,
    starterCode: [
      {
        name: 'LoginPage.tsx',
        path: 'src/components/LoginPage.tsx',
        content: `import React from 'react';
import { useInput } from '../utils/hooks';
import { validateEmail } from '../utils/validators';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  // TODO: Implement the login page component
  
  return (
    <div>
      <h1>Login Page</h1>
      {/* TODO: Add form elements here */}
    </div>
  );
}`,
        language: 'tsx',
        editable: true
      },
      {
        name: 'hooks.js',
        path: 'src/utils/hooks.js',
        content: `import { useState } from 'react';

export function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const setErrorMessage = (message) => {
    setError(message);
  };

  return {
    value,
    error,
    onChange: handleChange,
    setError: setErrorMessage,
    reset: () => {
      setValue(initialValue);
      setError('');
    }
  };
}`,
        language: 'javascript',
        editable: false
      },
      {
        name: 'validators.js',
        path: 'src/utils/validators.js',
        content: `export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password.length >= 6;
}`,
        language: 'javascript',
        editable: false
      },
      {
        name: 'tokens.js',
        path: 'src/styles/tokens.js',
        content: `export const tokens = {
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
};`,
        language: 'javascript',
        editable: false
      }
    ]
  },
  {
    id: 'button-component-task',
    title: 'Reusable Button Component',
    description: 'Build a flexible button component with different variants and states',
    userStory: 'As a developer, I want a reusable button component that supports different styles and states so that I can maintain consistency across the application',
    acceptanceCriteria: [
      'Button supports primary, secondary, and ghost variants',
      'Button has small, medium, and large sizes',
      'Button shows loading state with spinner',
      'Button can be disabled',
      'Button is accessible with proper ARIA attributes',
      'Button accepts custom className and other props'
    ],
    priority: 'medium',
    managerPrompt: `We need a solid button component that we can use throughout the app. Right now everyone is creating their own buttons and it's getting messy.

Requirements:
- Different variants: primary (blue), secondary (gray border), ghost (transparent)
- Different sizes: small, medium, large
- Loading state with a spinner
- Disabled state
- Make sure it's accessible
- Should accept any additional props developers might need

I've started a basic structure for you. The design tokens are available, and there's a simple Loading component you can use for the spinner.

This will be used everywhere, so make sure it's solid!`,
    starterCode: [
      {
        name: 'Button.tsx',
        path: 'src/components/Button.tsx',
        content: `import React from 'react';
import { Loading } from './Loading';
import { tokens } from '../styles/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  // TODO: Implement the button component with variants and sizes
  
  return (
    <button
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loading /> : children}
    </button>
  );
}`,
        language: 'tsx',
        editable: true
      },
      {
        name: 'Loading.tsx',
        path: 'src/components/Loading.tsx',
        content: `import React from 'react';

export function Loading({ size = 16 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-gray-300 border-t-white"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}`,
        language: 'tsx',
        editable: false
      },
      {
        name: 'tokens.js',
        path: 'src/styles/tokens.js',
        content: `export const tokens = {
  colors: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    secondary: '#6B7280',
    secondaryHover: '#4B5563',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray300: '#D1D5DB',
    gray600: '#4B5563',
    gray900: '#111827',
    white: '#FFFFFF'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem', 
    md: '1.5rem',
    lg: '2rem'
  },
  fontSize: {
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem'
  }
};`,
        language: 'javascript',
        editable: false
      }
    ]
  }
];

export default frontendTasks;