import { ResetPasswordContainer } from '@/features/auth/containers/ResetPasswordContainer';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContainer />
    </Suspense>
  );
}
