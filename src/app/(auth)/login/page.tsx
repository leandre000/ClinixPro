"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MdLocalHospital, 
  MdEmail, 
  MdLock, 
  MdVisibility, 
  MdVisibilityOff, 
  MdError, 
  MdSecurity, 
  MdHome
} from 'react-icons/md';

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
            <MdLocalHospital className="text-white text-4xl" />
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
              <label htmlFor="email" className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-3">
                <MdEmail className="w-5 h-5 text-blue-600" />
                <span>Email Address</span>
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
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-3">
                <MdLock className="w-5 h-5 text-blue-600" />
                <span>Password</span>
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
                      <MdVisibilityOff className="w-6 h-6" />
                    ) : (
                      <MdVisibility className="w-6 h-6" />
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
                  <MdError className="h-6 w-6 text-red-400" />
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
                  <MdSecurity className="-ml-1 mr-3 h-6 w-6" />
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between">
            <div className="text-lg">
              <Link href="/forgot-password" className="flex items-center space-x-2 font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                <MdLock className="w-5 h-5" />
                <span>Forgot your password?</span>
              </Link>
            </div>
            <div className="text-lg">
              <Link href="/" className="flex items-center space-x-2 font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                <MdHome className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <MdSecurity className="h-5 w-5 text-green-500" />
            <span className="text-lg">HIPAA Compliant & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
} 