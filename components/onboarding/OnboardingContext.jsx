'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  // Load saved data from localStorage
  const loadSavedData = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onboardingData');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return getInitialData();
        }
      }
    }
    return getInitialData();
  };

  const getInitialData = () => ({
    // Step 1: Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',
    openToRelocate: false,
    countryOfWork: '',
    visaSponsorshipRequired: false,
    
    // Step 2: Job Preferences & Compensation
    primaryJobTitles: [],
    totalYearsExperience: '',
    seniorityLevel: '',
    jobTypes: [],
    workLocation: '',
    locationPreference: '',
    remoteOnly: false,
    minAcceptableSalary: '',
    preferredSalaryMin: '',
    preferredSalaryMax: '',
    equityPreference: false,
    
    // Step 3: Documents & Links
    resume: null,
    resumeFileName: '',
    coverLetter: null,
    coverLetterFileName: '',
    portfolioWebsite: '',
    github: '',
    linkedinProfile: '',
    personalBlog: '',
  });

  const [formData, setFormData] = useState(loadSavedData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Save to localStorage whenever formData changes
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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 3) {
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


