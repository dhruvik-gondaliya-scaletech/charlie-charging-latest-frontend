import { ForgotPasswordContainer } from '@/features/auth/containers/ForgotPasswordContainer';
import { Suspense } from 'react';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContainer />
    </Suspense>
  );
}
