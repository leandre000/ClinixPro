"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth.service";

type DashboardLayoutProps = {
  userType: 'admin' | 'doctor' | 'pharmacist' | 'receptionist';
  children: ReactNode;
  title: string;
};

export default function DashboardLayout({ 
  userType, 
  children, 
  title,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Get the current user from localStorage
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      // If no user is found, redirect to login
      router.push('/login');
      return;
    }

    // Verify that the user has the correct role for this dashboard
    if (currentUser.role.toLowerCase() !== userType.toLowerCase()) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
  }, [userType, router]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        // TODO: Implement image upload to backend
        console.log('Uploading image:', file);
        const response = await AuthService.uploadProfileImage(user.id, file);
        
        // Assuming the backend returns the updated user object or the new image URL
        if (response && response.imageUrl) {
          // Update the user state with the new profile image URL
          setUser((prevUser: any | null) => ({
            ...prevUser,
            profileImage: response.imageUrl
          }));
          console.log('Profile image uploaded and user state updated.', response.imageUrl);
        } else {
           console.warn('Image upload successful, but no imageUrl returned:', response);
           // Optionally, refetch user data here if backend doesn't return the URL
        }

      } catch (error) {
        console.error('Error uploading image:', error);
        // Optionally, display an error message to the user
      }
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    AuthService.logout();
    router.push('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!user) {
    return null; // or a loading spinner
  }

  const fullName = `${user.firstName}`;

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 transform bg-indigo-800 transition duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar userType={userType} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
            <div className="flex justify-between items-center">
              {/* Left section with logo and title */}
              <div className="flex items-center space-x-6">
                {/* Sidebar toggle for mobile */}
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 hidden md:block">{title}</h2>
              </div>
              
              {/* Right section with profile */}
              <div className="flex items-center">
                {/* Profile dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 group focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      {user.profileImage ? (
                        <Image 
                          src={user.profileImage} 
                          alt="Profile" 
                          width={48} 
                          height={48} 
                          className="rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl border-2 border-gray-200">
                          {user.firstName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-1.5 cursor-pointer hover:bg-indigo-600 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </label>
                    </div>
                    <div className="hidden md:block text-left">
                      <span className="text-base font-semibold text-gray-900 block">{fullName}</span>
                      <span className="text-sm text-gray-600 block">{user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile dropdown menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                      <div className="py-2" role="menu" aria-orientation="vertical">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-50 font-medium"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-white p-6 sm:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={cancelLogout}></div>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
              </div>
            </div>
            <div className="mb-8">
              <p className="text-base text-gray-600 leading-relaxed">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogout}
                className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-3 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 