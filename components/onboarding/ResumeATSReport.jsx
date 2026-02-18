'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};
const API_URL = getApiUrl();

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // amber
  return '#ef4444'; // red
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'default';
  }
};

export default function ResumeATSReport({ resumeUploaded, onOptimizeComplete }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (resumeUploaded) {
      // Wait a bit for background analysis to complete, then fetch report
      const timer = setTimeout(() => {
        fetchATSReport();
      }, 3000); // Wait 3 seconds for background analysis

      return () => clearTimeout(timer);
    }
  }, [resumeUploaded]);

  const fetchATSReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/resume/report`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Check if report has valid data
        const hasValidData = data.report && 
                            data.report.score !== null && 
                            data.report.score !== undefined;
        
        if (hasValidData) {
          setReport(data.report);
        } else {
          // Report exists but is empty, trigger analysis
          setError('Report exists but is empty. Analyzing...');
          await triggerAnalysis();
        }
      } else if (response.status === 404) {
        // No report yet, try to analyze if canAnalyze is true
        if (data.canAnalyze) {
          await triggerAnalysis();
        } else {
          throw new Error(data.error || 'Failed to fetch ATS report');
        }
      } else {
        throw new Error(data.error || 'Failed to fetch ATS report');
      }
    } catch (err) {
      console.error('Error fetching ATS report:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysis = async (force = false) => {
    try {
      setRefreshing(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const url = force 
        ? `${API_URL}/api/resume/analyze?force=true`
        : `${API_URL}/api/resume/analyze`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReport(data.report);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to analyze resume');
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/resume/optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh report to get updated scores
        await fetchATSReport();
        if (onOptimizeComplete) {
          onOptimizeComplete(data);
        }
      } else {
        throw new Error(data.error || 'Failed to optimize resume');
      }
    } catch (err) {
      console.error('Error optimizing resume:', err);
      setError(err.message);
    } finally {
      setOptimizing(false);
    }
  };

  const handleDownloadOptimized = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/resume/optimized/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Open download URL
        window.open(data.downloadUrl, '_blank');
      } else {
        throw new Error(data.error || 'Failed to get download URL');
      }
    } catch (err) {
      console.error('Error downloading optimized resume:', err);
      setError(err.message);
    }
  };

  if (loading && !report) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, color: '#64748b' }}>
          Analyzing your resume for ATS compatibility...
        </Typography>
      </Box>
    );
  }

  if (error && !report) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button
          size="small"
          onClick={triggerAnalysis}
          sx={{ mt: 1 }}
          disabled={refreshing}
        >
          {refreshing ? <CircularProgress size={16} /> : 'Try Again'}
        </Button>
      </Alert>
    );
  }

  if (!report) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#64748b', mb: 2 }}>
          No ATS analysis available. Click below to analyze your resume.
        </Typography>
        <Button
          variant="contained"
          onClick={triggerAnalysis}
          disabled={refreshing}
          startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
        >
          Analyze Resume
        </Button>
      </Box>
    );
  }

  const { score, summary, recommendations = [], strengths = [], weaknesses = [], optimizedResumeDetails, optimizationScore } = report;

  return (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: '12px' }}>
        <CardContent>
          {/* Score Display */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
                ATS Compatibility Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: getScoreColor(score),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                  }}
                >
                  {score}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
                    {getScoreLabel(score)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {summary || 'ATS analysis completed'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => triggerAnalysis(true)}
              disabled={refreshing}
              startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
            >
              {refreshing ? 'Analyzing...' : 'Re-analyze'}
            </Button>
          </Box>

          {/* Score Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={score}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#e2e8f0',
              '& .MuiLinearProgress-bar': {
                bgcolor: getScoreColor(score),
                borderRadius: 4,
              },
            }}
          />

          {/* Optimized Score Display */}
          {optimizationScore && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon sx={{ color: '#10b981' }} />
                <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                  Optimized Score: {optimizationScore}
                </Typography>
                <Chip
                  label={`+${optimizationScore - score} improvement`}
                  size="small"
                  sx={{ bgcolor: '#10b981', color: 'white' }}
                />
              </Box>
              {optimizedResumeDetails && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadOptimized}
                  sx={{ mt: 1, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                >
                  Download Optimized Resume
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Strengths */}
      {strengths.length > 0 && (
        <Card sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CheckCircleIcon sx={{ color: '#10b981' }} />
              <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                Strengths
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {strengths.map((strength, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.5 }} />
                  <Typography sx={{ color: '#0f172a', fontSize: '0.875rem' }}>
                    {strength}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningIcon sx={{ color: '#f59e0b' }} />
              <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                Recommendations ({recommendations.length})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recommendations.map((rec, index) => (
                <Accordion key={index} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Chip
                        label={rec.severity}
                        size="small"
                        color={getSeverityColor(rec.severity)}
                        sx={{ mr: 1 }}
                      />
                      <Typography sx={{ fontWeight: 500, color: '#0f172a', flex: 1 }}>
                        {rec.issue}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                      <strong>Suggestion:</strong> {rec.suggestion}
                    </Typography>
                    <Chip
                      label={rec.category}
                      size="small"
                      sx={{ mt: 1, bgcolor: '#f1f5f9', color: '#475569' }}
                    />
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <Card sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ErrorIcon sx={{ color: '#ef4444' }} />
              <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                Areas for Improvement
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {weaknesses.map((weakness, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                  <ErrorIcon sx={{ color: '#ef4444', fontSize: 20, mt: 0.5 }} />
                  <Typography sx={{ color: '#0f172a', fontSize: '0.875rem' }}>
                    {weakness}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Optimize Button */}
      {!optimizationScore && (
        <Card sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                  Optimize Your Resume with AI
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Let AI improve your resume's ATS compatibility automatically
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleOptimize}
                disabled={optimizing}
                startIcon={optimizing ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
                sx={{
                  bgcolor: '#2463eb',
                  '&:hover': { bgcolor: '#1d4ed8' },
                }}
              >
                {optimizing ? 'Optimizing...' : 'Optimize Resume'}
              </Button>
            </Box>
            {optimizing && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography sx={{ mt: 1, fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
                  AI is optimizing your resume... This may take 30-60 seconds.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

