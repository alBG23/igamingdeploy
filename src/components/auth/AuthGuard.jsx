import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

/**
 * AuthGuard component that protects routes based on user role
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children The protected content
 * @param {string[]} props.allowedRoles Array of allowed roles (e.g., ['admin', 'client'])
 * @param {string} props.redirectTo Path to redirect if not authenticated
 */
export default function AuthGuard({ children, allowedRoles = ['admin', 'client'], redirectTo = '/ClientLogin' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      // Get user from localStorage
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
      const clientUser = JSON.parse(localStorage.getItem('clientUser') || 'null');
      
      // Determine if user is authenticated and has allowed role
      const user = adminUser || clientUser;
      const hasAllowedRole = user && allowedRoles.includes(user.role);
      
      if (user && user.isLoggedIn && hasAllowedRole) {
        setIsAuthenticated(true);
      } else {
        // Redirect if not authenticated or doesn't have required role
        navigate(createPageUrl(redirectTo));
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [allowedRoles, navigate, redirectTo]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-2 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : null;
}