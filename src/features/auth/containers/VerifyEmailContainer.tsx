'use client';

import { useState } from 'react';
import { AuthCard } from '../components/AuthCard';
import { VerifyEmailForm } from '../components/VerifyEmailForm';
import { useResendVerification } from '@/hooks/post/useAuthMutations';

export function VerifyEmailContainer() {
  const resendMutation = useResendVerification();

  const handleResendVerification = async (email: string) => {
    await resendMutation.mutateAsync(email);
  };

  return (
    <AuthCard
      title="Email Verification"
      description="Verify your email address to continue"
    >
      <VerifyEmailForm 
        onResendVerification={handleResendVerification}
        isResending={resendMutation.isPending}
      />
    </AuthCard>
  );
}
