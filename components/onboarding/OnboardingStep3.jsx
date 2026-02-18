'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Input,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { useOnboarding } from './OnboardingContext';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ResumeATSReport from './ResumeATSReport';

// Ensure API_URL doesn't end with /api to avoid double /api/api
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};
const API_URL = getApiUrl();

export default function OnboardingStep3() {
  const { formData, updateFormData, errors, setFieldError } = useOnboarding();
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    updateFormData(field, value);
    
    // URL validation
    if (value && ['portfolioWebsite', 'github', 'linkedinProfile', 'personalBlog'].includes(field)) {
      try {
        new URL(value);
        if (errors[field]) {
          setFieldError(field, '');
        }
      } catch {
        if (value && !value.startsWith('http')) {
          setFieldError(field, 'Please enter a valid URL (must start with http:// or https://)');
        }
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = (field) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = {
      resume: ['.pdf', '.doc', '.docx'],
      cv: ['.pdf', '.doc', '.docx', '.txt'],
    };
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const allowed = allowedTypes[field] || ['.pdf', '.doc', '.docx'];
    
    if (!allowed.includes(fileExtension)) {
      setFieldError(field, `Please upload a ${allowed.join(', ')} file`);
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFieldError(field, 'File size must be less than 5MB');
      return;
    }

    // Clear any previous errors
    if (errors[field]) {
      setFieldError(field, '');
    }

    // Upload file immediately
    const isResume = field === 'resume';
    if (isResume) {
      setUploadingResume(true);
    } else {
      setUploadingCV(true);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const fileType = isResume ? 'resume' : 'cv';
      const response = await fetch(`${API_URL}/api/upload/${fileType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      if (data.success && data.fileDetails) {
        // Save file details to form data
        const detailsKey = isResume ? 'resume_details' : 'cv_details';
        updateFormData(detailsKey, data.fileDetails);
        
        // If resume was uploaded, trigger ATS report display
        if (isResume) {
          setResumeUploaded(true);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setFieldError(field, error.message || 'Failed to upload file. Please try again.');
    } finally {
      if (isResume) {
        setUploadingResume(false);
      } else {
        setUploadingCV(false);
      }
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveFile = async (field) => {
    const isResume = field === 'resume';
    const fileType = isResume ? 'resume' : 'cv';
    const detailsKey = isResume ? 'resume_details' : 'cv_details';

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/upload/${fileType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove from form data
        updateFormData(detailsKey, null);
        
        // If resume was deleted, reset ATS report state
        if (isResume) {
          setResumeUploaded(false);
        }
      } else {
        throw new Error(data.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setFieldError(field, error.message || 'Failed to delete file');
    }
  };

  const handleViewFile = (fileDetails) => {
    if (fileDetails && fileDetails.url) {
      window.open(fileDetails.url, '_blank');
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Documents & Links
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Resume Upload */}
        <Box>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
            Resume <span style={{ color: '#dc2626' }}>*</span>
          </Typography>
          
          {!formData.resume_details ? (
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={uploadingResume ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                disabled={uploadingResume}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  borderColor: '#e2e8f0',
                  color: '#0f172a',
                  '&:hover': {
                    borderColor: '#2463eb',
                    bgcolor: '#eff6ff',
                  },
                  '&:disabled': {
                    borderColor: '#cbd5e1',
                    color: '#94a3b8',
                  },
                }}
              >
                {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange('resume')}
                  disabled={uploadingResume}
                  sx={{ display: 'none' }}
                />
              </Button>
              {errors.resume && (
                <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', mt: 1 }}>
                  {errors.resume}
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                p: 2,
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                bgcolor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <DescriptionIcon sx={{ color: '#2463eb', fontSize: 32 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    {formData.resume_details.fileName}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5 }}>
                    {formatFileSize(formData.resume_details.fileSize)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleViewFile(formData.resume_details)}
                  sx={{
                    color: '#2463eb',
                    '&:hover': { bgcolor: '#eff6ff' },
                  }}
                  title="View file"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile('resume')}
                  sx={{
                    color: '#ef4444',
                    '&:hover': { bgcolor: '#fee2e2' },
                  }}
                  title="Remove file"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>

        {/* ATS Report - Show after resume is uploaded */}
        {formData.resume_details && (
          <Box sx={{ mt: 3 }}>
            <ResumeATSReport 
              resumeUploaded={resumeUploaded}
              onOptimizeComplete={(data) => {
                console.log('Resume optimized:', data);
                // Optionally refresh or show success message
              }}
            />
          </Box>
        )}

        {/* CV (Cover Letter) Upload */}
        <Box>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
            Cover Letter (CV)
          </Typography>
          
          {!formData.cv_details ? (
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={uploadingCV ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                disabled={uploadingCV}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  borderColor: '#e2e8f0',
                  color: '#0f172a',
                  '&:hover': {
                    borderColor: '#2463eb',
                    bgcolor: '#eff6ff',
                  },
                  '&:disabled': {
                    borderColor: '#cbd5e1',
                    color: '#94a3b8',
                  },
                }}
              >
                {uploadingCV ? 'Uploading...' : 'Upload Cover Letter'}
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange('cv')}
                  disabled={uploadingCV}
                  sx={{ display: 'none' }}
                />
              </Button>
              {errors.cv && (
                <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', mt: 1 }}>
                  {errors.cv}
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                p: 2,
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                bgcolor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <DescriptionIcon sx={{ color: '#2463eb', fontSize: 32 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    {formData.cv_details.fileName}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5 }}>
                    {formatFileSize(formData.cv_details.fileSize)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleViewFile(formData.cv_details)}
                  sx={{
                    color: '#2463eb',
                    '&:hover': { bgcolor: '#eff6ff' },
                  }}
                  title="View file"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile('cv')}
                  sx={{
                    color: '#ef4444',
                    '&:hover': { bgcolor: '#fee2e2' },
                  }}
                  title="Remove file"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>

        {/* Portfolio Website */}
        <TextField
          fullWidth
          label="Portfolio website"
          type="url"
          value={formData.portfolioWebsite}
          onChange={handleChange('portfolioWebsite')}
          placeholder="https://yourportfolio.com"
          error={!!errors.portfolioWebsite}
          helperText={errors.portfolioWebsite}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Github */}
        <TextField
          fullWidth
          label="Github"
          type="url"
          value={formData.github}
          onChange={handleChange('github')}
          placeholder="https://github.com/username"
          error={!!errors.github}
          helperText={errors.github}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* LinkedIn Profile */}
        <TextField
          fullWidth
          label="LinkedIn Profile"
          type="url"
          value={formData.linkedinProfile}
          onChange={handleChange('linkedinProfile')}
          placeholder="https://linkedin.com/in/yourprofile"
          error={!!errors.linkedinProfile}
          helperText={errors.linkedinProfile}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Personal Blog */}
        <TextField
          fullWidth
          label="Personal blog"
          type="url"
          value={formData.personalBlog}
          onChange={handleChange('personalBlog')}
          placeholder="https://yourblog.com"
          error={!!errors.personalBlog}
          helperText={errors.personalBlog}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>
    </Box>
  );
}


