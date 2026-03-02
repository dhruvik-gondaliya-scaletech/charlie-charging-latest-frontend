'use client';

import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/post/useAuthMutations';
import { RegisterFormData } from '@/lib/validations/auth.schema';
import { AuthCard } from '../components/AuthCard';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterContainer() {
  const router = useRouter();
  const registerMutation = useRegister();

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <AuthCard
      title="Create an account"
      description="Enter your information to get started"
    >
      <RegisterForm onSubmit={handleSubmit} isLoading={registerMutation.isPending} />
    </AuthCard>
  );
}
