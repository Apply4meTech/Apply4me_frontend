'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box, Typography, TextField, Paper } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';

export default function ViewDataModal({ open, onClose, job, mode = 'view' }) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    resume: '',
    coverLetter: '',
    screenshotProof: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    console.log('Saving data:', formData);
    alert('Data saved successfully!');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ fontWeight: 600, color: '#0f172a' }}>
        {mode === 'fill' ? 'Fill Data' : 'View Data'} - {job?.jobTitle}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab icon={<DescriptionIcon />} iconPosition="start" label="Resume" />
            <Tab icon={<DescriptionIcon />} iconPosition="start" label="Cover letter" />
            <Tab icon={<ImageIcon />} iconPosition="start" label="Screenshot Proof" />
          </Tabs>
        </Box>

        <Box sx={{ minHeight: '300px' }}>
          {activeTab === 0 && (
            <Box>
              {mode === 'fill' ? (
                <TextField fullWidth multiline rows={10} label="Resume Content" value={formData.resume} onChange={handleChange('resume')} placeholder="Enter resume content..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              ) : (
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#64748b' }}>Resume content will be displayed here...</Typography>
                </Paper>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {mode === 'fill' ? (
                <TextField fullWidth multiline rows={10} label="Cover Letter Content" value={formData.coverLetter} onChange={handleChange('coverLetter')} placeholder="Enter cover letter content..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              ) : (
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#64748b' }}>Cover letter content will be displayed here...</Typography>
                </Paper>
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              {mode === 'fill' ? (
                <TextField fullWidth multiline rows={10} label="Screenshot Proof" value={formData.screenshotProof} onChange={handleChange('screenshotProof')} placeholder="Enter screenshot proof or upload image..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              ) : (
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#64748b' }}>Screenshot proof will be displayed here...</Typography>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ color: '#64748b', textTransform: 'none' }}>Close</Button>
        {mode === 'fill' && (
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#2463eb', color: 'white', textTransform: 'none', '&:hover': { bgcolor: '#1e40af' } }}>
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

