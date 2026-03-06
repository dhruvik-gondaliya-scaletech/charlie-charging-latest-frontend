import { AcceptInvitationContainer } from '@/features/auth/containers/AcceptInvitationContainer';
import { Suspense } from 'react';

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvitationContainer />
    </Suspense>
  );
}
