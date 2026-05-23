'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  Link as MuiLink,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LinearProgress from '@mui/material/LinearProgress';
import PlanQuotaChip from './PlanQuotaChip';

const formatBool = (value) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return '—';
};

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(value);
  }
};

const formatSalary = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `$${num.toLocaleString()}`;
};

const Field = ({ label, value, fullWidth }) => (
  <Grid item xs={12} md={fullWidth ? 12 : 6}>
    <Typography sx={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 500, whiteSpace: 'pre-wrap' }}>
      {value ?? '—'}
    </Typography>
  </Grid>
);

const Section = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
      {title}
    </Typography>
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Box>
);

const DocumentCard = ({ title, doc, variant }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      bgcolor: variant === 'ats' ? '#f0fdf4' : 'white',
      height: '100%',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{title}</Typography>
      {variant === 'ats' && (
        <Chip label="ATS" size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontSize: '0.65rem' }} />
      )}
    </Box>
    {doc?.url ? (
      <Button
        size="small"
        variant="outlined"
        startIcon={<VisibilityIcon />}
        onClick={() => window.open(doc.url, '_blank')}
        sx={{ textTransform: 'none', borderColor: '#2463eb', color: '#2463eb' }}
      >
        {doc.fileName || 'View / Download'}
      </Button>
    ) : (
      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Not uploaded</Typography>
    )}
  </Paper>
);

const ConsentRow = ({ label, agreed }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
    {agreed ? (
      <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 20 }} />
    ) : (
      <CancelIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
    )}
    <Typography sx={{ fontSize: '0.875rem', color: agreed ? '#0f172a' : '#64748b' }}>{label}</Typography>
  </Box>
);

const JourneyStepRow = ({ step }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
    {step.completed ? (
      <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 20 }} />
    ) : (
      <RadioButtonUncheckedIcon sx={{ color: '#cbd5e1', fontSize: 20 }} />
    )}
    <Typography sx={{ fontSize: '0.875rem', color: step.completed ? '#0f172a' : '#64748b' }}>
      {step.step}. {step.name}
    </Typography>
  </Box>
);

