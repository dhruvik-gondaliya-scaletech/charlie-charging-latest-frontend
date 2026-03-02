'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface VerifyEmailFormProps {
  onResendVerification: (email: string) => Promise<void>;
  isResending: boolean;
}

export function VerifyEmailForm({ onResendVerification, isResending }: VerifyEmailFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const messageParam = searchParams.get('message');

    if (statusParam === 'success') {
      setStatus('success');
      setMessage('Your email has been verified successfully!');
    } else if (statusParam === 'error') {
      setStatus('error');
      setMessage(messageParam || 'Email verification failed. The link may be invalid or expired.');
    } else {
      setStatus('pending');
    }
  }, [searchParams]);

  const handleResend = async () => {
    if (email) {
      await onResendVerification(email);
    }
  };

  const handleGoToLogin = () => {
    router.push(FRONTEND_ROUTES.LOGIN);
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-4">
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {message}
          </AlertDescription>
        </Alert>
        <Button onClick={handleGoToLogin} className="w-full">
          Go to Login
        </Button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-4">
        <Alert className="border-destructive bg-destructive/10">
          <XCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {message}
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            aria-label="Email address for resending verification"
          />
        </div>
        <Button 
          onClick={handleResend} 
          disabled={isResending || !email}
          className="w-full"
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Resend Verification Email'
          )}
        </Button>
        <Button onClick={handleGoToLogin} variant="outline" className="w-full">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Mail className="h-16 w-16 text-primary" />
        <h3 className="text-lg font-semibold">Verify Your Email</h3>
        <p className="text-center text-muted-foreground">
          Please check your email for a verification link. Click the link to verify your account.
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Didn&apos;t receive the email? Enter your email to resend
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          aria-label="Email address for resending verification"
        />
      </div>
      <Button 
        onClick={handleResend} 
        disabled={isResending || !email}
        className="w-full"
      >
        {isResending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Resend Verification Email'
        )}
      </Button>
      <Button onClick={handleGoToLogin} variant="outline" className="w-full">
        Back to Login
      </Button>
    </div>
  );
}
