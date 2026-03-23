'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { OnboardingProvider, useOnboarding } from '../../components/onboarding/OnboardingContext';
import OnboardingStep1 from '../../components/onboarding/OnboardingStep1';
import OnboardingStep3 from '../../components/onboarding/OnboardingStep3';
import OnboardingStep4 from '../../components/onboarding/OnboardingStep4';
import OnboardingStep5 from '../../components/onboarding/OnboardingStep5';
import OnboardingStep6 from '../../components/onboarding/OnboardingStep6';
import OnboardingStep7 from '../../components/onboarding/OnboardingStep7';
import OnboardingStep8 from '../../components/onboarding/OnboardingStep8';
import OnboardingStep9 from '../../components/onboarding/OnboardingStep9';
import { setOnboardingComplete, updateUser } from '../../store/authSlice';

const steps = [
  'Personal Details',
  'Resume & Documents',
  'Employment History',
  'Compliance & Checks',
  'Availability',
  'Application Preferences',
  'Additional Info',
  'Consent',
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        setFieldError('fullName', 'Full Name is required');
      }
      if (!formData.email?.trim()) {
        isValid = false;
        errorMessages.push('Valid Email is required');
        setFieldError('email', 'Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        isValid = false;
        errorMessages.push('Please enter a valid email address');
        setFieldError('email', 'Please enter a valid email address');
      }
      if (!formData.phone?.trim()) {
        isValid = false;
        errorMessages.push('Phone Number is required');
        setFieldError('phone', 'Phone Number is required');
      }
      if (!formData.currentLocation?.trim()) {
        isValid = false;
        errorMessages.push('Current Location is required');
        setFieldError('currentLocation', 'Current Location is required');
      }
      if (!formData.workRightsInAustralia?.trim()) {
        isValid = false;
        errorMessages.push('Work Rights in Australia is required');
        setFieldError('workRightsInAustralia', 'Work Rights in Australia is required');
      }
      if (formData.workRightsInAustralia === 'Visa Holder' && !formData.visaType?.trim()) {
        isValid = false;
        errorMessages.push('Visa Type is required when you are a Visa Holder');
        setFieldError('visaType', 'Visa Type is required when you are a Visa Holder');
      }
    }

    if (step === 2) {
      if (!formData.resume_details) {
        isValid = false;
        errorMessages.push('Resume is required');
        setFieldError('resume', 'Resume is required. Please upload your resume.');
      }
    }

    if (step === 3) {
      if (!formData.currentRole?.trim()) {
        isValid = false;
        errorMessages.push('Current / Most Recent Role is required');
        setFieldError('currentRole', 'Current / Most Recent Role is required');
      }
    }

    if (step === 4) {
      // Compliance & Checks - no required fields
    }

    if (step === 5) {
      if (!formData.availableStartDate?.trim()) {
        isValid = false;
        errorMessages.push('Available Start Date is required');
        setFieldError('availableStartDate', 'Available Start Date is required');
      }
    }

    if (step === 6) {
      if (!formData.howToApply?.trim()) {
        isValid = false;
        errorMessages.push('How Would You Like Us to Apply? is required');
        setFieldError('howToApply', 'Please select an option');
      }
    }

    if (step === 7) {
      if (formData.linkedinProfile?.trim() && !/^https?:\/\/.+/i.test(formData.linkedinProfile)) {
        isValid = false;
        errorMessages.push('Please enter a valid LinkedIn URL');
        setFieldError('linkedinProfile', 'Please enter a valid URL');
      }
      if (formData.portfolioWebsite?.trim() && !/^https?:\/\/.+/i.test(formData.portfolioWebsite)) {
        isValid = false;
        errorMessages.push('Please enter a valid Portfolio/Website URL');
        setFieldError('portfolioWebsite', 'Please enter a valid URL');
      }
    }

    if (step === 8) {
      if (!formData.consentInfoAccurate) {
        isValid = false;
        errorMessages.push('Please confirm information is accurate');
        setFieldError('consentInfoAccurate', 'Required');
      }
      if (!formData.consentSubmitApplications) {
        isValid = false;
        errorMessages.push('Please authorise submission of applications');
        setFieldError('consentSubmitApplications', 'Required');
      }
      if (!formData.consentAccountCreation) {
        isValid = false;
        errorMessages.push('Please authorise account creation where required');
        setFieldError('consentAccountCreation', 'Required');
      }
      if (!formData.consentTermsAndPrivacy) {
        isValid = false;
        errorMessages.push('Please agree to Terms of Service and Privacy Policy');
        setFieldError('consentTermsAndPrivacy', 'Required');
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
      if (currentStep < 8) {
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
        // Step 1: Personal Details
        fullName: formData.fullName,
        email: formData.email,
        phoneCode: formData.phoneCode,
        phone: formData.phone,
        currentLocation: formData.currentLocation || '',
        workRightsInAustralia: formData.workRightsInAustralia || '',
        visaType: formData.workRightsInAustralia === 'Visa Holder' ? (formData.visaType || '') : '',
        // Step 2: Resume & Documents
        resume_details: formData.resume_details,
        cv_details: formData.cv_details || null,
        academicTranscripts_details: formData.academicTranscripts_details || null,
        certifications_details: formData.certifications_details || null,
        // Step 3: Employment History
        currentRole: formData.currentRole || '',
        previousRoles: formData.previousRoles || '',
        keyResponsibilities: formData.keyResponsibilities || '',
        keyAchievements: formData.keyAchievements || '',
        // Step 4: Compliance & Checks
        policeCheck: formData.policeCheck || '',
        workingWithChildrenCheck: formData.workingWithChildrenCheck || '',
        securityClearance: formData.securityClearance || '',
        driversLicence: formData.driversLicence || '',
        // Step 5: Availability
        availableStartDate: formData.availableStartDate || '',
        noticePeriod: formData.noticePeriod || '',
        // Step 6: Application Preferences
        howToApply: formData.howToApply || '',
        companiesToAvoid: formData.companiesToAvoid || '',
        // Step 7: Additional Information
        linkedinProfile: formData.linkedinProfile || '',
        portfolioWebsite: formData.portfolioWebsite || '',
        anythingElse: formData.anythingElse || '',
        // Step 8: Consent
        consentInfoAccurate: formData.consentInfoAccurate || false,
        consentSubmitApplications: formData.consentSubmitApplications || false,
        consentAccountCreation: formData.consentAccountCreation || false,
        consentTermsAndPrivacy: formData.consentTermsAndPrivacy || false,
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

      if (data.success && data.user) {
        // Update user in Redux with complete user data from API (includes isOnboardingComplete flag)
        // The updateUser action merges with existing user data, so we only need to update the flag
        dispatch(updateUser({
          isOnboardingComplete: data.user.isOnboardingComplete !== undefined ? data.user.isOnboardingComplete : true,
        }));

        // Also mark onboarding as complete (redundant but ensures flag is set)
        dispatch(setOnboardingComplete());

        // Clear onboarding data from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('onboardingData');
        }

        // Check for redirect parameter, otherwise go to dashboard
        const redirectPath = searchParams?.get('redirect');
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push('/dashboard');
        }
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
        return <OnboardingStep3 />; // Resume & Documents
      case 3:
        return <OnboardingStep4 />; // Employment History
      case 4:
        return <OnboardingStep5 />; // Compliance & Checks
      case 5:
        return <OnboardingStep6 />; // Availability
      case 6:
        return <OnboardingStep7 />; // Application Preferences
      case 7:
        return <OnboardingStep8 />; // Additional Information
      case 8:
        return <OnboardingStep9 />; // Consent & Authorisation
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
        overflowX: 'hidden',
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 }, overflow: 'hidden' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: '24px', sm: '36px', md: '48px' },
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: { xs: 2, sm: 4 }, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              Complete Your Profile
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Help us personalize your job search experience.
            </Typography>
          </Box>

          {/* Progress Stepper - responsive: compact on mobile, full on desktop */}
          <Box sx={{ mb: 4, overflow: 'hidden' }}>
            {isMobile ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                    {steps[currentStep - 1]}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 500 }}>
                    Step {currentStep} of {steps.length}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(currentStep / steps.length) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': { bgcolor: '#1e3a8a' },
                  }}
                />
              </Box>
            ) : (
              <Stepper
                activeStep={currentStep - 1}
                alternativeLabel
                sx={{
                  '& .MuiStepIcon-root.Mui-active': { color: '#1e3a8a' },
                  '& .MuiStepIcon-root.Mui-completed': { color: '#1e3a8a' },
                  '& .MuiStepIcon-root': { color: '#d1d5db' },
                  '& .MuiStepConnector-line': { borderColor: '#e5e7eb' },
                  '& .MuiStepLabel-label': { fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' },
                  '& .MuiStepLabel-label.Mui-active': { color: '#374151', fontWeight: 600 },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Box>

          {/* Error Alert */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {/* Step Content */}
          <Box sx={{ mb: { xs: 3, sm: 4 }, minHeight: { xs: '280px', sm: '400px' } }}>
            {renderStepContent()}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              sx={{
                textTransform: 'none',
                color: '#6b7280',
                borderColor: '#d1d5db',
                borderRadius: '24px',
                px: { xs: 2, sm: 3 },
                py: 1.5,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#9ca3af',
                  bgcolor: '#f9fafb',
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
                bgcolor: '#1e3a8a',
                color: 'white',
                px: { xs: 3, sm: 4 },
                py: 1.5,
                borderRadius: '24px',
                fontSize: { xs: '0.875rem', sm: '1rem' },
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
              ) : currentStep === 8 ? (
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
  const { isAuthenticated, isInitialized, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  // Initialize auth and redirect if not authenticated
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser && !isAuthenticated) {
        dispatch(initializeAuth());
      } else if (isInitialized && !isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isInitialized, router, dispatch]);

  // Payment gate: redirect to pricing if no active subscription (regular users only)
  React.useEffect(() => {
    if (!isInitialized || !isAuthenticated || !user || user.isEmployee) return;
    if (user.role === 'super_admin' || user.role === 'admin') return;

    const checkSubscription = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        const base = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
        const res = await fetch(`${base}/api/users/my-plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const sub = data.data?.subscription;
        const hasActive = sub?.planName && sub?.status === 'active' && (!sub?.endDate || new Date(sub.endDate) >= new Date());
        if (!hasActive) {
          router.push('/pricing');
          return;
        }
        dispatch(updateUser({ hasActiveSubscription: true, subscription: sub }));
      } catch {
        router.push('/pricing');
      }
    };

    if (user.hasActiveSubscription === true) return;
    checkSubscription();
  }, [isInitialized, isAuthenticated, user, router, dispatch]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <OnboardingProvider>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      }>
        <OnboardingContent />
      </Suspense>
    </OnboardingProvider>
  );
}

