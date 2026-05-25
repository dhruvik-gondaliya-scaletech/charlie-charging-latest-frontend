import {
  Zap,
  CreditCard,
  Activity,
  Smartphone,
  Globe,
  ShieldCheck,
  Cpu,
  Layers,
  Coins,
  Calendar,
  HeartPulse,
  Wifi,
  BarChart3,
  Settings,
  Users,
  MapPin,
  Clock,
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
  prefix?: string;
  suffix?: string;
  numericValue: number;
  decimals?: number;
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

export interface TechStackItem {
  name: string;
  description: string;
}

export const navItems: NavItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'Solution', href: '#solutions' },
  { name: 'Features', href: '#features' },
  { name: 'Workflow', href: '#workflow' },
  { name: 'Global', href: '#global' },
  { name: 'Blog', href: '#blog' },
  { name: 'FAQs', href: '#faq' },
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
    id: 'ev-monitoring',
    title: 'EV Monitoring',
    description: 'Real-time monitoring of all your charging stations with live status updates, diagnostics, and health metrics in a single unified dashboard.',
    iconName: 'Activity',
    badge: 'Real-time',
    features: ['Live Station Status', 'Health Diagnostics', 'Alert Notifications'],
  },
  {
    id: 'payment-integration',
    title: 'Payment Integration',
    description: 'Seamless payment processing with support for multiple gateways, automated billing, and real-time transaction tracking across your network.',
    iconName: 'CreditCard',
    badge: 'Automated',
    features: ['Stripe Integration', 'Multi-Currency', 'Auto Invoicing'],
  },
  {
    id: 'smart-scheduling',
    title: 'Smart Scheduling',
    description: 'Intelligent charging schedules that optimize energy usage, reduce costs, and ensure vehicles are charged when needed most.',
    iconName: 'Clock',
    badge: 'AI-Powered',
    features: ['Peak Optimization', 'Fleet Scheduling', 'Off-Peak Charging'],
  },
  {
    id: 'white-label',
    title: 'White Label Solution',
    description: 'Fully customizable branding with your logo, colors, and domain. Launch your own branded charging network in days, not months.',
    iconName: 'Smartphone',
    badge: 'Custom Branding',
    features: ['Custom Mobile Apps', 'Branded Dashboard', 'Custom Domain'],
  },
  {
    id: 'fleet-management',
    title: 'Fleet Management',
    description: 'Comprehensive fleet electrification tools for managing vehicle charging, scheduling, and energy optimization across your entire fleet.',
    iconName: 'Users',
    badge: 'Enterprise',
    features: ['Vehicle Tracking', 'Route Planning', 'Energy Reports'],
  },
  {
    id: 'energy-analytics',
    title: 'Energy Analytics',
    description: 'Advanced analytics dashboard with detailed insights on energy consumption, peak usage patterns, and cost optimization opportunities.',
    iconName: 'BarChart3',
    badge: 'Insights',
    features: ['Usage Reports', 'Cost Analysis', 'Trend Forecasting'],
  },
];

export const featuresData: FeatureItem[] = [
  {
    title: 'Smart Charging Protocols',
    description: 'Adjust charging rates in real-time based on grid load, vehicle battery state, and energy pricing to maximize efficiency.',
    iconName: 'Cpu',
  },
  {
    title: 'Driver Management System',
    description: 'Manage user accounts, RFID cards, billing history, and customized pricing tiers for different customer segments.',
    iconName: 'Smartphone',
  },
  {
    title: 'Multi-tenant Architecture',
    description: 'Easily isolate and manage different clients, partners, or subsidiaries within a single powerful dashboard.',
    iconName: 'Layers',
  },
  {
    title: 'Tariff Builder Engine',
    description: 'Create dynamic pricing models with support for energy, time, session fees, and idle penalties.',
    iconName: 'Coins',
  },
  {
    title: 'Real-time Diagnostics',
    description: 'Monitor station health, track active sessions, and troubleshoot issues remotely with live diagnostic logs.',
    iconName: 'HeartPulse',
  },
  {
    title: 'Automated Billing & Payouts',
    description: 'Generate monthly invoices, track revenue streams, and automate payouts to site hosts and partners.',
    iconName: 'Calendar',
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    step: '01',
    title: 'Connect Charger',
    description: 'Point your charger hardware to our secure WebSocket endpoint. Works with OCPP 1.6-J and 2.0.1 protocols with zero configuration needed.',
    badge: 'CONNECT',
  },
  {
    step: '02',
    title: 'Set Up Tariffs',
    description: 'Group connectors into locations, specify pricing structures (per kWh, per min, connection fees), and invite site managers with custom permissions.',
    badge: 'CONFIGURE',
  },
  {
    step: '03',
    title: 'Brand & Launch',
    description: 'Provide drivers with custom iOS, Android, and web portals branded with your logo. Enable interactive maps, RFID tokens, and local payment methods.',
    badge: 'LAUNCH',
  },
];

export const statsData: StatItem[] = [
  { value: '600+', label: 'Clients Worldwide', prefix: '', suffix: '+', numericValue: 600 },
  { value: '$200+', label: 'Yearly Savings for Clients', prefix: '$', suffix: '+', numericValue: 200 },
  { value: '80,000+', label: 'Chargers Connected', prefix: '', suffix: '+', numericValue: 80000 },
  { value: '100,000+', label: 'Happy EV Drivers', prefix: '', suffix: '+', numericValue: 100000 },
];

