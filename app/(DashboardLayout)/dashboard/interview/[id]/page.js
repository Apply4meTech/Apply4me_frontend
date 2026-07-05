'use client';

import { useParams } from 'next/navigation';
import InterviewSession from '../../../../../components/dashboard/InterviewSession';

export default function InterviewSessionPage() {
  const params = useParams();
  const id = params?.id;
  return <InterviewSession interviewId={id} />;
}
