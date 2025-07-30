"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🏥",
      title: "Hospital Management",
      description: "Comprehensive hospital administration with real-time monitoring and analytics"
    },
    {
      icon: "💊",
      title: "Pharmacy Management",
      description: "Advanced inventory tracking, prescription management, and drug safety protocols"
    },
    {
      icon: "👨‍⚕️",
      title: "Doctor Portal",
      description: "Patient records, appointment scheduling, and prescription management"
    },
    {
      icon: "👩‍⚕️",
      title: "Nurse Management",
      description: "Patient care coordination, medication administration, and vital signs monitoring"
    },
    {
      icon: "💰",
      title: "Billing & Insurance",
      description: "Automated billing, insurance claims processing, and payment tracking"
    },
    {
      icon: "📊",
      title: "Analytics & Reports",
      description: "Comprehensive reporting, performance metrics, and data-driven insights"
    }
  ];

  const stats = [
    { number: "500+", label: "Hospitals Nationwide" },
    { number: "50K+", label: "Healthcare Professionals" },
    { number: "1M+", label: "Patients Served" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  const benefits = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Optimized performance with sub-second response times"
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "HIPAA compliant with end-to-end encryption"
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Responsive design that works on all devices"
    },
    {
      icon: "🔄",
      title: "Real-time Sync",
      description: "Live data synchronization across all departments"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ClinixPro
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              The Future of
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hospital Management
              </span>
            </h1>
            <p className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Empowering healthcare professionals nationwide with cutting-edge technology for seamless patient care, pharmacy management, and hospital administration.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link href="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Start Your Journey
              </Link>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Features */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a modern, efficient healthcare facility
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 ${
                  currentFeature === index
                    ? 'border-blue-500 bg-blue-50 shadow-xl'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose ClinixPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for healthcare professionals, by healthcare professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital Graphics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nationwide Hospital Network
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join hundreds of hospitals across the nation that trust ClinixPro for their daily operations. 
                From small clinics to large medical centers, we provide scalable solutions that grow with your facility.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-lg text-gray-700">HIPAA Compliant & Secure</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-lg text-gray-700">24/7 Technical Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-lg text-gray-700">Cloud-Based & Scalable</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-lg text-gray-700">Mobile-First Design</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="text-2xl mb-2">🏥</div>
                    <div className="text-sm font-semibold text-gray-700">Hospital Management</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="text-2xl mb-2">💊</div>
                    <div className="text-sm font-semibold text-gray-700">Pharmacy System</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="text-2xl mb-2">👨‍⚕️</div>
                    <div className="text-sm font-semibold text-gray-700">Doctor Portal</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-semibold text-gray-700">Analytics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the future of healthcare management today. Start your free trial and see the difference ClinixPro can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold">ClinixPro</span>
              </div>
              <p className="text-gray-400">
                Empowering healthcare professionals with cutting-edge technology for better patient care.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Hospital Management</li>
                <li>Pharmacy System</li>
                <li>Patient Care</li>
                <li>Billing & Insurance</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>24/7 Support</li>
                <li>Training</li>
                <li>Updates</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@clinixpro.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Healthcare Ave</li>
                <li>Medical District, MD 12345</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ClinixPro. All rights reserved. Empowering healthcare nationwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
