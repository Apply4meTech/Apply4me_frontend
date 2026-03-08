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
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import planService from '../../utils/planService';

export default function AdminPlansContent() {
  const { token, user } = useSelector((state) => state.auth);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    actualPrice: '',
    currency: 'AUD',
    features: [{ text: '', included: true }],
    isPopular: false,
    badge: '',
    isActive: true,
    displayOrder: 0,
    billingPeriod: 'onetime',
    jobApplicationsLimit: '',
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
      fetchPlans();
    }
  }, [token, user]);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await planService.getAllPlans(false);
      if (result.success) {
        setPlans(result.data || []);
      } else {
        setError(result.message || 'Failed to load plans');
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || '',
        actualPrice: plan.actualPrice || '',
        currency: plan.currency || 'AUD',
        features: plan.features && plan.features.length > 0
          ? plan.features
          : [{ text: '', included: true }],
        isPopular: plan.isPopular || false,
        badge: plan.badge || '',
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        displayOrder: plan.displayOrder || 0,
        billingPeriod: plan.billingPeriod || 'onetime',
        jobApplicationsLimit: plan.jobApplicationsLimit || '',
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        actualPrice: '',
        currency: 'AUD',
        features: [{ text: '', included: true }],
        isPopular: false,
        badge: '',
        isActive: true,
        displayOrder: 0,
        billingPeriod: 'onetime',
        jobApplicationsLimit: '',
      });
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const handleCloseDialog = () => {
    setModalOpen(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      actualPrice: '',
      currency: 'AUD',
      features: [{ text: '', included: true }],
      isPopular: false,
      badge: '',
      isActive: true,
      displayOrder: 0,
      billingPeriod: 'onetime',
      jobApplicationsLimit: '',
    });
    setFormErrors({});
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { text: '', included: true }],
    });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures.length > 0 ? newFeatures : [{ text: '', included: true }],
    });
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Plan name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || formData.price < 0) errors.price = 'Valid price is required';
    if (formData.features.some((f) => !f.text.trim())) {
      errors.features = 'All features must have text';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        actualPrice: formData.actualPrice ? parseFloat(formData.actualPrice) : null,
        jobApplicationsLimit: formData.jobApplicationsLimit
          ? parseInt(formData.jobApplicationsLimit)
          : null,
        features: formData.features.filter((f) => f.text.trim()),
        displayOrder: parseInt(formData.displayOrder) || 0,
      };

      let result;
      if (editingPlan) {
        result = await planService.updatePlan(editingPlan._id, submitData, token);
      } else {
        result = await planService.createPlan(submitData, token);
      }

      if (result.success) {
        handleCloseDialog();
        fetchPlans();
      } else {
        setError(result.message || 'Failed to save plan');
      }
    } catch (err) {
      console.error('Error saving plan:', err);
      setError('Failed to save plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan? It will be marked as inactive.')) {
      return;
    }

    try {
      const result = await planService.deletePlan(planId, token);
      if (result.success) {
        fetchPlans();
      } else {
        setError(result.message || 'Failed to delete plan');
      }
    } catch (err) {
      console.error('Error deleting plan:', err);
      setError('Failed to delete plan');
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
            Plan Management
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
            Manage subscription plans for your platform.
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
          Add Plan
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
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }} align="right">Price</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography sx={{ color: '#64748b' }}>No plans found. Create your first plan!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan._id} hover>
                  <TableCell>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{plan.name}</Typography>
                      {plan.badge && (
                        <Chip label={plan.badge} size="small" sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                      {plan.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 600 }}>
                      ${plan.price} {plan.currency}
                    </Typography>
                    {plan.actualPrice && plan.actualPrice > plan.price && (
                      <Typography sx={{ color: '#64748b', fontSize: '0.75rem', textDecoration: 'line-through' }}>
                        ${plan.actualPrice}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.isActive ? 'Active' : 'Inactive'}
                      color={plan.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{plan.displayOrder}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(plan)} sx={{ color: '#2463eb' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(plan._id)}
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

      <Dialog open={modalOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Plan Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!formErrors.name}
              helperText={formErrors.name}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!formErrors.description}
              helperText={formErrors.description}
              fullWidth
              required
              multiline
              rows={2}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                error={!!formErrors.price}
                helperText={formErrors.price}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                label="Actual Price (optional)"
                type="number"
                value={formData.actualPrice}
                onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })}
                sx={{ flex: 1 }}
                helperText="For showing discount"
              />
              <TextField
                label="Currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                select
                SelectProps={{ native: true }}
                sx={{ width: 120 }}
              >
                <option value="AUD">AUD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Billing Period"
                value={formData.billingPeriod}
                onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                select
                SelectProps={{ native: true }}
                sx={{ flex: 1 }}
              >
                <option value="onetime">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </TextField>
              <TextField
                label="Display Order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Job Applications Limit"
                type="number"
                value={formData.jobApplicationsLimit}
                onChange={(e) => setFormData({ ...formData, jobApplicationsLimit: e.target.value })}
                sx={{ flex: 1 }}
                helperText="Leave empty for unlimited"
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>Features</Typography>
                <Button size="small" onClick={handleAddFeature} startIcon={<AddIcon />}>
                  Add Feature
                </Button>
              </Box>
              {formData.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    placeholder="Feature text"
                    value={feature.text}
                    onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                    sx={{ flex: 1 }}
                    size="small"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={feature.included}
                        onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
                        size="small"
                      />
                    }
                    label="Included"
                  />
                  <IconButton
                    onClick={() => handleRemoveFeature(index)}
                    size="small"
                    disabled={formData.features.length === 1}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {formErrors.features && (
                <Typography sx={{ color: '#ef4444', fontSize: '0.75rem', mt: 0.5 }}>
                  {formErrors.features}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  />
                }
                label="Mark as Popular"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Box>
            <TextField
              label="Badge (e.g., 'Most Popular', 'Best Value')"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              fullWidth
              helperText="Optional badge text to display on plan card"
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
            {submitting ? <CircularProgress size={20} /> : editingPlan ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
