import { useState, useCallback } from 'react';
import { RegistrationData, FormErrors, CompanyInfo, UserInfo } from '../types/registration';
import { validateCompanyInfo, validateUserInfo, validateRegistration } from '../utils/validation';

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
      // Here you would typically send the data to your Go backend API
      const formData = new FormData();
      
      // Add company info
      formData.append('company', JSON.stringify(data.companyInfo));
      
      // Add user info (without password confirmation)
      const { confirmPassword, ...userInfo } = data.userInfo;
      formData.append('user', JSON.stringify(userInfo));
      
      // Add documents
      data.documents.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });
      
      formData.append('termsAccepted', data.termsAccepted.toString());

      // Example API call to Go backend
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // if (!response.ok) {
      //   throw new Error('Registration failed');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
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