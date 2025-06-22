export interface CompanyInfo {
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId: string;
  phone: string;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  jobTitle: string;
  phone: string;
}

export interface RegistrationData {
  companyInfo: CompanyInfo;
  userInfo: UserInfo;
  documents: File[];
  termsAccepted: boolean;
}

export interface FormErrors {
  [key: string]: string;
}