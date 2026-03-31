import { AcceptInvitationContainer } from '@/features/auth/containers/AcceptInvitationContainer';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accept Invitation',
  description: 'Join an organization on the Scale EV platform.',
};

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvitationContainer />
    </Suspense>
  );
}
