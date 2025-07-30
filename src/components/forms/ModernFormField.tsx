"use client";

import { useState } from 'react';
import { 
  MdEmail, 
  MdLock, 
  MdPhone, 
  MdCalendarToday, 
  MdNumbers, 
  MdEdit,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdError
} from 'react-icons/md';

interface ModernFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
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
        return <MdEmail className="w-5 h-5" />;
      case 'password':
        return <MdLock className="w-5 h-5" />;
      case 'tel':
        return <MdPhone className="w-5 h-5" />;
      case 'date':
        return <MdCalendarToday className="w-5 h-5" />;
      case 'number':
        return <MdNumbers className="w-5 h-5" />;
      default:
        return <MdEdit className="w-5 h-5" />;
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
      <label htmlFor={name} className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
        <span className="text-blue-600">{getIcon()}</span>
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
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
                <MdVisibilityOff className="w-6 h-6" />
              ) : (
                <MdVisibility className="w-6 h-6" />
              )}
            </button>
          </div>
        )}
        
        {/* Success indicator */}
        {isFocused && !error && value && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <MdCheckCircle className="w-6 h-6 text-green-500" />
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <MdError className="w-5 h-5" />
          <span className="text-lg">{error}</span>
        </div>
      )}
    </div>
  );
} 