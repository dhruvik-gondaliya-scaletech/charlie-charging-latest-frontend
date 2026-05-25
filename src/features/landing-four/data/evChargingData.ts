import {
  Zap,
  CreditCard,
  Activity,
  Smartphone,
  Truck,
  Globe,
  ShieldCheck,
  Cpu,
  Layers,
  Coins,
  Calendar,
  HeartPulse
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  features: string[];
}

export interface FeatureItem {
  title: string;
  description: string;
  iconName: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  badge: string;
}

export interface StatItem {
  value: string;
  label: string;
  iconName: string;
}

export interface IndustryItem {
  title: string;
  description: string;
  image: string;
  badge: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface BlogItem {
  title: string;
  category: string;
  readTime: string;
  description: string;
  image: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const navItems: NavItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'Solution', href: '#solutions' },
  { name: 'Co-Brand', href: '#workflow' },
  { name: 'Global', href: '#global' },
  { name: 'Blog', href: '#blog' },
  { name: 'Team', href: '#partners' },
  { name: 'FAQs', href: '#faq' },
  { name: 'Install', href: '#cta' },
];

export const trustedBrands = [
  { name: 'Shell Recharge', logoText: 'SHELL' },
  { name: 'EVgo', logoText: 'EVgo' },
  { name: 'ABB', logoText: 'ABB' },
  { name: 'Siemens', logoText: 'SIEMENS' },
  { name: 'ChargePoint', logoText: 'CHARGEPOINT' },
  { name: 'Tesla Supercharger', logoText: 'TESLA' },
];

export const solutionsData: Solution[] = [
  {
    id: 'white-label',
    title: 'White-Label Customization',
    description: 'Brand our software with your logos, colors, and domain name to offer a cohesive experience. We handle the infrastructure while you build customer loyalty.',
    iconName: 'Smartphone',
    badge: 'Custom Branding',
    features: ['Custom Logo & Styling', 'Dedicated Domain Name', 'White-labeled Mobile Apps'],
  },
  {
    id: 'ocpp-gateway',
    title: 'OCPP Gateway',
    description: 'Hardware-agnostic management supporting OCPP 1.6-J & 2.0.1. Real-time diagnostics, remote firmware updates, and live transaction socket streams.',
    iconName: 'Zap',
    badge: 'OCPP 2.0.1 Ready',
    features: ['Live Heartbeats', 'Remote Start/Stop', 'Diagnostics Logs'],
  },
  {
    id: 'payment-gateway',
    title: 'Payment Gateway',
    description: 'Connect Stripe, customize billing schedules for public vs. private networks, and calculate real-time session costs.',
    iconName: 'CreditCard',
    badge: 'Automated Billing',
    features: ['Stripe Integration', 'Idle Fee Management', 'Dynamic Tariff Engine'],
  },
  {
    id: 'apis-integrations',
    title: 'APIs & Integrations',
    description: 'Power your existing CRM, ERP, or billing software with our extensive REST APIs and webhooks catalog.',
    iconName: 'Layers',
    badge: 'API-First Architecture',
    features: ['Webhooks & Event Streams', 'REST API Client', 'Third-Party Syncing'],
  },
  {
    id: 'ev-charging-app',
    title: 'EV Charging App',
    description: 'Provide drivers with an intuitive mobile app to locate chargers, check availability, monitor sessions, and complete transactions.',
    iconName: 'Smartphone',
    badge: 'Driver App Included',
    features: ['Ad-hoc QR Charging', 'Apple & Google Pay', 'Interactive Map Lookup'],
  },
  {
    id: 'energy-load-balancing',
    title: 'Energy & Load Balancing',
    description: 'Adjust charging rates in real-time based on grid load, vehicle battery state, and energy pricing.',
    iconName: 'Activity',
    badge: 'Smart Energy',
    features: ['Dynamic Balancing', 'Peak Shaving Integration', 'Substation Protection'],
  },
];

export const featuresData: FeatureItem[] = [
  {
    title: 'Smart Charging Protocols',
    description: 'Adjust charging rates in real-time based on grid load, vehicle battery state, and energy pricing.',
    iconName: 'Cpu',
  },
  {
    title: 'Driver Management System',
    description: 'Manage user accounts, RFID cards, billing history, and customized pricing tiers for different customer segments.',
    iconName: 'Smartphone',
  },
  {
    title: 'Multi-tenant Architecture',
    description: 'Easily isolate and manage different clients, partners, or subsidiaries within a single dashboard.',
    iconName: 'Layers',
  },
  {
    title: 'Tariff Builder Engine',
    description: 'Create dynamic pricing models with support for energy, time, session fees, and idle penalties.',
    iconName: 'Coins',
  },
  {
    title: 'Real-time Diagnostics',
    description: 'Monitor station health, track active sessions, and troubleshoot issues remotely with live logs.',
    iconName: 'HeartPulse',
  },
  {
    title: 'Automated Billing & Payouts',
    description: 'Generate monthly invoices, track revenue streams, and automate payouts to site hosts.',
    iconName: 'Calendar',
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    step: '01',
    title: 'Connect Charger',
    description: 'Point your charger hardware to our secure WebSocket endpoint. Works with OCPP 1.6-J and 2.0.1 protocols with zero configuration needed.',
    badge: '01 CONNECT',
  },
  {
    step: '02',
    title: 'Set Up Tariffs',
    description: 'Group connectors into locations, specify pricing structures (per kWh, per min, connection fees), and invite site managers with custom permissions.',
    badge: '02 CONFIGURE',
  },
  {
    step: '03',
    title: 'Brand App',
    description: 'Provide drivers with custom iOS, Android, and web portals branded with your logo. Enable interactive maps, RFID tokens, and local payment methods.',
    badge: '03 BRAND',
  },
];

