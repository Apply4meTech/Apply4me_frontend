'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AffiliatePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('affiliateToken');
    router.replace(token ? '/affiliate/dashboard' : '/affiliate/login');
  }, [router]);

  return null;
}
