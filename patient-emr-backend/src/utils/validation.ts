/**
 * Validation utilities for the Patient EMR System
 * Implements RFC 5322 email validation and strong password requirements
 */

/**
 * Validates email format (RFC 5322 compliant)
 */
export const validateEmail = (email: string): { valid: boolean; message?: string } => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();

  // RFC 5322 compliant regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  if (trimmed.length > 254) {
    return { valid: false, message: 'Email address is too long' };
  }

  return { valid: true };
};

/**
 * Password strength requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'strong' | 'very_strong';
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'], strength: 'weak' };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  }

  // Calculate strength
  let strength: PasswordValidationResult['strength'] = 'weak';
  const passedChecks = 5 - errors.length;

  if (passedChecks === 5 && password.length >= 12) {
    strength = 'very_strong';
  } else if (passedChecks === 5) {
    strength = 'strong';
  } else if (passedChecks >= 3) {
    strength = 'fair';
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 1000); // Limit length
};

/**
 * Validate name fields
 */
export const validateName = (name: string, fieldName: string): { valid: boolean; message?: string } => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, message: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return { valid: false, message: `${fieldName} must be at least 2 characters` };
  }

  if (name.trim().length > 100) {
    return { valid: false, message: `${fieldName} must be less than 100 characters` };
  }

  if (!/^[a-zA-Z\s\-'\.]+$/.test(name.trim())) {
    return { valid: false, message: `${fieldName} contains invalid characters` };
  }

  return { valid: true };
};
