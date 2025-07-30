"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on user role
        switch (data.user.role) {
          case 'ADMIN':
            router.push('/admin');
            break;
          case 'DOCTOR':
            router.push('/doctor');
            break;
          case 'PHARMACIST':
            router.push('/pharmacist');
            break;
          case 'RECEPTIONIST':
            router.push('/receptionist');
            break;
          default:
            router.push('/');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl">
            <span className="text-white text-3xl font-bold">🏥</span>
          </div>
          <h2 className="mt-8 text-4xl font-extrabold text-gray-900">
            Welcome to ClinixPro
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Sign in to your healthcare management portal
          </p>
        </div>
        
        {/* Login Form */}
        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-3">
                📧 Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-6 py-4 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg transition-all duration-200"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-3">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-6 py-4 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg transition-all duration-200"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-xl font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-3 h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between">
            <div className="text-lg">
              <Link href="/forgot-password" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                🔑 Forgot your password?
              </Link>
            </div>
            <div className="text-lg">
              <Link href="/" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                🏠 Back to Home
              </Link>
            </div>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300" />
            </div>
            <div className="relative flex justify-center text-lg">
              <span className="px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-600 font-semibold">
                🚀 Demo Credentials
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-center">
            <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100">
              <p className="text-lg font-semibold text-gray-800 mb-2">👨‍⚕️ Admin Access</p>
              <p className="text-gray-600">admin@clinixpro.com / password</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100">
              <p className="text-lg font-semibold text-gray-800 mb-2">👩‍⚕️ Doctor Access</p>
              <p className="text-gray-600">doctor@clinixpro.com / password</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100">
              <p className="text-lg font-semibold text-gray-800 mb-2">💊 Pharmacist Access</p>
              <p className="text-gray-600">pharmacist@clinixpro.com / password</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-lg">🔒 HIPAA Compliant & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
} 