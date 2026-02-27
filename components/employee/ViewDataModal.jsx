'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Tabs, 
  Tab, 
  Box, 
  Typography, 
  TextField, 
  Paper,
  Input,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NoteIcon from '@mui/icons-material/Note';
import SaveIcon from '@mui/icons-material/Save';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function ViewDataModal({ open, onClose, job, mode = 'view', onUpdate }) {
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileType, setFileType] = useState(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [savingMetadata, setSavingMetadata] = useState(false);
  const [customizingResume, setCustomizingResume] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !job) return;

    try {
      setUploading(true);
      setFileType(type);
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${job.id}/files/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`${type} uploaded successfully`);
        if (onUpdate) {
          onUpdate();
        }
      } else {
        alert(data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      setFileType(null);
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (type) => {
    if (!confirm(`Are you sure you want to delete the ${type}?`)) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${job.id}/files/${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`${type} deleted successfully`);
        if (onUpdate) {
          onUpdate();
        }
      } else {
        alert(data.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const handleViewFile = (fileData) => {
    if (fileData && fileData.url) {
      window.open(fileData.url, '_blank');
    }
  };

  // Load notes and job description when job changes
  useEffect(() => {
    if (job) {
      setNotes(job.notes || '');
      setJobDescription((job.metadata && job.metadata.description) || '');
    }
  }, [job]);

  const handleSaveNotes = async () => {
    if (!job) return;

    try {
      setSavingNotes(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${job.id}/notes`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Notes saved successfully');
        if (onUpdate) {
          onUpdate();
        }
      } else {
        alert(data.error || 'Failed to save notes');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSaveJobDescription = async () => {
    if (!job) return;

    try {
      setSavingMetadata(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${job.id}/metadata`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: jobDescription }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Job description saved. You can now use "Customize resume" if this user has a Pro/Standard/Premium plan.');
        if (onUpdate) {
          onUpdate();
        }
      } else {
        alert(data.error || 'Failed to save job description');
      }
    } catch (error) {
      console.error('Error saving job description:', error);
      alert('Failed to save job description');
    } finally {
      setSavingMetadata(false);
    }
  };

  const handleCustomizeResume = async () => {
    if (!job || !job.canCustomizeResume) return;

    const desc = jobDescription.trim() || (job.metadata && job.metadata.description) || '';
    if (!desc || desc.length < 20) {
      alert('Please paste the job description above (at least 20 characters), then click Customize resume.');
      return;
    }

    try {
      setCustomizingResume(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${job.id}/customize-resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: desc }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank');
        }
        alert(
          (data.message || 'Customized resume ready.') +
          ' Download the file, then upload it as Resume above and upload a screenshot proof.'
        );
      } else {
        alert(data.error || 'Failed to generate customized resume');
      }
    } catch (error) {
      console.error('Error customizing resume:', error);
      alert('Failed to generate customized resume');
    } finally {
      setCustomizingResume(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ fontWeight: 600, color: '#0f172a' }}>
        {mode === 'fill' ? 'Fill Data' : 'View Data'} - {job.jobTitle}
      </DialogTitle>
      <DialogContent>
        {mode === 'fill' ? (
          // Fill Data mode - Job description, Customize resume (if eligible), Uploads, Notes
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Job description - paste then save so Customize resume can use it */}
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 1 }}>
                Job description (paste from job posting)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here. Save before using Customize resume."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={savingMetadata ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleSaveJobDescription}
                  disabled={savingMetadata}
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  {savingMetadata ? 'Saving...' : 'Save job description'}
                </Button>
              </Box>
            </Box>

            {/* Customize resume - only for non-Starter (Pro/Standard/Premium) */}
            {job.canCustomizeResume && (
              <Paper sx={{ p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534', mb: 1 }}>
                  Customized resume (this user has {job.userPlanName || 'Pro'} plan)
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#15803d', mb: 2 }}>
                  Generate a resume tailored to the job description above. Then upload the downloaded file as Resume and add a screenshot proof.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={customizingResume ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
                  onClick={handleCustomizeResume}
                  disabled={customizingResume}
                  sx={{
                    bgcolor: '#16a34a',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#15803d' },
                    '&:disabled': { bgcolor: '#94a3b8' },
                  }}
                >
                  {customizingResume ? 'Generating...' : 'Customize resume'}
                </Button>
              </Paper>
            )}

            {/* Notes */}
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 1 }}>
                Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={savingNotes ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  sx={{
                    bgcolor: '#2463eb',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    '&:disabled': { bgcolor: '#cbd5e1' },
                  }}
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
              </Box>
              {job.notesUpdatedAt && (
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.5 }}>
                  Last updated: {new Date(job.notesUpdatedAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          // View mode - Show all tabs
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab icon={<DescriptionIcon />} iconPosition="start" label="Resume" />
                <Tab icon={<DescriptionIcon />} iconPosition="start" label="Cover Letter" />
                <Tab icon={<ImageIcon />} iconPosition="start" label="Screenshot Proof" />
                <Tab icon={<NoteIcon />} iconPosition="start" label="Notes" />
              </Tabs>
            </Box>

        <Box sx={{ minHeight: '300px' }}>
          {/* Resume Tab */}
          {activeTab === 0 && (
            <Box>
              {job.resume ? (
                <Paper sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <DescriptionIcon sx={{ color: '#2463eb', fontSize: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                          {job.resume.fileName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatFileSize(job.resume.fileSize)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewFile(job.resume)}
                        sx={{ color: '#2463eb', '&:hover': { bgcolor: '#eff6ff' } }}
                        title="View file"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {mode === 'fill' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFile('resume')}
                          sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                          title="Delete file"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <Typography sx={{ color: '#64748b', mb: 2 }}>No resume uploaded</Typography>
                  {mode === 'fill' && (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading && fileType === 'resume'}
                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                      {uploading && fileType === 'resume' ? 'Uploading...' : 'Upload Resume'}
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'resume')}
                        sx={{ display: 'none' }}
                        disabled={uploading}
                      />
                    </Button>
                  )}
                </Paper>
              )}
            </Box>
          )}

          {/* Cover Letter Tab */}
          {activeTab === 1 && (
            <Box>
              {job.coverLetter ? (
                <Paper sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <DescriptionIcon sx={{ color: '#2463eb', fontSize: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                          {job.coverLetter.fileName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatFileSize(job.coverLetter.fileSize)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewFile(job.coverLetter)}
                        sx={{ color: '#2463eb', '&:hover': { bgcolor: '#eff6ff' } }}
                        title="View file"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {mode === 'fill' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFile('coverLetter')}
                          sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                          title="Delete file"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <Typography sx={{ color: '#64748b', mb: 2 }}>No cover letter uploaded</Typography>
                  {mode === 'fill' && (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading && fileType === 'coverLetter'}
                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                      {uploading && fileType === 'coverLetter' ? 'Uploading...' : 'Upload Cover Letter'}
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileUpload(e, 'coverLetter')}
                        sx={{ display: 'none' }}
                        disabled={uploading}
                      />
                    </Button>
                  )}
                </Paper>
              )}
            </Box>
          )}

          {/* Screenshot Proof Tab */}
          {activeTab === 2 && (
            <Box>
              {job.screenshotProof ? (
                <Paper sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <ImageIcon sx={{ color: '#2463eb', fontSize: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                          {job.screenshotProof.fileName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatFileSize(job.screenshotProof.fileSize)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewFile(job.screenshotProof)}
                        sx={{ color: '#2463eb', '&:hover': { bgcolor: '#eff6ff' } }}
                        title="View file"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {mode === 'fill' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFile('screenshotProof')}
                          sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                          title="Delete file"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <Typography sx={{ color: '#64748b', mb: 2 }}>No screenshot proof uploaded</Typography>
                  {mode === 'fill' && (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading && fileType === 'screenshotProof'}
                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                      {uploading && fileType === 'screenshotProof' ? 'Uploading...' : 'Upload Screenshot Proof'}
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, 'screenshotProof')}
                        sx={{ display: 'none' }}
                        disabled={uploading}
                      />
                    </Button>
                  )}
                </Paper>
              )}
            </Box>
          )}

          {/* Notes Tab */}
          {activeTab === 3 && (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={12}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                  },
                }}
                disabled={mode === 'view'}
              />
              {mode === 'fill' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={savingNotes ? <CircularProgress size={16} /> : <SaveIcon />}
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    sx={{
                      bgcolor: '#2463eb',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '8px',
                      '&:hover': { bgcolor: '#1d4ed8' },
                      '&:disabled': { bgcolor: '#cbd5e1' },
                    }}
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </Button>
                </Box>
              )}
              {job.notesUpdatedAt && (
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 1 }}>
                  Last updated: {new Date(job.notesUpdatedAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}
        </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ color: '#64748b', textTransform: 'none' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
