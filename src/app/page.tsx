"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ClinixPro</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </a>
                <a href="#about" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </a>
                <button
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {isLoading ? 'Loading...' : 'Get Started'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Professional Hospital</span>
            <span className="block text-indigo-600">Pharmacy Management</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline healthcare operations with our comprehensive pharmacy management system. 
            Built with modern technologies and enterprise-grade security.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                {isLoading ? 'Loading...' : 'Start Managing Your Pharmacy'}
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Features for Healthcare Professionals
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to manage your hospital pharmacy efficiently
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Inventory Management</h3>
                <p className="mt-2 text-gray-500">
                  Track medicine stock levels, expiry dates, and reorder points with real-time monitoring.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Patient Management</h3>
                <p className="mt-2 text-gray-500">
                  Comprehensive patient records, medical history, and prescription tracking.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Billing & Payments</h3>
                <p className="mt-2 text-gray-500">
                  Automated billing, payment processing, and insurance claim management.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mt-24 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About ClinixPro
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
              ClinixPro is a professional-grade hospital pharmacy management system designed to streamline 
              healthcare operations and improve patient care. Built with modern technologies including 
              Spring Boot, Next.js, and PostgreSQL, it provides enterprise-level security and performance.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 mt-24">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">ClinixPro</h3>
            <p className="mt-2 text-gray-400">
              Empowering Healthcare with Technology
            </p>
            <p className="mt-4 text-gray-400">
              © 2024 ClinixPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
