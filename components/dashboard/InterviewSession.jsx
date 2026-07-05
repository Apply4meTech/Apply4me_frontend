'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import interviewService from '../../utils/interviewService';
import InterviewReport, { InterviewProgress } from './InterviewReport';

export default function InterviewSession({ interviewId }) {
  const router = useRouter();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [lastEvaluation, setLastEvaluation] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    loadInterview();
  }, [interviewId]);

  const loadInterview = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const result = await interviewService.getInterview(interviewId, token);
    setLoading(false);
    if (result.success) {
      setInterview(result.data);
    } else {
      setError(result.message);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setAudioBlob(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType.split(';')[0] });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError('Microphone access denied. Please allow microphone permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      setError('Please record your answer first.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const token = localStorage.getItem('token');
    const result = await interviewService.submitAnswer(interviewId, audioBlob, token);
    setSubmitting(false);

    if (result.success) {
      const prevIdx = result.data.currentQuestionIndex - 1;
      const evalData = result.data.questions[prevIdx]?.evaluation;
      setLastEvaluation(evalData);
      setAudioBlob(null);
      setInterview(result.data);
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !interview) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/dashboard/interview')}>
          Back
        </Button>
      </Box>
    );
  }

  if (interview?.status === 'completed') {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard/interview')}
          sx={{ mb: 2, textTransform: 'none', color: '#64748b' }}
        >
          Back to Interviews
        </Button>
        <InterviewReport interview={interview} />
      </Box>
    );
  }

  const currentIdx = interview.currentQuestionIndex;
  const currentQuestion = interview.questions[currentIdx];
  const total = interview.totalQuestions || interview.questions.length;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/dashboard/interview')}
        sx={{ mb: 2, textTransform: 'none', color: '#64748b' }}
      >
        Back
      </Button>

      <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
        {interview.jobRole || 'Interview Session'}
      </Typography>
      {interview.jobDescription && (
        <Typography sx={{ color: '#64748b', mb: 2, fontSize: '0.875rem' }}>
          {interview.jobDescription.slice(0, 100)}
          {interview.jobDescription.length > 100 ? '...' : ''}
        </Typography>
      )}

      <InterviewProgress current={currentIdx} total={total} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {lastEvaluation && currentIdx > 0 && (
        <Alert
          severity={lastEvaluation.score >= 7 ? 'success' : lastEvaluation.score >= 5 ? 'warning' : 'info'}
          sx={{ mb: 2 }}
          onClose={() => setLastEvaluation(null)}
        >
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
            Previous answer: {lastEvaluation.score}/10
          </Typography>
          {lastEvaluation.feedback}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', mb: 3 }}>
        <Chip label={`Question ${currentIdx + 1}`} size="small" sx={{ mb: 2, bgcolor: '#eff6ff', color: '#2463eb' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.5 }}>
          {currentQuestion?.question}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <Typography sx={{ color: '#64748b', mb: 2 }}>
          {recording ? 'Recording... Click stop when done.' : audioBlob ? 'Recording ready. Submit or re-record.' : 'Click the mic to record your answer.'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          {!recording && !audioBlob && (
            <Button
              variant="contained"
              size="large"
              startIcon={<MicIcon />}
              onClick={startRecording}
              sx={{
                bgcolor: '#2463eb',
                textTransform: 'none',
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: '#1d4ed8' }
              }}
            >
              Record Answer
            </Button>
          )}

          {recording && (
            <Button
              variant="contained"
              size="large"
              color="error"
              startIcon={<StopIcon />}
              onClick={stopRecording}
              sx={{ textTransform: 'none', borderRadius: '50px', px: 4, py: 1.5 }}
            >
              Stop Recording
            </Button>
          )}

          {audioBlob && !recording && (
            <>
              <Button
                variant="outlined"
                startIcon={<MicIcon />}
                onClick={startRecording}
                disabled={submitting}
                sx={{ textTransform: 'none', borderRadius: '8px' }}
              >
                Re-record
              </Button>
              <Button
                variant="contained"
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={submitting}
                sx={{
                  bgcolor: '#16a34a',
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#15803d' }
                }}
              >
                {submitting ? 'Evaluating...' : currentIdx + 1 >= total ? 'Submit & Finish' : 'Submit & Next'}
              </Button>
            </>
          )}
        </Box>

        {recording && (
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#dc2626',
                mx: 'auto',
                animation: 'pulse 1s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.3 }
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
