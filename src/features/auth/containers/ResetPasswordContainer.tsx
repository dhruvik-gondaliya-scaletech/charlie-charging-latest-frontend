'use client';

import { useResetPassword } from '@/hooks/post/useAuthMutations';
import { ResetPasswordFormData } from '@/lib/validations/auth.schema';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordContent() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetPasswordMutation = useResetPassword();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <>
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Invalid Link</h1>
          <p className="text-muted-foreground font-medium">The password reset link is invalid or has expired.</p>
        </div>

        <Alert className="border-destructive/50 bg-destructive/5 rounded-2xl">
          <XCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            Please request a new password reset link.
          </AlertDescription>
        </Alert>
        
        <div className="mt-8 text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline font-bold">
            Go to forgot password
          </Link>
        </div>
      </>
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
      <>
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Password Reset</h1>
          <p className="text-muted-foreground font-medium">Your password has been reset successfully.</p>
        </div>

        <Alert className="border-green-500/50 bg-green-500/5 rounded-2xl">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
            You can now log in with your new password. Redirecting to login...
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Reset Password</h1>
        <p className="text-muted-foreground font-medium">Enter your new password below.</p>
      </div>

      {error && (
        <Alert className="mb-8 border-destructive/50 bg-destructive/5 rounded-2xl">
          <XCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-[2rem] shadow-2xl shadow-primary/5">
        <ResetPasswordForm onSubmit={handleSubmit} isLoading={resetPasswordMutation.isPending} />
      </div>
    </>
  );
}

export function ResetPasswordContainer() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
