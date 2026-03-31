'use client';

import { useForgotPassword } from '@/hooks/post/useAuthMutations';
import { ForgotPasswordFormData } from '@/lib/validations/auth.schema';
import { AuthCard } from '../components/AuthCard';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

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
      <AuthCard
        title="Check your email"
        description="We have sent a password reset link to your email address"
      >
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Please click the link in the email to reset your password. If you don't see it, check your spam folder.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center text-sm">
          <a href="/login" className="text-primary hover:underline font-medium">
            Return to login
          </a>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      description="No worries, we'll send you reset instructions"
    >
      <ForgotPasswordForm onSubmit={handleSubmit} isLoading={forgotPasswordMutation.isPending} />
    </AuthCard>
  );
}
