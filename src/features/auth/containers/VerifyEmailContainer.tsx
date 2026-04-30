'use client';

import { VerifyEmailForm } from '../components/VerifyEmailForm';
import { useResendVerification } from '@/hooks/post/useAuthMutations';

export function VerifyEmailContainer() {
  const resendMutation = useResendVerification();

  const handleResendVerification = async (email: string) => {
    await resendMutation.mutateAsync(email);
  };

  return (
    <>
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Email Verification</h1>
        <p className="text-muted-foreground font-medium">Verify your email address to continue.</p>
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-[2rem] shadow-2xl shadow-primary/5">
        <VerifyEmailForm 
          onResendVerification={handleResendVerification}
          isResending={resendMutation.isPending}
        />
      </div>
    </>
  );
}