export const statsData: StatItem[] = [
  { value: '99.99%', label: 'Uptime SLA', iconName: 'ShieldCheck' },
  { value: '25M+', label: 'Monthly Charging Sessions', iconName: 'Activity' },
  { value: '150k+', label: 'Connected Chargers', iconName: 'Zap' },
  { value: '120+', label: 'Countries Supported', iconName: 'Globe' },
];

export const industriesData: IndustryItem[] = [
  {
    title: 'Commercial Fleets',
    description: 'Power logistics networks, commercial delivery fleets, and employee vehicles with smart load allocation and state-of-charge scheduling.',
    image: '/assets/ev_fleet.png',
    badge: 'Fleets',
  },
  {
    title: 'Energy & Utility Companies',
    description: 'Integrate charging networks with the grid, support demand response programs, and manage substation load profiles in real-time.',
    image: '/assets/ev_energy_grid.png',
    badge: 'Utility Grid',
  },
  {
    title: 'Commercial Real Estate',
    description: 'Attract tenants, customers, and visitors by offering premium EV charging amenities with self-serve billing and public access.',
    image: '/assets/ev_multi_family.png',
    badge: 'Real Estate',
  },
  {
    title: 'EV Car Builders (OEMs)',
    description: 'Provide car owners with a seamless charging experience using white-labeled mobile apps, RFID cards, and embedded dashboard controls.',
    image: '/assets/ev_car_builders.png',
    badge: 'Automotive OEMs',
  },
  {
    title: 'Charge Point Installers & Operators',
    description: 'Commission, test, and manage charging networks for clients using a multi-tenant partner dashboard and diagnostic tools.',
    image: '/assets/ev_installer.png',
    badge: 'CPOs & Installers',
  },
  {
    title: 'Charging Network Owners',
    description: 'Build, manage, and scale a profitable public charging network with a customizable brand and robust payment collection.',
    image: '/assets/ev_network_owner.png',
    badge: 'Public Networks',
  },
];

export const testimonialsData: Testimonial[] = [
  {
    name: 'Alex',
    role: 'Founder & CEO',
    company: 'Charli Charging',
    quote: 'ScaleEV has completely transformed our fleet operations. The smart charging and scheduling features have cut our energy costs by 30% while ensuring our delivery vehicles are always ready to go.',
    avatar: '/assets/alex.png',
    rating: 5,
  },
  {
    name: 'Marcelo',
    role: 'CTO',
    company: 'Charli Charging',
    quote: 'We deployed ScaleEV across all our commercial properties in less than a month. The white-label driver app and seamless payment integration have significantly enhanced our tenant satisfaction.',
    avatar: '/assets/marcelo.jpg',
    rating: 5,
  },
];

export const blogsData: BlogItem[] = [
  {
    title: 'EV Charging Hardware Handshake Guide (OCPP Protocol)',
    category: 'OCPP 2.0.1',
    readTime: '5 min read',
    description: 'A detailed guide on how to establish connection, handle boot notifications, and debug status messages.',
    image: '/assets/ev_hero_dashboard.png',
    date: 'May 20, 2026',
  },
  {
    title: 'Smart Load Control & DLM (Dynamic Load Management)',
    category: 'Smart Charging',
    readTime: '7 min read',
    description: 'Learn how to allocate power dynamically across chargers to optimize site capacity and reduce energy costs.',
    image: '/assets/ev_fleet.png',
    date: 'May 15, 2026',
  },
  {
    title: 'ScaleEV Wins "Best Brand & Innovative EV Charging Software Award 2026"',
    category: 'Business Guide',
    readTime: '3 min read',
    description: 'We are proud to share that ScaleEV has been recognized for its innovation and excellence in the EV charging software space.',
    image: '/assets/ev_network_owner.png',
    date: 'May 10, 2026',
  },
];

export const faqData: FAQItem[] = [
  {
    question: 'Can I run the software for different tariff models?',
    answer: 'Yes, you can configure energy-based, time-based, session-based, and idle-time tariffs.',
  },
  {
    question: 'What kind of hardware is our platform compatible with?',
    answer: 'ScaleEV is hardware-agnostic and compatible with any charger that supports OCPP 1.6-J or 2.0.1.',
  },
  {
    question: 'How long does it take to connect and launch our first station?',
    answer: 'You can connect an OCPP-compliant charger and launch the software in less than 5 minutes.',
  },
  {
    question: 'What is an active station on the platform?',
    answer: 'An active station is any charge point connected to our CSMS that can initiate charging sessions and transmit data.',
  },
  {
    question: 'What support do you offer for white-label charging networks?',
    answer: 'We offer complete branding support, custom app store submissions, and dedicated hosting for your white-labeled network.',
  },
];
