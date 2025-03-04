
/**
 * Form validation utilities for authentication forms
 */

export const validateEmail = (email: string): { valid: boolean; message?: string } => {
  if (!email || !email.includes('@')) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

export const validateAuthForm = (email: string, password: string): { valid: boolean; message?: string } => {
  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) {
    return emailCheck;
  }
  
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return passwordCheck;
  }
  
  return { valid: true };
};
