'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  // Get user data from Redux store
  const { user } = useSelector((state) => state.auth);

  // Load saved data from localStorage and prefill with user data
  const loadSavedData = () => {
    const initialData = getInitialData();
    
    // Prefill email and fullName from user data if available
    if (user) {
      if (user.email) {
        initialData.email = user.email;
      }
      if (user.name) {
        initialData.fullName = user.name;
      }
    }

    // If there's saved onboarding data, merge it ONLY if it belongs to current user
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onboardingData');
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          // Discard saved data if it's from a different user (e.g. previous signup)
          if (user?.email && savedData.email && savedData.email !== user.email) {
            return initialData;
          }
          const merged = { ...initialData, ...savedData };
          if (!merged.employmentHistory?.length) {
            merged.employmentHistory = [
              {
                jobTitle: merged.currentRole || '',
                company: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                responsibilities: merged.keyResponsibilities || '',
              },
            ];
          }
          return merged;
        } catch (e) {
          return initialData;
        }
      }
    }
    
    return initialData;
  };

  const getInitialData = () => ({
    // Step 1: Personal Details
    fullName: '',
    email: '',
    phoneCode: '+61',
    phone: '',
    currentLocation: '',
    workRightsInAustralia: '',
    visaType: '',
    // Step 2: Resume & Documents
    resume_details: null,
    cv_details: null,
    academicTranscripts_details: null,
    certifications_details: null,
    // Step 3: Employment History (structured rows + legacy strings filled on submit)
    currentRole: '',
    previousRoles: '',
    keyResponsibilities: '',
    keyAchievements: '',
    employmentHistory: [
      {
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        responsibilities: '',
      },
    ],
    // Step 4: Compliance & Checks
    policeCheck: '',
    workingWithChildrenCheck: '',
    securityClearance: '',
    driversLicence: '',
    // Step 5: Availability
    availableStartDate: '',
    noticePeriod: '',
    // Step 6: Application Preferences
    howToApply: '',
    companiesToAvoid: '',
    // Step 7: Additional Information
    linkedinProfile: '',
    portfolioWebsite: '',
    anythingElse: '',
    // Step 8: Consent & Authorisation
    consentInfoAccurate: false,
    consentSubmitApplications: false,
    consentAccountCreation: false,
    consentTermsAndPrivacy: false,
    // Legacy (backward compat)
    primaryJobTitles: [],
    address: '',
    github: '',
    personalBlog: '',
  });

  const [formData, setFormData] = useState(loadSavedData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Update form data when user data becomes available (e.g., after signup)
  useEffect(() => {
    if (user) {
      setFormData((prev) => {
        const updated = { ...prev };
        if (!updated.email && user.email) {
          updated.email = user.email;
        }
        if (!updated.fullName && user.name) {
          updated.fullName = user.name;
        }
        return updated;
      });
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingData', JSON.stringify(formData));
    }
  }, [formData]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateMultipleFields = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const setFieldError = (field, error) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const nextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 8) {
      setCurrentStep(step);
    }
  };

  const resetForm = () => {
    const initialData = getInitialData();
    setFormData(initialData);
    setCurrentStep(1);
    setErrors({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboardingData');
    }
  };

  const value = {
    formData,
    currentStep,
    errors,
    updateFormData,
    updateMultipleFields,
    setFieldError,
    clearErrors,
    nextStep,
    previousStep,
    goToStep,
    resetForm,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};


