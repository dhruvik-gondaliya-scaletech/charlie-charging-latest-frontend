'use client';

import { useResetPassword } from '@/hooks/post/useAuthMutations';
import { ResetPasswordFormData } from '@/lib/validations/auth.schema';
import { AuthCard } from '../components/AuthCard';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

function ResetPasswordContent() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetPasswordMutation = useResetPassword();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <AuthCard
        title="Invalid Link"
        description="The password reset link is invalid or has expired"
      >
        <Alert className="border-destructive bg-destructive/10">
          <XCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            Please request a new password reset link.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center text-sm">
          <a href="/forgot-password" className="text-primary hover:underline font-medium">
            Go to forgot password
          </a>
        </div>
      </AuthCard>
    );
  }

  const handleSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: data.password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Reset password failed:', err);
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    }
  };

  if (isSuccess) {
    return (
      <AuthCard
        title="Password Reset"
        description="Your password has been reset successfully"
      >
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            You can now log in with your new password. Redirecting to login...
          </AlertDescription>
        </Alert>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Password"
      description="Enter your new password below"
    >
      {error && (
        <Alert className="mb-4 border-destructive bg-destructive/10">
          <XCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}
      <ResetPasswordForm onSubmit={handleSubmit} isLoading={resetPasswordMutation.isPending} />
    </AuthCard>
  );
}

export function ResetPasswordContainer() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
