import React from 'react';
import { LandingFiveContainer } from '@/features/landing-five/container/LandingFiveContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ScaleEV - Enterprise EV Charging Network Management Software',
  description: 'Hardware-agnostic OCPP management software built for global fleet operators, commercial properties, and public charging networks. Fully OCPP 2.0.1 compliant.',
  keywords: 'EV charging software, OCPP 2.0.1, EV fleet management, white-label EV charging, CSMS platform',
};

export default function LandingFivePage() {
  return <LandingFiveContainer />;
}
