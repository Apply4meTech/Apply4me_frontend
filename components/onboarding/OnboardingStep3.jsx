'use client';

import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Input,
} from '@mui/material';
import { useOnboarding } from './OnboardingContext';
import DescriptionIcon from '@mui/icons-material/Description';

export default function OnboardingStep3() {
  const { formData, updateFormData, errors, setFieldError } = useOnboarding();

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

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = {
        resume: ['.pdf', '.doc', '.docx'],
        coverLetter: ['.pdf', '.doc', '.docx', '.txt'],
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
      
      updateFormData(field, file);
      updateFormData(`${field}FileName`, file.name);
      if (errors[field]) {
        setFieldError(field, '');
      }
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
            Resume
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<DescriptionIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#0f172a',
              '&:hover': {
                borderColor: '#2463eb',
                bgcolor: '#eff6ff',
              },
            }}
          >
            {formData.resumeFileName || 'Choose File'}
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange('resume')}
              sx={{ display: 'none' }}
            />
          </Button>
          {formData.resumeFileName && (
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 1 }}>
              Selected: {formData.resumeFileName}
            </Typography>
          )}
          {errors.resume && (
            <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', mt: 1 }}>
              {errors.resume}
            </Typography>
          )}
        </Box>

        {/* Cover Letter Upload */}
        <Box>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
            Cover letter
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<DescriptionIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#0f172a',
              '&:hover': {
                borderColor: '#2463eb',
                bgcolor: '#eff6ff',
              },
            }}
          >
            {formData.coverLetterFileName || 'Choose File'}
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange('coverLetter')}
              sx={{ display: 'none' }}
            />
          </Button>
          {formData.coverLetterFileName && (
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 1 }}>
              Selected: {formData.coverLetterFileName}
            </Typography>
          )}
          {errors.coverLetter && (
            <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', mt: 1 }}>
              {errors.coverLetter}
            </Typography>
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


