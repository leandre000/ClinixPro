"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

type SidebarProps = {
  userType: 'admin' | 'doctor' | 'pharmacist' | 'receptionist';
  userName?: string;
  userImage?: string;
  onImageUpload?: (file: File) => void;
};

export default function Sidebar({ userType, userName = 'User', userImage, onImageUpload }: SidebarProps) {
  const pathname = usePathname();
  
  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: 'home' },
    { href: '/admin/doctors', label: 'Doctors', icon: 'user-md' },
    { href: '/admin/pharmacists', label: 'Pharmacists', icon: 'pills' },
    { href: '/admin/receptionists', label: 'Receptionists', icon: 'user' },
    { href: '/admin/patients', label: 'Patients', icon: 'procedures' },
    { href: '/admin/medicines', label: 'Medicines', icon: 'capsules' },
    { href: '/admin/companies', label: 'Companies', icon: 'building' },
    { href: '/admin/distributors', label: 'Distributors', icon: 'truck' },
    { href: '/admin/rooms', label: 'Rooms', icon: 'door-open' },
  ];
  
  const doctorLinks = [
    { href: '/doctor', label: 'Dashboard', icon: 'home' },
    { href: '/doctor/patients', label: 'Patients', icon: 'procedures' },
    { href: '/doctor/appointments', label: 'Appointments', icon: 'calendar' },
    { href: '/doctor/prescriptions', label: 'Prescriptions', icon: 'pills' },
    { href: '/doctor/beds', label: 'Beds', icon: 'bed' },
    { href: '/doctor/rooms', label: 'Rooms', icon: 'door-open' },
    { href: '/doctor/schedule', label: 'Schedule', icon: 'calendar' },
    { href: '/doctor/medical-records', label: 'Medical Records', icon: 'file-text' },
  ];
  
  const pharmacistLinks = [
    { href: '/pharmacist', label: 'Dashboard', icon: 'home' },
    { href: '/pharmacist/medicines', label: 'Medicines', icon: 'capsules' },
    { href: '/pharmacist/companies', label: 'Companies', icon: 'building' },
    { href: '/pharmacist/distributors', label: 'Distributors', icon: 'truck' },
    { href: '/pharmacist/inventory', label: 'Inventory', icon: 'box' },
    { href: '/pharmacist/analytics', label: 'Analytics', icon: 'chart-bar' },
    { href: '/pharmacist/orders', label: 'Orders', icon: 'shopping-cart' },
    { href: '/pharmacist/prescriptions', label: 'Prescriptions', icon: 'file-text' },
  ];
  
  const receptionistLinks = [
    { href: '/receptionist', label: 'Dashboard', icon: 'home' },
    { href: '/receptionist/patients', label: 'Patients', icon: 'procedures' },
    { href: '/receptionist/appointments', label: 'Appointments', icon: 'calendar' },
    { href: '/receptionist/billing', label: 'Billing', icon: 'file-invoice-dollar' },
  ];
  
  const links = {
    admin: adminLinks,
    doctor: doctorLinks,
    pharmacist: pharmacistLinks,
    receptionist: receptionistLinks
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  // Function to render the appropriate icon based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        );
      case 'user-md':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        );
      case 'pills':
      case 'capsules':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
        );
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        );
      case 'procedures':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        );
      case 'bed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        );
      case 'building':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        );
      case 'truck':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM21 13V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6m16 0v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H7"></path>
          </svg>
        );
      case 'door-open':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        );
      case 'file-invoice-dollar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        );
      case 'file-text':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        );
      case 'box':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        );
      case 'chart-bar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        );
      case 'shopping-cart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-indigo-800">
      {/* Logo Section */}
      <Link href={`/${userType}`} className="px-4 py-6 flex items-center border-b border-indigo-700 hover:bg-indigo-700 transition-colors">
        <div className="relative h-10 w-10 mr-3 flex-shrink-0">
          <Image src="/logo.svg" alt="ClinixPro Logo" fill className="rounded-lg" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-white text-lg font-bold truncate">ClinixPro</h1>
          <p className="text-indigo-200 text-xs truncate">{userType.charAt(0).toUpperCase() + userType.slice(1)} Portal</p>
        </div>
      </Link>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {links[userType].map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-900 text-white shadow-sm'
                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                }`}
              >
                <div className={`mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`}>
                  {renderIcon(link.icon)}
                </div>
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Bottom Section */}
      <div className="p-4 border-t border-indigo-700">
        <Link
          href="/login"
          className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-indigo-100 hover:bg-indigo-700 hover:text-white transition-all duration-200"
        >
          <svg className="mr-3 h-5 w-5 text-indigo-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span className="truncate">Logout</span>
        </Link>
      </div>
    </div>
  );
} 