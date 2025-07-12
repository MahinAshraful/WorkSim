'use client';

import React, { useState } from 'react';
import { login, signup } from './actions';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { Briefcase, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    // setError(''); // Remove error reset
    try {
      if (isSignUp) {
        await signup(formData);
      } else {
        await login(formData);
      }
    } catch (err) {
      // setError('An error occurred. Please try again.'); // Suppress error display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-primary-50 to-primary-200 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-grid-pattern">
      {/* (SVG background removed for clean login) */}
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl shadow-lg">
              <Briefcase className="h-9 w-9 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-primary-900 mb-2 font-sans">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-primary-700 font-medium">
            {isSignUp 
              ? 'Start your journey with JobSim today' 
              : 'Sign in to continue your learning'
            }
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-10 shadow-xl border border-primary-100 rounded-2xl bg-white/90 animate-slide-up">
          <form action={handleSubmit} className="space-y-7">
            {/* Error display removed for demo */}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary-800 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-primary-300" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-primary-100 rounded-xl bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors font-sans text-primary-900 placeholder-primary-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary-800 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-primary-100 rounded-xl bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors font-sans text-primary-900 placeholder-primary-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-primary-300 hover:text-primary-500 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-primary-300 hover:text-primary-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-md hover:from-primary-700 hover:to-primary-600 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all text-lg py-3"
              disabled={isLoading}
              loading={isLoading}
            >
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-7 text-center">
            <p className="text-sm text-primary-700 font-medium">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors underline underline-offset-2"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-primary-400 font-sans">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}