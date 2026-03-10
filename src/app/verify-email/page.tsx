import { VerifyEmailContainer } from '@/features/auth/containers/VerifyEmailContainer';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContainer />
    </Suspense>
  );
}
