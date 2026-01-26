'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

export default function PlanPage() {
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Static plan data - will be replaced with API data later
  const currentPlan = {
    name: 'Standard',
    price: 199,
    billingPeriod: 'monthly', // 'monthly' or 'quarterly'
    benefits: [
      '150 Applications/mo',
      'Resume Optimization',
      'Cover Letter Writing',
      'LinkedIn Audit',
    ],
  };

  const handleOpenSupportDialog = () => {
    setSupportDialogOpen(true);
  };

  const handleCloseSupportDialog = () => {
    setSupportDialogOpen(false);
    setQuery('');
  };

  const handleSubmitQuery = () => {
    // Static implementation - will be replaced with API call later
    console.log('Support query submitted:', query);
    alert('Your query has been submitted. We will get back to you soon!');
    handleCloseSupportDialog();
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          My Plan
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
          View your current subscription plan and benefits.
        </Typography>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Plan Chosen Details */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            sx={{ 
              fontSize: '0.875rem', 
              color: '#64748b', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            Plan Chosen
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography 
              sx={{ 
                fontSize: '3rem', 
                fontWeight: 700, 
                color: '#0f172a',
              }}
            >
              ${currentPlan.price}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '1.25rem', 
                color: '#64748b',
              }}
            >
              /{currentPlan.billingPeriod === 'monthly' ? 'mo' : 'quarter'}
            </Typography>
          </Box>
          <Typography 
            sx={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#0f172a',
              mt: 1,
            }}
          >
            {currentPlan.name} Plan
          </Typography>
        </Box>

        <Box sx={{ height: '1px', bgcolor: '#e2e8f0', my: 4 }} />

        {/* Plan Benefits */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            sx={{ 
              fontSize: '1.25rem', 
              fontWeight: 700, 
              color: '#0f172a',
              mb: 3,
            }}
          >
            Plan Benefits
          </Typography>
          <List sx={{ p: 0 }}>
            {currentPlan.benefits.map((benefit, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  px: 0,
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CheckCircleIcon sx={{ color: '#2463eb', fontSize: '1.5rem' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={benefit}
                  primaryTypographyProps={{
                    fontSize: '1rem',
                    color: '#0f172a',
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ height: '1px', bgcolor: '#e2e8f0', my: 4 }} />

        {/* Contact Support Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleOpenSupportDialog}
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
            }}
          >
            Contact Support
          </Button>
        </Box>

        {/* More Plans Link */}
        <Box>
          <MuiLink
            component={Link}
            href="/pricing"
            sx={{
              color: '#2463eb',
              fontSize: '1rem',
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            More Plans →
          </MuiLink>
        </Box>
      </Paper>

      {/* Contact Support Dialog */}
      <Dialog
        open={supportDialogOpen}
        onClose={handleCloseSupportDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#0f172a', pb: 1 }}>
          Contact Support
        </DialogTitle>
        <DialogContent>
          <Typography 
            sx={{ 
              fontSize: '0.875rem', 
              color: '#64748b', 
              mb: 2,
            }}
          >
            Query
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={6}
            fullWidth
            placeholder="Enter your query or question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseSupportDialog}
            sx={{
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitQuery}
            variant="contained"
            disabled={!query.trim()}
            sx={{
              bgcolor: '#2463eb',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: '#1e40af',
              },
              '&.Mui-disabled': {
                bgcolor: '#cbd5e1',
                color: '#94a3b8',
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

