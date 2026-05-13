import React from 'react';
import { Metadata } from 'next';
import { LandingOneContainer } from '@/features/landing-one/container/LandingOneContainer';

export const metadata: Metadata = {
  title: 'Scale EV | Enterprise EV Charging Infrastructure Management Platform',
  description: 'Unify OCPP charger communication, transaction routing, driver white-label applications, and smart dynamic load balancing inside an advanced futuristic viewport.',
  openGraph: {
    title: 'Scale EV | Total Operational Control',
    description: 'Eliminate operational blind spots. Native bi-directional OCPP 1.6J and 2.0.1 management platform powering scalable fleets and global CPOs.',
    type: 'website',
  },
};

export default function LandingOnePage() {
  return <LandingOneContainer />;
}
