import { useState, useCallback } from 'react';
import { RegistrationData, FormErrors, CompanyInfo, UserInfo } from '../types/registration';
import { validateCompanyInfo, validateUserInfo, validateRegistration } from '../utils/validation';
import { API_ENDPOINTS, handleApiError } from '../config/api';

const initialCompanyInfo: CompanyInfo = {
  companyName: '',
  industry: '',
  companySize: '',
  website: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  taxId: '',
  phone: '',
};

const initialUserInfo: UserInfo = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'admin',
  department: '',
  jobTitle: '',
  phone: '',
};

export const useRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<RegistrationData>({
    companyInfo: initialCompanyInfo,
    userInfo: initialUserInfo,
    documents: [],
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateCompanyInfo = useCallback((companyInfo: CompanyInfo) => {
    setData(prev => ({ ...prev, companyInfo }));
    setErrors(prev => {
      const newErrors = { ...prev };
      // Clear company-related errors
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('company') || key.startsWith('address') || key === 'industry' || key === 'taxId' || key === 'phone') {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  }, []);

  const updateUserInfo = useCallback((userInfo: UserInfo) => {
    setData(prev => ({ ...prev, userInfo }));
    setErrors(prev => {
      const newErrors = { ...prev };
      // Clear user-related errors
      ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'role', 'department', 'jobTitle', 'phone'].forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  }, []);

  const updateDocuments = useCallback((documents: File[]) => {
    setData(prev => ({ ...prev, documents }));
  }, []);

  const updateTermsAccepted = useCallback((termsAccepted: boolean) => {
    setData(prev => ({ ...prev, termsAccepted }));
    if (termsAccepted) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.terms;
        return newErrors;
      });
    }
  }, []);

  const nextStep = useCallback(() => {
    let stepErrors: FormErrors = {};

    if (currentStep === 1) {
      stepErrors = validateCompanyInfo(data.companyInfo);
    } else if (currentStep === 2) {
      stepErrors = validateUserInfo(data.userInfo);
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
    return true;
  }, [currentStep, data]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const submitRegistration = useCallback(async () => {
    const validationErrors = validateRegistration(data);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add company info as individual fields (matching backend expectations)
      formData.append('companyName', data.companyInfo.companyName);
      formData.append('industry', data.companyInfo.industry);
      formData.append('companySize', data.companyInfo.companySize);
      formData.append('website', data.companyInfo.website);
      formData.append('taxId', data.companyInfo.taxId);
      formData.append('phone', data.companyInfo.phone);
      formData.append('street', data.companyInfo.address.street);
      formData.append('city', data.companyInfo.address.city);
      formData.append('state', data.companyInfo.address.state);
      formData.append('zipCode', data.companyInfo.address.zipCode);
      formData.append('country', data.companyInfo.address.country);
      
      // Add user info as individual fields (without password confirmation)
      const { confirmPassword, ...userInfo } = data.userInfo;
      formData.append('firstName', userInfo.firstName);
      formData.append('lastName', userInfo.lastName);
      formData.append('email', userInfo.email);
      formData.append('password', userInfo.password);
      formData.append('role', userInfo.role);
      formData.append('department', userInfo.department);
      formData.append('jobTitle', userInfo.jobTitle);
      formData.append('userPhone', userInfo.phone);
      
      // Add documents
      data.documents.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });
      
      formData.append('termsAccepted', data.termsAccepted.toString());

      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: formData,
      });
      
      await handleApiError(response);

      const result = await response.json();
      console.log('Registration successful:', result);
      
      // Store the token if provided
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Registration failed' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [data]);

  return {
    currentStep,
    data,
    errors,
    isSubmitting,
    updateCompanyInfo,
    updateUserInfo,
    updateDocuments,
    updateTermsAccepted,
    nextStep,
    prevStep,
    submitRegistration,
  };
};