export default function CustomerOnboardingDetail({ user, recentApplications = [] }) {
  if (!user) return null;

  const journey = user.onboardingJourney;
  const journeyProgress =
    journey && journey.totalSteps > 0
      ? Math.round((journey.completedCount / journey.totalSteps) * 100)
      : 0;

  const hasJobPrefs =
    (user.primaryJobTitles?.length > 0) ||
    (user.skills?.length > 0) ||
    user.totalYearsExperience != null ||
    user.seniorityLevel ||
    (user.jobTypes?.length > 0) ||
    user.workLocation ||
    user.locationPreference ||
    user.minAcceptableSalary != null;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{ p: 2.5, mb: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', mb: 0.5 }}>
              Plan usage
            </Typography>
            <Box sx={{ mb: 0.5 }}>
              <PlanQuotaChip planQuota={user.planQuota} size="medium" showProgress />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
              Total jobs: {user.applicationsCount ?? 0}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', mb: 0.5 }}>
              Payment date
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
              {formatDate(user.payment?.completedAt || user.subscription?.startDate)}
            </Typography>
            {user.payment?.planName && (
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                {user.payment.planName}
                {user.payment.amount != null ? ` · ${user.payment.currency || ''} ${user.payment.amount}` : ''}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', mb: 0.5 }}>
              Onboarding finished
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
              {formatDate(journey?.completedAt || user.onboardingCompletedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {journey && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 1 }}>
            Onboarding journey
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 1 }}>
            {journey.completedCount} of {journey.totalSteps} sections completed
            {journey.isComplete ? ' · Marked complete' : ''}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={journeyProgress}
            sx={{ height: 8, borderRadius: 4, mb: 2, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#2463eb' } }}
          />
          <Paper elevation={0} sx={{ p: 2, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {journey.steps.map((step) => (
              <JourneyStepRow key={step.key} step={step} />
            ))}
          </Paper>
          <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 1 }}>
            Registered {formatDate(journey.registeredAt)}
          </Typography>
        </Box>
      )}

      {recentApplications.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
            Recent applications (submission source)
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Job</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.title || '—'}</TableCell>
                    <TableCell>{app.company || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.submissionSourceLabel || 'Unknown'}
                        size="small"
                        sx={{ fontSize: '0.7rem', maxWidth: 220 }}
                      />
                    </TableCell>
                    <TableCell>{app.status || '—'}</TableCell>
                    <TableCell>{formatDate(app.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Section title="Personal Details">
        <Field label="Full Name" value={user.fullName || user.name} />
        <Field label="Email" value={user.email} />
        <Field label="Phone" value={user.phone ? `${user.phoneCode || ''} ${user.phone}`.trim() : null} />
        <Field label="Current Location" value={user.currentLocation} />
        <Field label="Work Rights in Australia" value={user.workRightsInAustralia} />
        <Field label="Visa Type" value={user.visaType} />
        <Field label="Address (combined)" value={user.formattedAddress || user.address} fullWidth />
        <Field label="House Number" value={user.houseNumber} />
        <Field label="Street" value={user.streetName} />
        <Field label="Suburb" value={user.suburb} />
        <Field label="State" value={user.state} />
        <Field label="Postcode" value={user.postcode} />
        <Field label="Country of Work" value={user.countryOfWork} />
        <Field label="Open to Relocate" value={formatBool(user.openToRelocate)} />
        <Field label="Visa Sponsorship Required" value={formatBool(user.visaSponsorshipRequired)} />
        <Field label="Onboarding Complete" value={formatBool(user.isOnboardingComplete)} />
        <Field label="Registered" value={formatDate(user.createdAt)} />
      </Section>

      <Divider sx={{ my: 3 }} />

      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
        Resume & Documents
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DocumentCard title="Resume" doc={user.resume || user.resume_details} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DocumentCard title="Cover Letter" doc={user.coverLetter || user.cv_details} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DocumentCard title="Academic Transcripts" doc={user.academicTranscripts || user.academicTranscripts_details} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DocumentCard title="Certifications" doc={user.certifications || user.certifications_details} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DocumentCard title="ATS Optimized Resume" doc={user.atsResume} variant="ats" />
        </Grid>
      </Grid>

      {(user.portfolioWebsite || user.github || user.linkedinProfile || user.personalBlog) && (
        <>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 1 }}>
            Links
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {user.portfolioWebsite && (
              <MuiLink href={user.portfolioWebsite} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}>
                <LinkIcon fontSize="small" /> Portfolio
              </MuiLink>
            )}
            {user.linkedinProfile && (
              <MuiLink href={user.linkedinProfile} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}>
                <LinkIcon fontSize="small" /> LinkedIn
              </MuiLink>
            )}
            {user.github && (
              <MuiLink href={user.github} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}>
                <LinkIcon fontSize="small" /> GitHub
              </MuiLink>
            )}
            {user.personalBlog && (
              <MuiLink href={user.personalBlog} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}>
                <LinkIcon fontSize="small" /> Blog
              </MuiLink>
            )}
          </Box>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Section title="Employment History">
        <Field label="Current Role" value={user.currentRole} fullWidth />
        <Field label="Previous Roles" value={user.previousRoles} fullWidth />
        <Field label="Key Responsibilities" value={user.keyResponsibilities} fullWidth />
        <Field label="Key Achievements" value={user.keyAchievements} fullWidth />
      </Section>

      {user.employmentHistory?.length > 0 && (
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: '8px' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Start</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>End</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Current</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.employmentHistory.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.jobTitle || '—'}</TableCell>
                  <TableCell>{row.company || '—'}</TableCell>
                  <TableCell>{row.startDate || '—'}</TableCell>
                  <TableCell>{row.isCurrent ? 'Present' : row.endDate || '—'}</TableCell>
                  <TableCell>{formatBool(row.isCurrent)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Divider sx={{ my: 3 }} />

      <Section title="Compliance & Checks">
        <Field label="Police Check" value={user.policeCheck} />
        <Field label="Working with Children Check" value={user.workingWithChildrenCheck} />
        <Field label="Security Clearance" value={user.securityClearance} />
        <Field label="Driver's Licence" value={user.driversLicence} />
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Availability">
        <Field label="Available Start Date" value={formatDate(user.availableStartDate)} />
        <Field label="Notice Period" value={user.noticePeriod} />
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Application Preferences">
        <Field label="How to Apply" value={user.howToApply} fullWidth />
        <Field label="Companies to Avoid" value={user.companiesToAvoid} fullWidth />
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Additional Information">
        <Field label="Anything Else" value={user.anythingElse} fullWidth />
      </Section>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
          Consent & Authorisation
        </Typography>
        <ConsentRow label="Information provided is accurate" agreed={user.consentInfoAccurate} />
        <ConsentRow label="Authorised to submit applications on my behalf" agreed={user.consentSubmitApplications} />
        <ConsentRow label="Authorised account creation on job platforms" agreed={user.consentAccountCreation} />
        <ConsentRow label="Agreed to Terms & Privacy Policy" agreed={user.consentTermsAndPrivacy} />
      </Box>

      {hasJobPrefs && (
        <>
          <Divider sx={{ my: 3 }} />
          <Section title="Job Preferences & Compensation">
            <Field label="Primary Job Titles" value={user.primaryJobTitles?.join(', ')} fullWidth />
            <Field label="Skills" value={user.skills?.join(', ')} fullWidth />
            <Field label="Years of Experience" value={user.totalYearsExperience} />
            <Field label="Seniority Level" value={user.seniorityLevel} />
            <Field label="Job Types" value={user.jobTypes?.join(', ')} />
            <Field label="Work Location" value={user.workLocation} />
            <Field label="Location Preference" value={user.locationPreference} />
            <Field label="Remote Only" value={formatBool(user.remoteOnly)} />
            <Field label="Min Acceptable Salary" value={formatSalary(user.minAcceptableSalary)} />
            <Field label="Preferred Salary Min" value={formatSalary(user.preferredSalaryMin)} />
            <Field label="Preferred Salary Max" value={formatSalary(user.preferredSalaryMax)} />
            <Field label="Equity Preference" value={formatBool(user.equityPreference)} />
          </Section>
        </>
      )}

      {(user.subscription?.planName || user.atsReport?.score != null) && (
        <>
          <Divider sx={{ my: 3 }} />
          <Section title="Plan & ATS">
            <Field label="Plan" value={user.subscription?.planName} />
            <Field label="Subscription Status" value={user.subscription?.status} />
            <Field label="ATS Score" value={user.atsReport?.score != null ? `${user.atsReport.score}%` : null} />
            <Field label="ATS Analyzed" value={formatDate(user.atsReport?.analyzedAt)} />
            {user.atsReport?.summary && (
              <Field label="ATS Summary" value={user.atsReport.summary} fullWidth />
            )}
          </Section>
        </>
      )}
    </Box>
  );
}
