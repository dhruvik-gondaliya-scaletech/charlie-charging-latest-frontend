'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginFormData } from '@/lib/validations/auth.schema';
import { LoginForm } from '../components/LoginForm';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
      let message = error.response?.data?.message || error.message || 'An unexpected error occurred. Please try again.';

      if (error.response?.status === 401) {
        message = 'Invalid email or password. Please check your credentials and try again.';
      }

      setAlertMessage({
        type: 'error',
        message: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Welcome back</h1>
        <p className="text-muted-foreground font-medium">Enter your credentials to access your dashboard.</p>
      </div>

      {alertMessage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8"
        >
          <Alert className={`${alertMessage.type === 'error'
            ? 'border-destructive/50 bg-destructive/5'
            : 'border-yellow-500/50 bg-yellow-500/5'
            } rounded-2xl`}>
            {alertMessage.type === 'error' ? (
              <XCircle className="h-4 w-4 text-destructive" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <AlertDescription className={
              alertMessage.type === 'error'
                ? 'text-destructive font-medium'
                : 'text-yellow-600 dark:text-yellow-400 font-medium'
            }>
              {alertMessage.message}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-[2rem] shadow-2xl shadow-primary/5">
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </>
  );
}
