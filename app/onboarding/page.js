'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from '../../store/authSlice';
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { OnboardingProvider, useOnboarding } from '../../components/onboarding/OnboardingContext';
import OnboardingStep1 from '../../components/onboarding/OnboardingStep1';
import OnboardingStep2 from '../../components/onboarding/OnboardingStep2';
import OnboardingStep3 from '../../components/onboarding/OnboardingStep3';
import { setOnboardingComplete } from '../../store/authSlice';

const steps = ['Personal Information', 'Job Preferences', 'Documents & Links'];

function OnboardingContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    formData,
    currentStep,
    nextStep,
    previousStep,
    errors,
    clearErrors,
    setFieldError,
  } = useOnboarding();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Validation for each step
  const validateStep = (step) => {
    clearErrors();
    let isValid = true;
    const errorMessages = [];

    if (step === 1) {
      if (!formData.fullName?.trim()) {
        isValid = false;
        errorMessages.push('Full Name is required');
      }
      if (!formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        isValid = false;
        errorMessages.push('Valid Email is required');
      }
    }

    if (step === 2) {
      if (!formData.primaryJobTitles || formData.primaryJobTitles.length === 0) {
        isValid = false;
        errorMessages.push('At least one Primary Job Title is required');
        setFieldError('primaryJobTitles', 'At least one job title is required');
      }
    }

    if (step === 3) {
      // Resume is mandatory
      if (!formData.resume_details) {
        isValid = false;
        errorMessages.push('Resume is required');
        setFieldError('resume', 'Resume is required. Please upload your resume.');
      }
    }

    if (!isValid && errorMessages.length > 0) {
      setSubmitError(errorMessages.join('. '));
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSubmitError(null);
      if (currentStep < 3) {
        nextStep();
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    previousStep();
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Ensure API_URL doesn't end with /api to avoid double /api/api
      const getApiUrl = () => {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        return url.endsWith('/api') ? url.slice(0, -4) : url;
      };
      const API_URL = getApiUrl();
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // Validate resume is uploaded
      if (!formData.resume_details) {
        throw new Error('Resume is required. Please upload your resume.');
      }

      // Prepare JSON data (files are already uploaded separately)
      const onboardingData = {
        // Step 1: Personal Information
        fullName: formData.fullName,
        phoneCode: formData.phoneCode,
        phone: formData.phone,
        address: formData.address,
        openToRelocate: formData.openToRelocate,
        countryOfWork: formData.countryOfWork,
        visaSponsorshipRequired: formData.visaSponsorshipRequired,
        // Step 2: Job Preferences & Compensation
        primaryJobTitles: formData.primaryJobTitles || [],
        skills: formData.skills || [],
        totalYearsExperience: formData.totalYearsExperience || '',
        seniorityLevel: formData.seniorityLevel || '',
        jobTypes: formData.jobTypes || [],
        workLocation: formData.workLocation || '',
        locationPreference: formData.locationPreference || '',
        remoteOnly: formData.remoteOnly || false,
        minAcceptableSalary: formData.minAcceptableSalary || '',
        preferredSalaryMin: formData.preferredSalaryMin || '',
        preferredSalaryMax: formData.preferredSalaryMax || '',
        equityPreference: formData.equityPreference || false,
        // Step 3: Documents & Links
        resume_details: formData.resume_details,
        cv_details: formData.cv_details || null,
        portfolioWebsite: formData.portfolioWebsite || '',
        github: formData.github || '',
        linkedinProfile: formData.linkedinProfile || '',
        personalBlog: formData.personalBlog || '',
      };

      const response = await fetch(`${API_URL}/api/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(onboardingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save onboarding data. Please try again.');
      }

      if (data.success) {
        // Mark onboarding as complete
        dispatch(setOnboardingComplete());

        // Clear onboarding data from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('onboardingData');
        }

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error(data.error || 'Failed to save onboarding data. Please try again.');
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit onboarding data. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 />;
      case 2:
        return <OnboardingStep2 />;
      case 3:
        return <OnboardingStep3 />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
              Complete Your Profile
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
              Help us personalize your job search experience
            </Typography>
          </Box>

          {/* Progress Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={currentStep - 1} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Error Alert */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {/* Step Content */}
          <Box sx={{ mb: 4, minHeight: '400px' }}>
            {renderStepContent()}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                '&:hover': {
                  bgcolor: '#f1f5f9',
                },
              }}
            >
              Previous
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
              sx={{
                bgcolor: '#2463eb',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#1e40af',
                },
                '&:disabled': {
                  bgcolor: '#cbd5e1',
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : currentStep === 3 ? (
                'Complete Setup'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function OnboardingPage() {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  // Initialize auth and redirect if not authenticated
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user && !isAuthenticated) {
        dispatch(initializeAuth());
      } else if (isInitialized && !isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isInitialized, router, dispatch]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}

