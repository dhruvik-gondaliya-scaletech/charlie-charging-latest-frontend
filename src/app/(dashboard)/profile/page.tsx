import { UserProfileContainer } from "@/features/users/containers/UserProfileContainer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your personal identity, security settings, and platform preferences.',
};

export default function ProfilePage() {
  return <UserProfileContainer />;
}
