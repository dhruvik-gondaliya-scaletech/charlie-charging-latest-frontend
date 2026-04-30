import { ForgotPasswordContainer } from '@/features/auth/containers/ForgotPasswordContainer';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Recover your Scale EV account password.',
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContainer />
    </Suspense>
  );
}
