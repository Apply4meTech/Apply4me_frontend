'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import HistoryIcon from '@mui/icons-material/History';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import interviewService from '../../utils/interviewService';

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&.Mui-focused fieldset': { borderColor: '#2463eb' }
  }
};

export default function InterviewStart() {
  const router = useRouter();
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [quotaLoading, setQuotaLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setHistoryLoading(true);
    setQuotaLoading(true);

    const [historyResult, quotaResult] = await Promise.all([
      interviewService.listInterviews(token),
      interviewService.getQuota(token)
    ]);

    if (historyResult.success) setHistory(historyResult.data);
    if (quotaResult.success) setQuota(quotaResult.data);

    setHistoryLoading(false);
    setQuotaLoading(false);
  };

  const handleStart = async () => {
    if (!jobRole.trim() && !jobDescription.trim()) {
      setError('Enter a job role or paste a job description.');
      return;
    }
    if (quota && !quota.canStart) {
      setError('No interview sessions remaining.');
      return;
    }
    setError(null);
    setLoading(true);
    const token = localStorage.getItem('token');
    const result = await interviewService.startInterview(
      { jobRole: jobRole.trim(), jobDescription: jobDescription.trim() },
      token
    );
    setLoading(false);
    if (result.success) {
      router.push(`/dashboard/interview/${result.data.id}`);
    } else {
      setError(result.message);
    }
  };

  const getStatusChip = (status) => {
    const map = {
      completed: { label: 'Completed', color: 'success' },
      in_progress: { label: 'In Progress', color: 'warning' },
      abandoned: { label: 'Abandoned', color: 'default' }
    };
    const cfg = map[status] || map.in_progress;
    return <Chip label={cfg.label} color={cfg.color} size="small" />;
  };

  const canStart = quota?.canStart && !quotaLoading;
  const inProgress = history.find((h) => h.status === 'in_progress');

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
          AI Interview Prep
        </Typography>
        {quota && quota.eligible && (
          <Chip
            label={quotaLoading ? 'Loading...' : `Sessions: ${quota.display}`}
            sx={{
              bgcolor: quota.canStart ? '#eff6ff' : '#fef2f2',
              color: quota.canStart ? '#2463eb' : '#dc2626',
              fontWeight: 600
            }}
          />
        )}
      </Box>

      <Typography sx={{ color: '#64748b', mb: 3 }}>
        Enter a job role or description. AI will ask 8 questions — answer via audio and get instant feedback.
      </Typography>

      {!quotaLoading && quota && !quota.eligible && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Interview prep is included with <strong>Pro</strong> (1 session) and <strong>Premium</strong> (3 sessions).
          You can also purchase the Interview Prep add-on.{' '}
          <Link href="/pricing" style={{ color: '#2463eb' }}>View plans</Link>
        </Alert>
      )}

      {!quotaLoading && quota?.eligible && !quota.canStart && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have used all {quota.limit} session{quota.limit === 1 ? '' : 's'}.
          {inProgress ? (
            <> Continue your in-progress interview below, or </>
          ) : (
            <> </>
          )}
          <Link href="/pricing" style={{ color: '#2463eb' }}>upgrade your plan</Link> for more sessions.
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Job Role (optional if JD provided)"
          placeholder="e.g. Frontend Developer, Product Manager"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          disabled={!canStart}
          sx={{ ...textFieldSx, mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Job Description (optional if role provided)"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={!canStart}
          sx={{ ...textFieldSx, mb: 3 }}
        />

        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <MicIcon />}
          disabled={loading || !canStart}
          onClick={handleStart}
          sx={{
            bgcolor: '#2463eb',
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            '&:hover': { bgcolor: '#1d4ed8' }
          }}
        >
          {loading ? 'Generating Questions...' : 'Start Interview'}
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryIcon sx={{ color: '#64748b' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
          Past Interviews
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {historyLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : history.length === 0 ? (
          <Typography sx={{ p: 3, color: '#64748b', textAlign: 'center' }}>
            No interviews yet. Start your first one above.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.jobRole || item.jobDescription?.slice(0, 40) || '—'}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusChip(item.status)}</TableCell>
                    <TableCell>
                      {item.overallScore != null ? `${item.overallScore}/10` : '—'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => router.push(`/dashboard/interview/${item.id}`)}
                        sx={{ textTransform: 'none', color: '#2463eb' }}
                      >
                        {item.status === 'completed' ? 'View Report' : 'Continue'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
