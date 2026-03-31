import { RegisterContainer } from '@/features/auth/containers/RegisterContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join Scale EV today and start managing your charging infrastructure with ease.',
};

export default function RegisterPage() {
  return <RegisterContainer />;
}
