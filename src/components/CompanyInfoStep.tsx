import React from 'react';
import { CompanyInfo, FormErrors } from '../types/registration';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

interface CompanyInfoStepProps {
  data: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
  errors: FormErrors;
}

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'education', label: 'Education' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' },
];

const companySizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'AU', label: 'Australia' },
  { value: 'JP', label: 'Japan' },
  { value: 'other', label: 'Other' },
];

export const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      onChange({
        ...data,
        address: {
          ...data.address,
          [addressField]: value,
        },
      });
    } else {
      onChange({
        ...data,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      onChange({
        ...data,
        address: {
          ...data.address,
          [addressField]: value,
        },
      });
    } else {
      onChange({
        ...data,
        [name]: value,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Company Information
        </h3>
        <p className="text-blue-700 text-sm">
          Please provide your company details to set up your ERP system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Company Name"
          name="companyName"
          value={data.companyName}
          onChange={handleInputChange}
          error={errors.companyName}
          required
          className="md:col-span-2"
        />

        <FormSelect
          label="Industry"
          name="industry"
          value={data.industry}
          onChange={handleSelectChange}
          options={industryOptions}
          error={errors.industry}
          required
        />

        <FormSelect
          label="Company Size"
          name="companySize"
          value={data.companySize}
          onChange={handleSelectChange}
          options={companySizeOptions}
          error={errors.companySize}
          required
        />

        <FormInput
          label="Website"
          type="url"
          name="website"
          value={data.website}
          onChange={handleInputChange}
          error={errors.website}
          placeholder="https://example.com"
        />

        <FormInput
          label="Tax ID"
          name="taxId"
          value={data.taxId}
          onChange={handleInputChange}
          error={errors.taxId}
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
          className="md:col-span-2"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-semibold text-gray-800">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Street Address"
            name="address.street"
            value={data.address.street}
            onChange={handleInputChange}
            error={errors['address.street']}
            required
            className="md:col-span-2"
          />

          <FormInput
            label="City"
            name="address.city"
            value={data.address.city}
            onChange={handleInputChange}
            error={errors['address.city']}
            required
          />

          <FormInput
            label="State/Province"
            name="address.state"
            value={data.address.state}
            onChange={handleInputChange}
            error={errors['address.state']}
            required
          />

          <FormInput
            label="ZIP/Postal Code"
            name="address.zipCode"
            value={data.address.zipCode}
            onChange={handleInputChange}
            error={errors['address.zipCode']}
            required
          />

          <FormSelect
            label="Country"
            name="address.country"
            value={data.address.country}
            onChange={handleSelectChange}
            options={countryOptions}
            error={errors['address.country']}
            required
          />
        </div>
      </div>
    </div>
  );
};