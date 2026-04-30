'use client';

import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/post/useAuthMutations';
import { RegisterFormData } from '@/lib/validations/auth.schema';
import { RegisterForm } from '../components/RegisterForm';
import Link from 'next/link';

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
    <>
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Create an account</h1>
        <p className="text-muted-foreground font-medium">Enter your information to get started.</p>
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-[2rem] shadow-2xl shadow-primary/5">
        <RegisterForm onSubmit={handleSubmit} isLoading={registerMutation.isPending} />
      </div>

      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="text-primary hover:underline font-bold">
          Sign in
        </Link>
      </div>
    </>
  );
}
