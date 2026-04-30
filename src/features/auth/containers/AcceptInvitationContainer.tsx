'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AcceptInvitationForm } from '../components/AcceptInvitationForm';
import { useAcceptInvitation } from '@/hooks/post/useAuthMutations';
import { AcceptInvitationFormData } from '@/lib/validations/auth.schema';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <>
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Invalid Invitation</h1>
          <p className="text-muted-foreground font-medium">This invitation link is invalid or has expired.</p>
        </div>

        <Alert className="border-destructive/50 bg-destructive/5 rounded-2xl">
          <XCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            The invitation link is invalid or has expired. Please contact your administrator for a new invitation.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Accept Invitation</h1>
        <p className="text-muted-foreground font-medium">Complete your profile to join the organization.</p>
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-[2rem] shadow-2xl shadow-primary/5">
        <AcceptInvitationForm 
          onSubmit={handleSubmit}
          isLoading={acceptMutation.isPending}
          error={error}
        />
      </div>
    </>
  );
}
