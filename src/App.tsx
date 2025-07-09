import React, { useState } from 'react';
import { Building2, ArrowLeft, ArrowRight, CheckCircle, LogIn } from 'lucide-react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { CompanyInfoStep } from './components/CompanyInfoStep';
import { UserInfoStep } from './components/UserInfoStep';
import { DocumentsStep } from './components/DocumentsStep';
import { ReviewStep } from './components/ReviewStep';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { useRegistration } from './hooks/useRegistration';
import { authService } from './services/auth';

const steps = [
  'Company Information',
  'Administrator Account',
  'Upload Documents',
  'Review & Submit',
];

function App() {
  const [currentView, setCurrentView] = useState<'register' | 'login' | 'dashboard'>(() => {
    return authService.isAuthenticated() ? 'dashboard' : 'register';
  });
  const [isComplete, setIsComplete] = useState(false);
  const {
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
  } = useRegistration();

  const handleNext = async () => {
    if (currentStep === 4) {
      const success = await submitRegistration();
      if (success) {
        setIsComplete(true);
      }
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyInfoStep
            data={data.companyInfo}
            onChange={updateCompanyInfo}
            errors={errors}
          />
        );
      case 2:
        return (
          <UserInfoStep
            data={data.userInfo}
            onChange={updateUserInfo}
            errors={errors}
          />
        );
      case 3:
        return (
          <DocumentsStep
            documents={data.documents}
            onChange={updateDocuments}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={data}
            onTermsChange={updateTermsAccepted}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 4) {
      return data.termsAccepted && !isSubmitting;
    }
    return true;
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Registration Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome to your new ERP system. You should receive a confirmation email shortly with next steps.
          </p>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Start Using ERP
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">ERP System Registration</h1>
            </div>
            <p className="text-gray-600">
              Set up your enterprise resource planning system in just a few steps
            </p>
            <div className="mt-4">
              <button
                onClick={switchToLogin}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Already have an account? Sign in</span>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${!canProceed()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }
              `}
            >
              <span>
                {isSubmitting 
                  ? 'Submitting...' 
                  : currentStep === 4 
                    ? 'Complete Registration' 
                    : 'Next'
                }
              </span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Error Message */}
          {errors.terms && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.terms}</p>
            </div>
          )}

          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;