'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import { useSelector } from 'react-redux';
import jobTitleService from '../../utils/jobTitleService';

export default function AdminJobTitlesContent() {
  const { token, user } = useSelector((state) => state.auth);
  const [jobTitles, setJobTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    displayTitle: '',
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      setError('Access denied. Super admin privileges required.');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (token && user?.role === 'super_admin') {
      fetchJobTitles();
    }
  }, [token, user]);

  const fetchJobTitles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await jobTitleService.getAllAdmin(token);
      if (result.success) {
        setJobTitles(result.data || []);
      } else {
        setError(result.message || 'Failed to load job titles');
      }
    } catch (err) {
      console.error('Error fetching job titles:', err);
      setError('Failed to load job titles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.displayTitle || item.title,
        displayTitle: item.displayTitle || item.title,
        isDefault: item.isDefault || false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        displayTitle: '',
        isDefault: false,
      });
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const handleCloseDialog = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({ title: '', displayTitle: '', isDefault: false });
    setFormErrors({});
  };

  const validateForm = () => {
    const errs = {};
    const t = (formData.title || '').trim();
    if (!t) errs.title = 'Job title is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        displayTitle: (formData.displayTitle || formData.title).trim() || formData.title.trim(),
        isDefault: formData.isDefault,
      };

      let result;
      if (editingItem) {
        result = await jobTitleService.update(editingItem._id, payload, token);
      } else {
        result = await jobTitleService.create(payload, token);
      }

      if (result.success) {
        handleCloseDialog();
        fetchJobTitles();
      } else {
        setError(result.message || 'Failed to save job title');
      }
    } catch (err) {
      console.error('Error saving job title:', err);
      setError('Failed to save job title');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job title?')) return;

    try {
      const result = await jobTitleService.delete(id, token);
      if (result.success) {
        fetchJobTitles();
      } else {
        setError(result.message || 'Failed to delete job title');
      }
    } catch (err) {
      console.error('Error deleting job title:', err);
      setError('Failed to delete job title');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user?.role !== 'super_admin') {
    return (
      <Box>
        <Alert severity="error">Access denied. Super admin privileges required.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Job Titles (Master Data)
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
            Manage job titles used in signup and onboarding.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#2463eb',
            color: 'white',
            textTransform: 'none',
            '&:hover': { bgcolor: '#1e40af' },
          }}
        >
          Add Job Title
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Job Title</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Default</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }} align="right">Usage Count</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobTitles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography sx={{ color: '#64748b' }}>No job titles found. Add your first job title!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              jobTitles.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 500 }}>{item.displayTitle || item.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.isDefault ? 'Yes' : 'No'}
                      color={item.isDefault ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{item.usageCount ?? 0}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(item)} sx={{ color: '#2463eb' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item._id)}
                      sx={{ color: '#ef4444', ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Job Title' : 'Create Job Title'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value, displayTitle: formData.displayTitle || e.target.value })}
              error={!!formErrors.title}
              helperText={formErrors.title}
              fullWidth
              required
              placeholder="e.g. Software Engineer"
            />
            <TextField
              label="Display Title (optional)"
              value={formData.displayTitle}
              onChange={(e) => setFormData({ ...formData, displayTitle: e.target.value })}
              fullWidth
              helperText="Leave empty to use job title. Use for capitalization or alternate display."
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
              }
              label="Default (show in top of list)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: '#2463eb', '&:hover': { bgcolor: '#1e40af' } }}
          >
            {submitting ? <CircularProgress size={20} /> : editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
