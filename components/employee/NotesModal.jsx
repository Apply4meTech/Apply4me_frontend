'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function NotesModal({ open, onClose, job, onUpdate }) {
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (job) {
      setNotes(job.notes || '');
    }
  }, [job, open]);

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

  if (!job) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ fontWeight: 600, color: '#0f172a' }}>
        Notes - {job.jobTitle}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={10}
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
          {job.notesUpdatedAt && (
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Last updated: {new Date(job.notesUpdatedAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ color: '#64748b', textTransform: 'none' }}>
          Close
        </Button>
        <Button
          variant="contained"
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
      </DialogActions>
    </Dialog>
  );
}
