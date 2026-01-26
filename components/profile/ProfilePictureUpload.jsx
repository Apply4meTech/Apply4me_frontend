'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CropIcon from '@mui/icons-material/Crop';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function ProfilePictureUpload({ profilePicture, onUpdate, userName, isEmployee = false }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(profilePicture?.url || null);
  const fileInputRef = useRef(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setCropDialogOpen(true);
    }
  };

  const handleCropAndUpload = async (croppedFile) => {
    try {
      setUploading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('picture', croppedFile);

      // Determine API endpoint based on isEmployee prop
      const apiUrl = isEmployee 
        ? `${getApiUrl()}/api/employee/profile/picture`
        : `${getApiUrl()}/api/profile/picture`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload profile picture');
      }

      if (data.success && data.profilePicture) {
        setPreview(data.profilePicture.url);
        if (onUpdate) {
          onUpdate(data.profilePicture);
        }
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      setCropDialogOpen(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    try {
      setUploading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Determine API endpoint
      const apiUrl = isEmployee 
        ? `${getApiUrl()}/api/employee/profile/picture`
        : `${getApiUrl()}/api/profile/picture`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete profile picture');
      }

      setPreview(null);
      if (onUpdate) {
        onUpdate(null);
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      alert(error.message || 'Failed to delete profile picture');
    } finally {
      setUploading(false);
    }
  };

  // Simple crop implementation - for now, just upload the file
  // In production, you'd use react-easy-crop or similar library
  const handleSimpleUpload = async () => {
    if (!selectedFile) return;
    
    // For now, upload without cropping
    // TODO: Add proper cropping functionality with react-easy-crop
    await handleCropAndUpload(selectedFile);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={preview}
          sx={{
            bgcolor: '#2463eb',
            width: 120,
            height: 120,
            fontSize: '3rem',
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {!preview && (userName?.charAt(0)?.toUpperCase() || 'U')}
        </Avatar>
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
            }}
          >
            <CircularProgress size={40} sx={{ color: 'white' }} />
          </Box>
        )}
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: '#2463eb',
            color: 'white',
            '&:hover': { bgcolor: '#1d4ed8' },
            width: 36,
            height: 36,
          }}
        >
          <PhotoCameraIcon fontSize="small" />
        </IconButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Box>
      
      {preview && (
        <Button
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={uploading}
          color="error"
          size="small"
        >
          Remove Picture
        </Button>
      )}

      {/* Simple Crop Dialog - TODO: Replace with proper cropping */}
      <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Profile Picture</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
              />
              <Typography sx={{ mt: 2, color: '#64748b', fontSize: '0.875rem' }}>
                Note: Image cropping will be added in the next update. For now, the image will be uploaded as-is.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSimpleUpload} variant="contained" disabled={uploading}>
            {uploading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
