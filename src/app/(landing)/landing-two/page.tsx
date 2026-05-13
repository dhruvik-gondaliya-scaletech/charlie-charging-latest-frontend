import LandingContainer from '@/features/landing-two/LandingContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scale EV | Enterprise EV Charging Infrastructure Platform',
  description: 'The operating system for the future of EV charging infrastructure. Own, manage, monitor, and scale EV charging operations with an intelligent OCPP-powered platform.',
};

export default function LandingTwoPage() {
  return <LandingContainer />;
}
