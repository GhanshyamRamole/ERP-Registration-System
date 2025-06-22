import { RegistrationData, FormErrors } from '../types/registration';

export const validateCompanyInfo = (data: RegistrationData['companyInfo']): FormErrors => {
  const errors: FormErrors = {};

  if (!data.companyName.trim()) {
    errors.companyName = 'Company name is required';
  }

  if (!data.industry) {
    errors.industry = 'Industry is required';
  }

  if (!data.companySize) {
    errors.companySize = 'Company size is required';
  }

  if (!data.taxId.trim()) {
    errors.taxId = 'Tax ID is required';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  }

  if (!data.address.street.trim()) {
    errors['address.street'] = 'Street address is required';
  }

  if (!data.address.city.trim()) {
    errors['address.city'] = 'City is required';
  }

  if (!data.address.state.trim()) {
    errors['address.state'] = 'State/Province is required';
  }

  if (!data.address.zipCode.trim()) {
    errors['address.zipCode'] = 'ZIP/Postal code is required';
  }

  if (!data.address.country) {
    errors['address.country'] = 'Country is required';
  }

  return errors;
};

export const validateUserInfo = (data: RegistrationData['userInfo']): FormErrors => {
  const errors: FormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      errors.password = 'Password must meet the requirements above';
    }
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.role) {
    errors.role = 'Role is required';
  }

  if (!data.department) {
    errors.department = 'Department is required';
  }

  if (!data.jobTitle.trim()) {
    errors.jobTitle = 'Job title is required';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  }

  return errors;
};

export const validateRegistration = (data: RegistrationData): FormErrors => {
  const companyErrors = validateCompanyInfo(data.companyInfo);
  const userErrors = validateUserInfo(data.userInfo);

  const errors: FormErrors = { ...companyErrors, ...userErrors };

  if (!data.termsAccepted) {
    errors.terms = 'You must accept the terms and conditions';
  }

  return errors;
};