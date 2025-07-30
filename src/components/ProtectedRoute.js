"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        setUser(user);

        // Check if user has required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard based on user role
          switch (user.role) {
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
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  // Verify token with backend
  useEffect(() => {
    const verifyToken = async () => {
      if (!isAuthenticated) return;

      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    if (isAuthenticated) {
      verifyToken();
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      {children}
    </div>
  );
}

// Higher-order component for role-based protection
export function withAuth(WrappedComponent, allowedRoles = []) {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}
