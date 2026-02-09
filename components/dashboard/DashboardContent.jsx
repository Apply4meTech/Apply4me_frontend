'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NoteIcon from '@mui/icons-material/Note';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import AddJobModal from './AddJobModal';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function DashboardContent() {
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userPlan, setUserPlan] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalJobsApplied: 0,
    accountManagerName: 'Not Assigned',
    applications: []
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${getApiUrl()}/api/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }

      if (data.success) {
        setDashboardData(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${getApiUrl()}/api/users/my-plan`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success && data.data) {
        const subscription = data.data.subscription;
        if (subscription) {
          const now = new Date();
          const isExpired = subscription.endDate && new Date(subscription.endDate) < now;
          if (!isExpired && subscription.status === 'active') {
            setUserPlan(data.data);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching user plan:', err);
    }
  };

  const handleJobAdded = () => {
    fetchDashboardData();
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'applied': { bg: '#eff6ff', color: '#2463eb' },
      'response': { bg: '#dcfce7', color: '#16a34a' },
      'interview': { bg: '#dcfce7', color: '#16a34a' },
      'rejected': { bg: '#fee2e2', color: '#dc2626' },
      'pending': { bg: '#fef3c7', color: '#d97706' },
      'assigned': { bg: '#f3e8ff', color: '#9333ea' }
    };
    return statusMap[status] || { bg: '#f1f5f9', color: '#64748b' };
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const { totalJobsApplied, accountManagerName, applications } = dashboardData;

  return (
    <Box>
      {/* Top Section with Greeting and Summary Boxes */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
        {/* Left Side - Greeting and Summary Boxes */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Hi {user?.name || 'User'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{
                bgcolor: '#2463eb',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Add Job
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {/* Total Jobs Applied Box */}
            <Grid item xs={12} sm={6} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  bgcolor: 'white',
                }}
              >
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1.5 }}>
                  Total Jobs Applied
                </Typography>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
                  {totalJobsApplied}
                </Typography>
              </Paper>
            </Grid>

            {/* Current Plan Box */}
            <Grid item xs={12} sm={6} md={6}>
              <Paper
                component={Link}
                href="/dashboard/plan"
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  bgcolor: 'white',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {/* Blue left border bar */}
                {userPlan && userPlan.plan && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      bgcolor: '#2463eb',
                    }}
                  />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, pl: userPlan && userPlan.plan ? 0 : 0 }}>
                  <CardMembershipIcon sx={{ color: '#64748b', fontSize: '1.125rem' }} />
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Current Plan
                  </Typography>
                </Box>
                {userPlan && userPlan.plan ? (
                  <>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', mb: 0.5, wordBreak: 'break-word' }}>
                      {userPlan.plan.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: '#64748b', wordBreak: 'break-word' }}>
                      ${userPlan.plan.price} {userPlan.plan.currency}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#94a3b8', mb: 0.5, wordBreak: 'break-word' }}>
                      No active plan
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#2463eb', wordBreak: 'break-word' }}>
                      View Plans →
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Job Applications Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'normal', wordBreak: 'break-word', width: '60px' }}>
                  SR No
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Company Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Link
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Uploaded Files
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Source
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Notes
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', width: '60px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <WorkIcon sx={{ fontSize: '3rem', color: '#cbd5e1' }} />
                      <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
                        No job applications yet
                      </Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        Your job applications will appear here
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application, index) => {
                  const statusColors = getStatusColor(application.status);
                  return (
                    <TableRow key={application.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem', fontWeight: 600 }}>
                        {application.company || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {application.link ? (
                          <MuiLink
                            href={application.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: '#2463eb',
                              fontSize: '0.875rem',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            View Job
                          </MuiLink>
                        ) : (
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>
                            No URL
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(application.status)}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          {application.files?.resume && (
                            <Tooltip title={`Resume: ${application.files.resume.fileName}`} arrow>
                              <IconButton
                                size="small"
                                onClick={() => window.open(application.files.resume.url, '_blank')}
                                sx={{
                                  color: '#2463eb',
                                  '&:hover': { bgcolor: '#eff6ff' },
                                }}
                              >
                                <DescriptionIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {application.files?.coverLetter && (
                            <Tooltip title={`Cover Letter: ${application.files.coverLetter.fileName}`} arrow>
                              <IconButton
                                size="small"
                                onClick={() => window.open(application.files.coverLetter.url, '_blank')}
                                sx={{
                                  color: '#16a34a',
                                  '&:hover': { bgcolor: '#dcfce7' },
                                }}
                              >
                                <PictureAsPdfIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {application.files?.screenshotProof && (
                            <Tooltip title={`Screenshot Proof: ${application.files.screenshotProof.fileName}`} arrow>
                              <IconButton
                                size="small"
                                onClick={() => window.open(application.files.screenshotProof.url, '_blank')}
                                sx={{
                                  color: '#f59e0b',
                                  '&:hover': { bgcolor: '#fef3c7' },
                                }}
                              >
                                <ImageIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {(!application.files?.resume && !application.files?.coverLetter && !application.files?.screenshotProof) && (
                            <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>
                              No files
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {new Date(application.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {application.source}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedApplication(application);
                            setNotes(application.notes || '');
                            setNotesDialogOpen(true);
                          }}
                          sx={{
                            color: application.notes ? '#2463eb' : '#94a3b8',
                            '&:hover': {
                              bgcolor: application.notes ? '#eff6ff' : '#f1f5f9',
                            },
                          }}
                        >
                          <NoteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedApplication(application);
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={() => {
          setAnchorEl(null);
          setSelectedApplication(null);
        }}
      >
        <MenuItem 
          onClick={() => {
            if (selectedApplication) {
              setNotes(selectedApplication.notes || '');
              setNotesDialogOpen(true);
            }
            setAnchorEl(null);
          }}
        >
          <ListItemIcon><NoteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Add Notes</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notes Dialog */}
      <Dialog 
        open={notesDialogOpen} 
        onClose={() => {
          setNotesDialogOpen(false);
          setSelectedApplication(null);
          setNotes('');
        }} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#0f172a' }}>
          Notes - {selectedApplication?.company || selectedApplication?.jobName || 'Job Application'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontFamily: 'inherit',
              },
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => {
              setNotesDialogOpen(false);
              setSelectedApplication(null);
              setNotes('');
            }}
            disabled={savingNotes}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={savingNotes ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={async () => {
              if (!selectedApplication) return;
              
              try {
                setSavingNotes(true);
                const token = localStorage.getItem('token');
                if (!token) {
                  alert('Authentication required');
                  return;
                }

                const response = await fetch(`${getApiUrl()}/api/jobs/${selectedApplication.id}/notes`, {
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
                  setNotesDialogOpen(false);
                  setSelectedApplication(null);
                  setNotes('');
                  fetchDashboardData(); // Refresh data
                } else {
                  alert(data.error || 'Failed to save notes');
                }
              } catch (error) {
                console.error('Error saving notes:', error);
                alert('Failed to save notes');
              } finally {
                setSavingNotes(false);
              }
            }}
            disabled={savingNotes}
            sx={{
              bgcolor: '#2463eb',
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: '#1d4ed8' },
              '&:disabled': { bgcolor: '#cbd5e1' },
            }}
          >
            {savingNotes ? 'Saving...' : 'Save Notes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Job Modal */}
      <AddJobModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleJobAdded}
      />
    </Box>
  );
}
