import { ResetPasswordContainer } from '@/features/auth/containers/ResetPasswordContainer';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Scale EV account.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContainer />
    </Suspense>
  );
}
