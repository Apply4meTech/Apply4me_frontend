'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Employee login is now unified with user login at /login.
 * Redirect /employee/login to /login for backward compatibility.
 */
export default function EmployeeLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
