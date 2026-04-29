'use client';

import { useForgotPassword } from '@/hooks/post/useAuthMutations';
import { ForgotPasswordFormData } from '@/lib/validations/auth.schema';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function ForgotPasswordContainer() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password request failed:', error);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Check your email</h1>
          <p className="text-muted-foreground font-medium">We have sent a password reset link to your email address.</p>
        </div>

        <Alert className="border-green-500/50 bg-green-500/5 rounded-2xl">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
            Please click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
          </AlertDescription>
        </Alert>

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-primary hover:underline font-bold">
            Return to login
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Forgot password?</h1>
        <p className="text-muted-foreground font-medium">No worries, we&apos;ll send you reset instructions.</p>
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-[2rem] shadow-2xl shadow-primary/5">
        <ForgotPasswordForm onSubmit={handleSubmit} isLoading={forgotPasswordMutation.isPending} />
      </div>
    </>
  );
}
