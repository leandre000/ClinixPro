"use client";

import { useState } from 'react';

interface ModernFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  icon?: string;
  options?: { value: string; label: string }[];
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function ModernFormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  options = [],
  error,
  disabled = false,
  className = ''
}: ModernFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'email':
        return '📧';
      case 'password':
        return '🔒';
      case 'tel':
        return '📞';
      case 'date':
        return '📅';
      case 'number':
        return '🔢';
      default:
        return '✏️';
    }
  };

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const baseInputClasses = `
    appearance-none relative block w-full px-6 py-4 
    border-2 border-gray-300 placeholder-gray-500 
    text-gray-900 rounded-xl focus:outline-none 
    focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
    text-lg transition-all duration-200
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${baseInputClasses} resize-none min-h-[120px]`}
          rows={4}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={baseInputClasses}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={getInputType()}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={baseInputClasses}
      />
    );
  };

  return (
    <div className="space-y-3">
      <label htmlFor={name} className="block text-lg font-semibold text-gray-700">
        {getIcon()} {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {renderInput()}
        
        {/* Password toggle button */}
        {type === 'password' && (
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
        )}
        
        {/* Success indicator */}
        {isFocused && !error && value && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-lg">{error}</span>
        </div>
      )}
    </div>
  );
} 