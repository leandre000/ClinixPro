"use client";

import { ReactNode } from 'react';

interface ModernButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export default function ModernButton({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  fullWidth = false
}: ModernButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl';
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-lg';
      case 'lg':
        return 'px-8 py-4 text-xl';
      case 'xl':
        return 'px-10 py-5 text-2xl';
      default:
        return 'px-6 py-3 text-lg';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center font-bold rounded-xl
    focus:outline-none focus:ring-4 focus:ring-blue-500/20
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
    transition-all duration-200
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const renderIcon = () => {
    if (loading) {
      return (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    return icon;
  };

  const renderContent = () => {
    const iconElement = renderIcon();
    
    if (!iconElement) {
      return children;
    }

    if (iconPosition === 'right') {
      return (
        <>
          {children}
          <span className="ml-2">{iconElement}</span>
        </>
      );
    }

    return (
      <>
        <span className="mr-2">{iconElement}</span>
        {children}
      </>
    );
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={baseClasses}
    >
      {renderContent()}
    </button>
  );
}

// Predefined button components for common use cases
export function PrimaryButton({ children, ...props }: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="primary" {...props}>{children}</ModernButton>;
}

export function SecondaryButton({ children, ...props }: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="secondary" {...props}>{children}</ModernButton>;
}

export function SuccessButton({ children, ...props }: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="success" {...props}>{children}</ModernButton>;
}

export function DangerButton({ children, ...props }: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="danger" {...props}>{children}</ModernButton>;
}

export function WarningButton({ children, ...props }: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="warning" {...props}>{children}</ModernButton>;
}

export function OutlineButton({ children, ...props }: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="outline" {...props}>{children}</ModernButton>;
} 