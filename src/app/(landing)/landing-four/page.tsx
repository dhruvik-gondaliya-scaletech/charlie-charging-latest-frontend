import React from 'react';
import { Metadata } from 'next';
import LandingFourContainer from '@/features/landing-four/container/LandingFourContainer';

export const metadata: Metadata = {
  title: 'Scale EV | Premium OCPP 2.0.1 Charging Software',
  description: 'Unify OCPP charger communication, dynamic load management, white-label driver apps, and billing gateways on a single API-first enterprise CSMS.',
  openGraph: {
    title: 'Scale EV | Enterprise EV Charger Software',
    description: 'Hardware-agnostic charging infrastructure management platform supporting OCPP 1.6-J & 2.0.1, custom billing tariffs, and global OCPI roaming gateway.',
    type: 'website',
  },
};

export default function LandingFourPage() {
  return <LandingFourContainer />;
}
