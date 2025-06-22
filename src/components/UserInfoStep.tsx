import React from 'react';
import { UserInfo, FormErrors } from '../types/registration';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

interface UserInfoStepProps {
  data: UserInfo;
  onChange: (data: UserInfo) => void;
  errors: FormErrors;
}

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
];

const departmentOptions = [
  { value: 'it', label: 'Information Technology' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
  { value: 'other', label: 'Other' },
];

export const UserInfoStep: React.FC<UserInfoStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-emerald-900 mb-2">
          Administrator Account
        </h3>
        <p className="text-emerald-700 text-sm">
          Create the primary administrator account for your ERP system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First Name"
          name="firstName"
          value={data.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          required
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={data.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          required
        />

        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={data.email}
          onChange={handleInputChange}
          error={errors.email}
          required
          className="md:col-span-2"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={data.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          required
        />

        <FormSelect
          label="Role"
          name="role"
          value={data.role}
          onChange={handleSelectChange}
          options={roleOptions}
          error={errors.role}
          required
        />

        <FormSelect
          label="Department"
          name="department"
          value={data.department}
          onChange={handleSelectChange}
          options={departmentOptions}
          error={errors.department}
          required
        />

        <FormInput
          label="Job Title"
          name="jobTitle"
          value={data.jobTitle}
          onChange={handleInputChange}
          error={errors.jobTitle}
          required
        />

        <FormInput
          label="Phone Number"
          type="tel"
          name="phone"
          value={data.phone}
          onChange={handleInputChange}
          error={errors.phone}
          required
        />
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-amber-900 mb-1">
          Password Requirements
        </h4>
        <ul className="text-xs text-amber-800 space-y-1">
          <li>• At least 8 characters long</li>
          <li>• Contains uppercase and lowercase letters</li>
          <li>• Contains at least one number</li>
          <li>• Contains at least one special character</li>
        </ul>
      </div>
    </div>
  );
};