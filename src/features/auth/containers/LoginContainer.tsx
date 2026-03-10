'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginFormData } from '@/lib/validations/auth.schema';
import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, XCircle } from 'lucide-react';

export function LoginContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'error' | 'warning' | 'info'; message: string } | null>(null);
  const { login } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const inactive = searchParams.get('inactive');
    const expired = searchParams.get('expired');
    const unauthorized = searchParams.get('unauthorized');

    if (inactive === 'true') {
      setAlertMessage({
        type: 'error',
        message: 'Your account has been deactivated. Please contact your administrator for assistance.',
      });
    } else if (expired === 'true') {
      setAlertMessage({
        type: 'warning',
        message: 'Your session has expired. Please log in again.',
      });
    } else if (unauthorized === 'true') {
      setAlertMessage({
        type: 'warning',
        message: 'You do not have permission to access that page.',
      });
    }
  }, [searchParams]);

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAlertMessage(null);
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || error.message || 'An unexpected error occurred. Please try again.';
      setAlertMessage({
        type: 'error',
        message: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      {alertMessage && (
        <Alert className={`mb-4 ${alertMessage.type === 'error'
            ? 'border-destructive bg-destructive/10'
            : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
          }`}>
          {alertMessage.type === 'error' ? (
            <XCircle className="h-4 w-4 text-destructive" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          )}
          <AlertDescription className={
            alertMessage.type === 'error'
              ? 'text-destructive'
              : 'text-yellow-800 dark:text-yellow-200'
          }>
            {alertMessage.message}
          </AlertDescription>
        </Alert>
      )}
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthCard>
  );
}
