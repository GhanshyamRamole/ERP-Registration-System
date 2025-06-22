import React from 'react';
import { RegistrationData } from '../types/registration';
import { Building2, User, FileText, Check } from 'lucide-react';

interface ReviewStepProps {
  data: RegistrationData;
  onTermsChange: (accepted: boolean) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onTermsChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Review & Confirm
        </h3>
        <p className="text-green-700 text-sm">
          Please review your information before submitting your registration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-800">
              Company Information
            </h4>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Company Name:</span>
              <span className="ml-2 text-gray-800">{data.companyInfo.companyName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Industry:</span>
              <span className="ml-2 text-gray-800">{data.companyInfo.industry}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Company Size:</span>
              <span className="ml-2 text-gray-800">{data.companyInfo.companySize}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Tax ID:</span>
              <span className="ml-2 text-gray-800">{data.companyInfo.taxId}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Address:</span>
              <div className="ml-2 text-gray-800">
                {data.companyInfo.address.street}<br />
                {data.companyInfo.address.city}, {data.companyInfo.address.state} {data.companyInfo.address.zipCode}<br />
                {data.companyInfo.address.country}
              </div>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-emerald-600" />
            <h4 className="text-lg font-semibold text-gray-800">
              Administrator Account
            </h4>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <span className="ml-2 text-gray-800">
                {data.userInfo.firstName} {data.userInfo.lastName}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-800">{data.userInfo.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Role:</span>
              <span className="ml-2 text-gray-800 capitalize">{data.userInfo.role}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Department:</span>
              <span className="ml-2 text-gray-800">{data.userInfo.department}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Job Title:</span>
              <span className="ml-2 text-gray-800">{data.userInfo.jobTitle}</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-slate-600" />
            <h4 className="text-lg font-semibold text-gray-800">
              Uploaded Documents
            </h4>
          </div>
          {data.documents.length > 0 ? (
            <div className="space-y-2">
              {data.documents.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No documents uploaded</p>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Terms and Conditions
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg max-h-32 overflow-y-auto text-sm text-gray-700">
            <p className="mb-2">
              By registering for our ERP system, you agree to the following terms:
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>You provide accurate and complete information</li>
              <li>You will use the system in compliance with applicable laws</li>
              <li>You understand data will be processed according to our privacy policy</li>
              <li>You accept responsibility for maintaining account security</li>
              <li>You agree to our service level agreements and support policies</li>
            </ul>
          </div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.termsAccepted}
              onChange={(e) => onTermsChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I agree to the terms and conditions and privacy policy
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};