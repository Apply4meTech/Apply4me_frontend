'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Input,
  CircularProgress,
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
  const [uploadingTranscripts, setUploadingTranscripts] = useState(false);
  const [uploadingCerts, setUploadingCerts] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);


  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const UPLOAD_CONFIG = {
    resume: { type: 'resume', accept: '.pdf,.doc,.docx', maxMB: 10, setLoading: (v) => setUploadingResume(v) },
    cv: { type: 'cv', accept: '.pdf,.doc,.docx', maxMB: 10, setLoading: (v) => setUploadingCV(v) },
    academic_transcripts: { type: 'academic_transcripts', accept: '.pdf,.doc,.docx', maxMB: 10, setLoading: (v) => setUploadingTranscripts(v) },
    certifications: { type: 'certifications', accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp', maxMB: 10, setLoading: (v) => setUploadingCerts(v) },
  };

  const handleFileChange = (field) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const config = UPLOAD_CONFIG[field];
    if (!config) return;

    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const allowed = config.accept.split(',').map((x) => x.trim().toLowerCase());
    if (!allowed.includes(ext)) {
      setFieldError(field, `Please upload a ${config.accept.replace(/\./g, '').replace(/,/g, ', ')} file`);
      return;
    }

    if (file.size > config.maxMB * 1024 * 1024) {
      setFieldError(field, `File size must be less than ${config.maxMB}MB`);
      return;
    }

    if (errors[field]) setFieldError(field, '');

    config.setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required. Please login again.');

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch(`${API_URL}/api/upload/${config.type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to upload file');

      if (data.success && data.fileDetails) {
        const detailsKey = field === 'resume' ? 'resume_details' : field === 'cv' ? 'cv_details' : field === 'academic_transcripts' ? 'academicTranscripts_details' : 'certifications_details';
        updateFormData(detailsKey, data.fileDetails);
        if (field === 'resume') setResumeUploaded(true);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setFieldError(field, error.message || 'Failed to upload file. Please try again.');
    } finally {
      config.setLoading(false);
      e.target.value = '';
    }
  };

  const FILE_FIELD_MAP = {
    resume: { type: 'resume', detailsKey: 'resume_details' },
    cv: { type: 'cv', detailsKey: 'cv_details' },
    academic_transcripts: { type: 'academic_transcripts', detailsKey: 'academicTranscripts_details' },
    certifications: { type: 'certifications', detailsKey: 'certifications_details' },
  };

  const handleRemoveFile = async (field) => {
    const map = FILE_FIELD_MAP[field];
    if (!map) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/api/upload/${map.type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        updateFormData(map.detailsKey, null);
        if (field === 'resume') setResumeUploaded(false);
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

  const FileUploadBlock = ({ field, label, required, details, helperText }) => {
    const config = UPLOAD_CONFIG[field];
    const map = FILE_FIELD_MAP[field];
    if (!config || !map) return null;
    const loading = field === 'resume' ? uploadingResume : field === 'cv' ? uploadingCV : field === 'academic_transcripts' ? uploadingTranscripts : uploadingCerts;

    return (
      <Box>
        <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </Typography>
        {!details ? (
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={loading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
              disabled={loading}
              sx={{
                borderRadius: '24px',
                textTransform: 'none',
                borderColor: '#e2e8f0',
                color: '#0f172a',
                '&:hover': { borderColor: '#2463eb', bgcolor: '#eff6ff' },
                '&:disabled': { borderColor: '#cbd5e1', color: '#94a3b8' },
              }}
            >
              {loading ? 'Uploading...' : `Upload ${label}`}
              <Input type="file" accept={config.accept} onChange={handleFileChange(field)} disabled={loading} sx={{ display: 'none' }} />
            </Button>
            {errors[field] && (
              <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', mt: 1 }}>{errors[field]}</Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '24px', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <DescriptionIcon sx={{ color: '#2463eb', fontSize: 32 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{details.fileName}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5 }}>{formatFileSize(details.fileSize)}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" onClick={() => handleViewFile(details)} sx={{ color: '#2463eb', '&:hover': { bgcolor: '#eff6ff' } }} title="View file">
                <VisibilityIcon />
              </IconButton>
              <IconButton size="small" onClick={() => handleRemoveFile(field)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }} title="Remove file">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        )}
        {helperText && (
          <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5 }}>{helperText}</Typography>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Resume & Documents
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Upload Resume * */}
        <FileUploadBlock field="resume" label="Resume" required details={formData.resume_details} helperText="PDF or DOCX. Max 10MB" />

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

        <FileUploadBlock field="cv" label="Cover Letter" required={false} details={formData.cv_details} helperText="Optional. PDF or DOCX" />

        <FileUploadBlock field="academic_transcripts" label="Academic Transcripts" required={false} details={formData.academicTranscripts_details} helperText="Optional. If applicable" />

        <FileUploadBlock field="certifications" label="Certifications / Licences" required={false} details={formData.certifications_details} helperText="Optional. PDF or image" />
      </Box>
    </Box>
  );
}


