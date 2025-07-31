export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return null;
  }

  const stringValue = value.toString();

  // Min length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (data: any, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  phone: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
        return 'Please enter a valid phone number';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (value.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase letter';
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Password must contain at least one uppercase letter';
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one number';
      }
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    custom: (value: string) => {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return 'Name can only contain letters and spaces';
      }
      return null;
    }
  },
  price: {
    required: true,
    custom: (value: string) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'Please enter a valid positive number';
      }
      return null;
    }
  },
  quantity: {
    required: true,
    custom: (value: string) => {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        return 'Please enter a valid non-negative number';
      }
      return null;
    }
  },
  date: {
    required: true,
    custom: (value: string) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Please enter a valid date';
      }
      return null;
    }
  },
  futureDate: {
    required: true,
    custom: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(date.getTime())) {
        return 'Please enter a valid date';
      }
      if (date < today) {
        return 'Date cannot be in the past';
      }
      return null;
    }
  }
};

// Specific validation rules for different forms
export const userFormRules: ValidationRules = {
  firstName: commonRules.name,
  lastName: commonRules.name,
  email: commonRules.email,
  phoneNumber: commonRules.phone,
  password: commonRules.password,
  role: { required: true },
  specialization: { required: false, maxLength: 100 },
  licenseNumber: { required: false, maxLength: 50 },
  qualification: { required: false, maxLength: 100 }
};

export const patientFormRules: ValidationRules = {
  firstName: commonRules.name,
  lastName: commonRules.name,
  email: commonRules.email,
  phoneNumber: commonRules.phone,
  dateOfBirth: commonRules.date,
  bloodGroup: { required: false, maxLength: 10 },
  emergencyContact: commonRules.phone,
  address: { required: true, minLength: 10, maxLength: 200 }
};

export const medicineFormRules: ValidationRules = {
  name: { required: true, minLength: 2, maxLength: 100 },
  description: { required: false, maxLength: 500 },
  price: commonRules.price,
  stock: commonRules.quantity,
  expiryDate: commonRules.futureDate,
  dosage: { required: true, maxLength: 50 },
  companyId: { required: true },
  categoryId: { required: true }
};

export const appointmentFormRules: ValidationRules = {
  patientId: { required: true },
  doctorId: { required: true },
  appointmentDate: commonRules.futureDate,
  appointmentTime: { required: true },
  reason: { required: true, minLength: 10, maxLength: 500 },
  department: { required: true }
}; 