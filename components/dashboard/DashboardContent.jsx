'use client';

import React from 'react';
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
} from '@mui/material';
import { useSelector } from 'react-redux';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';

export default function DashboardContent() {
  const { user } = useSelector((state) => state.auth);

  // Static data - will be replaced with API data later
  const accountManagerName = 'John Doe'; // Static for now
  
  // Dummy job applications data
  const jobApplications = [
    {
      jobName: 'Senior Software Engineer',
      link: 'https://linkedin.com/jobs/view/123456',
      status: 'Interview',
      date: '2024-01-15',
      source: 'LinkedIn',
    },
    {
      jobName: 'Full Stack Developer',
      link: 'https://indeed.com/viewjob?jk=abc123',
      status: 'Applied',
      date: '2024-01-14',
      source: 'Indeed',
    },
    {
      jobName: 'Frontend Developer',
      link: 'https://glassdoor.com/job-listing/xyz789',
      status: 'Applied',
      date: '2024-01-13',
      source: 'Glassdoor',
    },
    {
      jobName: 'React Developer',
      link: 'https://monster.com/jobs/def456',
      status: 'Pending',
      date: '2024-01-12',
      source: 'Monster',
    },
    {
      jobName: 'Software Engineer II',
      link: 'https://linkedin.com/jobs/view/789012',
      status: 'Interview',
      date: '2024-01-11',
      source: 'LinkedIn',
    },
    {
      jobName: 'Backend Developer',
      link: 'https://indeed.com/viewjob?jk=ghi789',
      status: 'Applied',
      date: '2024-01-10',
      source: 'Indeed',
    },
    {
      jobName: 'DevOps Engineer',
      link: 'https://glassdoor.com/job-listing/jkl012',
      status: 'Rejected',
      date: '2024-01-09',
      source: 'Glassdoor',
    },
    {
      jobName: 'Node.js Developer',
      link: 'https://linkedin.com/jobs/view/345678',
      status: 'Applied',
      date: '2024-01-08',
      source: 'LinkedIn',
    },
  ];

  const totalJobsApplied = jobApplications.length;

  return (
    <Box>
      {/* Top Section with Greeting and Summary Boxes */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
        {/* Left Side - Greeting and Summary Boxes */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 3 }}>
            Hi {user?.name || 'User'}
          </Typography>
          
          <Grid container spacing={2}>
            {/* Total Jobs Applied Box */}
            <Grid item xs={12} sm={6} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  bgcolor: 'white',
                }}
              >
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
                  Total Jobs Applied
                </Typography>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
                  {totalJobsApplied}
                </Typography>
              </Paper>
            </Grid>

            {/* Account Manager Box */}
            <Grid item xs={12} sm={6} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  bgcolor: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <PersonIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Account Manager
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
                  {accountManagerName}
                </Typography>
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
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Job name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Link
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Source
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobApplications.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
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
                jobApplications.map((application, index) => (
                  <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem' }}>
                      {application.jobName}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={application.status}
                        size="small"
                        sx={{
                          bgcolor: 
                            application.status === 'Applied' ? '#eff6ff' :
                            application.status === 'Interview' ? '#dcfce7' :
                            application.status === 'Rejected' ? '#fee2e2' :
                            '#fef3c7',
                          color:
                            application.status === 'Applied' ? '#2463eb' :
                            application.status === 'Interview' ? '#16a34a' :
                            application.status === 'Rejected' ? '#dc2626' :
                            '#d97706',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
