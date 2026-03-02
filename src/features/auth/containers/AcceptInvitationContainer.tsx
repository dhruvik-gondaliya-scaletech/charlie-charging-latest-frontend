'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthCard } from '../components/AuthCard';
import { AcceptInvitationForm } from '../components/AcceptInvitationForm';
import { useAcceptInvitation } from '@/hooks/post/useAuthMutations';
import { AcceptInvitationFormData } from '@/lib/validations/auth.schema';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function AcceptInvitationContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const acceptMutation = useAcceptInvitation();
  const [error, setError] = useState<string | null>(null);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link. Please check your email for the correct link.');
    }
  }, [token]);

  const handleSubmit = async (data: AcceptInvitationFormData) => {
    if (!token) {
      setError('Invalid invitation link.');
      return;
    }

    try {
      await acceptMutation.mutateAsync({ token, data });
      router.push(FRONTEND_ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept invitation');
    }
  };

  if (!token) {
    return (
      <AuthCard
        title="Invalid Invitation"
        description="This invitation link is invalid or has expired"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The invitation link is invalid or has expired. Please contact your administrator for a new invitation.
          </AlertDescription>
        </Alert>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Accept Invitation"
      description="Complete your profile to join the organization"
    >
      <AcceptInvitationForm 
        onSubmit={handleSubmit}
        isLoading={acceptMutation.isPending}
        error={error}
      />
    </AuthCard>
  );
}