export const industriesData: IndustryItem[] = [
  {
    title: 'Commercial Fleets',
    description: 'Power logistics networks, commercial delivery fleets, and employee vehicles with smart load allocation.',
    image: '/assets/ev_fleet.png',
    badge: 'Fleets',
  },
  {
    title: 'Energy & Utility Companies',
    description: 'Integrate charging networks with the grid, support demand response programs, and manage substation load.',
    image: '/assets/ev_energy_grid.png',
    badge: 'Utility Grid',
  },
  {
    title: 'Commercial Real Estate',
    description: 'Attract tenants and visitors by offering premium EV charging amenities with self-serve billing.',
    image: '/assets/ev_multi_family.png',
    badge: 'Real Estate',
  },
  {
    title: 'EV Car Builders (OEMs)',
    description: 'Provide car owners with a seamless charging experience using white-labeled mobile apps and RFID cards.',
    image: '/assets/ev_car_builders.png',
    badge: 'Automotive OEMs',
  },
  {
    title: 'Charge Point Operators',
    description: 'Commission, test, and manage charging networks for clients using multi-tenant partner dashboards.',
    image: '/assets/ev_installer.png',
    badge: 'CPOs & Installers',
  },
  {
    title: 'Network Owners',
    description: 'Build, manage, and scale a profitable public charging network with customizable branding and billing.',
    image: '/assets/ev_network_owner.png',
    badge: 'Public Networks',
  },
];

export const testimonialsData: Testimonial[] = [
  {
    name: 'Sarah Jenkins',
    role: 'VP of Fleet Logistics',
    company: 'VoltTransit Networks',
    quote: 'ScaleEV has completely transformed our fleet operations. The smart charging and scheduling features have cut our energy costs by 30% while ensuring our delivery vehicles are always ready to go.',
    avatar: '/assets/marcelo.jpg',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Director of Asset Management',
    company: 'Luminate Properties',
    quote: 'We deployed ScaleEV across all our commercial properties in less than a month. The white-label driver app and seamless payment integration have significantly enhanced our tenant satisfaction.',
    avatar: '/assets/alex.png',
    rating: 5,
  },
  {
    name: 'Elena Rostova',
    role: 'Smart Grid Project Manager',
    company: 'Aether Utilities',
    quote: "ScaleEV's dynamic load balancing has allowed us to connect twice as many chargers without upgrading our substation infrastructure. A game-changer for our utility network.",
    avatar: '/assets/marcelo.jpg',
    rating: 5,
  },
];

export const blogsData: BlogItem[] = [
  {
    title: 'Take a look at our latest updates and industry insights',
    category: 'Industry',
    readTime: '5 min read',
    description: 'Stay up-to-date with the latest developments in EV charging technology and infrastructure management.',
    image: '/assets/ev_hero_dashboard.png',
    date: 'May 20, 2026',
  },
  {
    title: 'New Technology Features for Enhanced Charging Experience',
    category: 'Technology',
    readTime: '7 min read',
    description: 'Discover the cutting-edge features that make ScaleEV the preferred choice for charging operators worldwide.',
    image: '/assets/ev_fleet.png',
    date: 'May 15, 2026',
  },
  {
    title: 'Scaling EV Infrastructure for Growing Networks',
    category: 'Business Guide',
    readTime: '3 min read',
    description: 'Learn best practices for scaling your EV charging network to meet growing demand efficiently.',
    image: '/assets/ev_network_owner.png',
    date: 'May 10, 2026',
  },
];

export const faqData: FAQItem[] = [
  {
    question: 'Can I run the software for different tariff models?',
    answer: 'Yes, you can configure energy-based, time-based, session-based, and idle-time tariffs. Our flexible tariff engine supports complex pricing structures including peak/off-peak rates, membership discounts, and location-based pricing.',
  },
  {
    question: 'What kind of hardware is our platform compatible with?',
    answer: 'ScaleEV is hardware-agnostic and compatible with any charger that supports OCPP 1.6-J or 2.0.1. This includes major brands like ABB, Siemens, Schneider Electric, Tritium, and many more.',
  },
  {
    question: 'How long does it take to connect and launch our first station?',
    answer: 'You can connect an OCPP-compliant charger and launch the software in less than 5 minutes. Our onboarding wizard guides you through the entire setup process step by step.',
  },
  {
    question: 'What is an active station on the platform?',
    answer: 'An active station is any charge point connected to our CSMS that can initiate charging sessions and transmit data. Each station can have multiple connectors managed independently.',
  },
  {
    question: 'What support do you offer for white-label charging networks?',
    answer: 'We offer complete branding support, custom app store submissions, and dedicated hosting for your white-labeled network. Your brand, your customers, our technology.',
  },
];

export const techStackItems: TechStackItem[] = [
  { name: 'New Technology Software', description: 'Built with cutting-edge technology stack for maximum performance and reliability.' },
  { name: 'Custom Software', description: 'Tailored solutions designed to meet your specific business requirements and workflows.' },
];
