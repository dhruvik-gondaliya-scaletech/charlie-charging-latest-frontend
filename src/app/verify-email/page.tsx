import { VerifyEmailContainer } from '@/features/auth/containers/VerifyEmailContainer';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Confirm your email address to activate your Scale EV account.',
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContainer />
    </Suspense>
  );
}
