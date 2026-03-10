import { LoginContainer } from '@/features/auth/containers/LoginContainer';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContainer />
    </Suspense>
  );
}
