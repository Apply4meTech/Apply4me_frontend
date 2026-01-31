'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  MenuItem,
  Autocomplete,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import ProfilePictureUpload from '../../../../components/profile/ProfilePictureUpload';
import { updateUser } from '../../../../store/authSlice';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const seniorityLevels = ['Intern', 'Junior', 'Mid level', 'Senior/Lead'];
const jobTypes = ['Full time', 'Part-time', 'Contract', 'Internship'];
const workLocations = ['Remote', 'Hybrid', 'On-site'];

export default function ProfilePage() {
  const { user: reduxUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [countries, setCountries] = useState([]);
  const [phoneCodes, setPhoneCodes] = useState([]);
  
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: '',
    email: '',
    phoneCode: '',
    phone: '',
    address: '',
    openToRelocate: false,
    countryOfWork: '',
    visaSponsorshipRequired: false,
    // Step 2: Job Preferences & Compensation
    primaryJobTitles: [],
    skills: [],
    totalYearsExperience: '',
    seniorityLevel: '',
    jobTypes: [],
    workLocation: '',
    locationPreference: '',
    remoteOnly: false,
    minAcceptableSalary: '',
    preferredSalaryMin: '',
    preferredSalaryMax: '',
    equityPreference: false,
    // Step 3: Documents & Links
    portfolioWebsite: '',
    github: '',
    linkedinProfile: '',
    personalBlog: '',
    resume_details: null,
    cv_details: null,
    profilePicture: null,
  });

  useEffect(() => {
    fetchProfile();
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2');
      const data = await response.json();
      
      const countryList = data
        .map((country) => ({
          name: country.name.common,
          phoneCode: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}` : '',
          code: country.cca2,
        }))
        .filter((country) => country.phoneCode)
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setCountries(countryList);
      setPhoneCodes(countryList);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${getApiUrl()}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      if (data.success && data.user) {
        setFormData({
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          phoneCode: data.user.phoneCode || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          openToRelocate: data.user.openToRelocate || false,
          countryOfWork: data.user.countryOfWork || '',
          visaSponsorshipRequired: data.user.visaSponsorshipRequired || false,
          primaryJobTitles: data.user.primaryJobTitles || [],
          skills: data.user.skills || [],
          totalYearsExperience: data.user.totalYearsExperience || '',
          seniorityLevel: data.user.seniorityLevel || '',
          jobTypes: data.user.jobTypes || [],
          workLocation: data.user.workLocation || '',
          locationPreference: data.user.locationPreference || '',
          remoteOnly: data.user.remoteOnly || false,
          minAcceptableSalary: data.user.minAcceptableSalary || '',
          preferredSalaryMin: data.user.preferredSalaryMin || '',
          preferredSalaryMax: data.user.preferredSalaryMax || '',
          equityPreference: data.user.equityPreference || false,
          portfolioWebsite: data.user.portfolioWebsite || '',
          github: data.user.github || '',
          linkedinProfile: data.user.linkedinProfile || '',
          personalBlog: data.user.personalBlog || '',
          resume_details: data.user.resume_details || null,
          cv_details: data.user.cv_details || null,
          profilePicture: data.user.profilePicture || null,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    // Prevent negative values for salary fields
    if (['minAcceptableSalary', 'preferredSalaryMin', 'preferredSalaryMax'].includes(field)) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue < 0) {
        value = 0;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field) => (event, newValue) => {
    setFormData(prev => ({ ...prev, [field]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${getApiUrl()}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        
        // Update Redux state with new user data
        if (data.user) {
          const updatedUserData = {
            name: data.user.fullName || data.user.name || reduxUser?.name,
            email: data.user.email || reduxUser?.email,
          };
          
          // Update profile picture if it exists
          if (data.user.profilePicture) {
            updatedUserData.profilePicture = data.user.profilePicture;
          }
          
          dispatch(updateUser(updatedUserData));
          
          // Also update localStorage
          if (typeof window !== 'undefined') {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...updatedUserData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpdate = (picture) => {
    setFormData(prev => ({ ...prev, profilePicture: picture }));
    
    // Update Redux state immediately when picture is uploaded
    const updatedUserData = {
      profilePicture: picture || null,
    };
    
    dispatch(updateUser(updatedUserData));
    
    // Also update localStorage
    if (typeof window !== 'undefined') {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
          Profile updated successfully!
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Top Section: Profile Picture on Left, Tabs on Right */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
            mb: 4,
            pb: 4,
            borderBottom: '1px solid #e2e8f0'
          }}>
            {/* Profile Picture on Left */}
            <Box sx={{ flexShrink: 0 }}>
              <ProfilePictureUpload
                profilePicture={formData.profilePicture}
                onUpdate={handleProfilePictureUpdate}
                userName={reduxUser?.name || formData.fullName}
              />
            </Box>

            {/* Tabs on Right */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  '& .MuiTabs-flexContainer': {
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                  }
                }}
              >
                <Tab label="Personal Information" />
                <Tab label="Job Preferences" />
                <Tab label="Documents & Links" />
              </Tabs>
            </Box>
          </Box>

          {/* Form Fields Section - Full Width */}
          <Box sx={{ width: '100%' }}>
            {/* Tab Panel 1: Personal Information */}
            {tabValue === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Full Name - Full Width */}
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange('fullName')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                {/* Email - Full Width */}
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  disabled
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                {/* Phone Code and Phone Number - Half Width Each */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Autocomplete
                      options={phoneCodes}
                      getOptionLabel={(option) => typeof option === 'string' ? option : `${option.name} (${option.phoneCode})`}
                      value={phoneCodes.find(c => c.phoneCode === formData.phoneCode) || null}
                      onChange={(e, newValue) => {
                        setFormData(prev => ({ ...prev, phoneCode: newValue?.phoneCode || '' }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Phone Code" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                      )}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Box>
                </Box>
                
                {/* Address - Full Width */}
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleChange('address')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                {/* Country of Work - Full Width */}
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                  value={countries.find(c => c.name === formData.countryOfWork) || null}
                  onChange={(e, newValue) => {
                    setFormData(prev => ({ ...prev, countryOfWork: newValue?.name || '' }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country of Work" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  )}
                  fullWidth
                />
                
                {/* Open to Relocate - Full Width */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.openToRelocate}
                      onChange={handleChange('openToRelocate')}
                    />
                  }
                  label="Open to Relocate"
                />
                
                {/* Visa Sponsorship Required - Full Width */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.visaSponsorshipRequired}
                      onChange={handleChange('visaSponsorshipRequired')}
                    />
                  }
                  label="Visa Sponsorship Required"
                />
              </Box>
            )}

            {/* Tab Panel 2: Job Preferences */}
            {tabValue === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Autocomplete
                  multiple
                  options={[]}
                  freeSolo
                  value={formData.primaryJobTitles}
                  onChange={handleArrayChange('primaryJobTitles')}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip label={option} {...getTagProps({ index })} key={index} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Primary Job Titles" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  )}
                  fullWidth
                />
                
                <Autocomplete
                  multiple
                  options={[]}
                  freeSolo
                  value={formData.skills}
                  onChange={handleArrayChange('skills')}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip label={option} {...getTagProps({ index })} key={index} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Skills" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  )}
                  fullWidth
                />
                
                <TextField
                  fullWidth
                  label="Total Years of Experience"
                  type="number"
                  value={formData.totalYearsExperience}
                  onChange={handleChange('totalYearsExperience')}
                  inputProps={{ min: 0 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <TextField
                  fullWidth
                  select
                  label="Seniority Level"
                  value={formData.seniorityLevel}
                  onChange={handleChange('seniorityLevel')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
                  {seniorityLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
                
                <Autocomplete
                  multiple
                  options={jobTypes}
                  value={formData.jobTypes}
                  onChange={handleArrayChange('jobTypes')}
                  renderInput={(params) => (
                    <TextField {...params} label="Job Types" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  )}
                  fullWidth
                />
                
                <TextField
                  fullWidth
                  select
                  label="Work Location"
                  value={formData.workLocation}
                  onChange={handleChange('workLocation')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
                  {workLocations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  fullWidth
                  label="Location Preference"
                  value={formData.locationPreference}
                  onChange={handleChange('locationPreference')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.remoteOnly}
                      onChange={handleChange('remoteOnly')}
                    />
                  }
                  label="Remote Only"
                />
                
                <TextField
                  fullWidth
                  label="Min Acceptable Salary"
                  type="number"
                  value={formData.minAcceptableSalary}
                  onChange={handleChange('minAcceptableSalary')}
                  inputProps={{ min: 0 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <TextField
                  fullWidth
                  label="Preferred Salary Min"
                  type="number"
                  value={formData.preferredSalaryMin}
                  onChange={handleChange('preferredSalaryMin')}
                  inputProps={{ min: 0 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <TextField
                  fullWidth
                  label="Preferred Salary Max"
                  type="number"
                  value={formData.preferredSalaryMax}
                  onChange={handleChange('preferredSalaryMax')}
                  inputProps={{ min: 0 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.equityPreference}
                      onChange={handleChange('equityPreference')}
                    />
                  }
                  label="Equity Preference"
                />
              </Box>
            )}

            {/* Tab Panel 3: Documents & Links */}
            {tabValue === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Portfolio Website"
                  type="url"
                  value={formData.portfolioWebsite}
                  onChange={handleChange('portfolioWebsite')}
                  placeholder="https://yourportfolio.com"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <TextField
                  fullWidth
                  label="GitHub"
                  type="url"
                  value={formData.github}
                  onChange={handleChange('github')}
                  placeholder="https://github.com/username"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <TextField
                  fullWidth
                  label="LinkedIn Profile"
                  type="url"
                  value={formData.linkedinProfile}
                  onChange={handleChange('linkedinProfile')}
                  placeholder="https://linkedin.com/in/yourprofile"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <TextField
                  fullWidth
                  label="Personal Blog"
                  type="url"
                  value={formData.personalBlog}
                  onChange={handleChange('personalBlog')}
                  placeholder="https://yourblog.com"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                {formData.resume_details && (
                  <Paper 
                    sx={{ 
                      p: 2, 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#2463eb',
                        bgcolor: '#f8fafc',
                      }
                    }}
                    onClick={() => {
                      if (formData.resume_details?.url) {
                        window.open(formData.resume_details.url, '_blank');
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DescriptionIcon sx={{ color: '#2463eb', fontSize: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                          {formData.resume_details.fileName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatFileSize(formData.resume_details.fileSize)}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#2463eb' }}>
                        Click to view
                      </Typography>
                    </Box>
                  </Paper>
                )}
                
                {formData.cv_details && (
                  <Paper 
                    sx={{ 
                      p: 2, 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#2463eb',
                        bgcolor: '#f8fafc',
                      }
                    }}
                    onClick={() => {
                      if (formData.cv_details?.url) {
                        window.open(formData.cv_details.url, '_blank');
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DescriptionIcon sx={{ color: '#2463eb', fontSize: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                          {formData.cv_details.fileName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatFileSize(formData.cv_details.fileSize)}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#2463eb' }}>
                        Click to view
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 4,
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}


