import React from 'react';
import { Metadata } from 'next';
import { LandingThreeContainer } from '@/features/landing-three/container/LandingThreeContainer';

export const metadata: Metadata = {
    title: 'Scale EV | Seamless Point-to-Point EV Charging Network Platform',
    description: 'Launch your own fully-branded EV charging network with Scale EV. Point-to-point, zero complexity, OCPP compliant, and hardware agnostic management.',
    openGraph: {
        title: 'Scale EV | Point-to-Point EV Charging Network Platform',
        description: 'Launch your own fully-branded EV charging network with Scale EV. Point-to-point, zero complexity, OCPP compliant, and hardware agnostic management.',
        type: 'website',
    },
};

export default function LandingThreePage() {
    return <LandingThreeContainer />;
}
