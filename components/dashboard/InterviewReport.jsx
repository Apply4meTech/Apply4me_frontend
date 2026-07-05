'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ScoreBadge = ({ score }) => {
  const color = score >= 7 ? '#16a34a' : score >= 5 ? '#ca8a04' : '#dc2626';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: '50%',
        border: `3px solid ${color}`,
        color,
        fontWeight: 700,
        fontSize: '1.1rem'
      }}
    >
      {score}
    </Box>
  );
};

export default function InterviewReport({ interview }) {
  const { report, questions, jobRole, jobDescription } = interview;

  return (
    <Box>
      <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          {report?.overallScore != null && <ScoreBadge score={report.overallScore} />}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {jobRole || 'Interview Report'}
            </Typography>
            {jobDescription && (
              <Typography sx={{ color: '#64748b', mt: 0.5, fontSize: '0.875rem' }}>
                {jobDescription.slice(0, 120)}
                {jobDescription.length > 120 ? '...' : ''}
              </Typography>
            )}
            {report?.summary && (
              <Typography sx={{ color: '#334155', mt: 1.5 }}>{report.summary}</Typography>
            )}
          </Box>
        </Box>

        {report && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 3 }}>
            {report.strengths?.length > 0 && (
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#16a34a', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUpIcon fontSize="small" /> Strengths
                </Typography>
                <List dense disablePadding>
                  {report.strengths.map((s, i) => (
                    <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                      </ListItemIcon>
                      <ListItemText primary={s} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {report.improvements?.length > 0 && (
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#ca8a04', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WarningAmberIcon fontSize="small" /> Areas to Improve
                </Typography>
                <List dense disablePadding>
                  {report.improvements.map((s, i) => (
                    <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <WarningAmberIcon sx={{ fontSize: 16, color: '#ca8a04' }} />
                      </ListItemIcon>
                      <ListItemText primary={s} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        {report?.tips?.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f9ff', borderRadius: '8px' }}>
            <Typography sx={{ fontWeight: 600, color: '#2463eb', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LightbulbIcon fontSize="small" /> Tips for Next Time
            </Typography>
            <List dense disablePadding>
              {report.tips.map((tip, i) => (
                <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                  <ListItemText primary={`${i + 1}. ${tip}`} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 2 }}>
        Questions & Answers
      </Typography>

      {questions?.map((q, index) => (
        <Paper key={q._id || index} sx={{ p: 2.5, mb: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 1 }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
              Q{index + 1}. {q.question}
            </Typography>
            {q.evaluation?.score != null && (
              <Chip
                label={`${q.evaluation.score}/10`}
                size="small"
                sx={{
                  bgcolor: q.evaluation.score >= 7 ? '#dcfce7' : q.evaluation.score >= 5 ? '#fef9c3' : '#fee2e2',
                  color: q.evaluation.score >= 7 ? '#16a34a' : q.evaluation.score >= 5 ? '#ca8a04' : '#dc2626',
                  fontWeight: 600
                }}
              />
            )}
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500 }}>
            Your Answer
          </Typography>
          <Typography sx={{ color: '#334155', mb: 1.5, fontStyle: q.transcript ? 'normal' : 'italic' }}>
            {q.transcript || 'No answer recorded'}
          </Typography>

          {q.evaluation?.feedback && (
            <>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500 }}>
                Feedback
              </Typography>
              <Typography sx={{ color: '#334155' }}>{q.evaluation.feedback}</Typography>
            </>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export function InterviewProgress({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Question {Math.min(current + 1, total)} of {total}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          {pct}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: '#e2e8f0',
          '& .MuiLinearProgress-bar': { bgcolor: '#2463eb', borderRadius: 4 }
        }}
      />
    </Box>
  );
}
