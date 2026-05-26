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
  { name: 'Testimonials', href: '#testimonials' },
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
  { name: 'Collectron Energy', image: '/assets/collectron_energy.png' },
];

export const solutionsData: Solution[] = [
  {
    id: 'white-label',
    title: 'White-Label EV Platform',
    description: 'Launch a fully branded EV charging ecosystem with customizable mobile apps, web dashboards, admin panels, and secure cloud infrastructure. Designed for CPOs, fleet operators, and commercial property owners looking for scalable CPMS solutions.',
    iconName: 'Smartphone',
    badge: 'Custom Branding',
    features: ['Custom Apps & Portals', 'CPO & Fleet Dashboards', 'Scalable CPMS Software'],
  },
  {
    id: 'ocpp-gateway',
    title: 'OCPP Gateway Integration',
    description: 'Connect effortlessly with leading EV charger manufacturers through a hardware-independent, OCPP-compliant platform. Supports both OCPP 1.6 and OCPP 2.0.1, ensuring reliable communication and compatibility with global charging hardware.',
    iconName: 'Zap',
    badge: 'Hardware Agnostic',
    features: ['Supports OCPP 1.6 & 2.0.1', 'Universal Charger Sync', 'Hardware-Independent'],
  },
  {
    id: 'payment-gateway',
    title: 'Smart Payment Gateway',
    description: 'Enable smooth and secure EV charging payments with integrations for popular payment providers and regional gateways. Support platforms like Stripe, Razorpay, and more while receiving payments directly into your business account.',
    iconName: 'CreditCard',
    badge: 'Secure Payments',
    features: ['Stripe & Razorpay Integration', 'Direct Business Payouts', 'Regional Payment Support'],
  },
  {
    id: 'apis-integrations',
    title: 'APIs & Third-Party Integrations',
    description: 'Improve operational flexibility with robust EV charging APIs and seamless integrations. Easily connect charging data with ERP, CRM, billing systems, and other business platforms to create a connected EV charging ecosystem.',
    iconName: 'Layers',
    badge: 'API-First',
    features: ['Robust EV Charging APIs', 'ERP & CRM Connections', 'Connected Tech Ecosystem'],
  },
  {
    id: 'ev-roaming',
    title: 'EV Roaming (OCPI)',
    description: 'Expand your charging network reach with OCPI-based roaming interoperability. Integrate with roaming hubs such as Hubject, Gireve, and ChargeHub to increase charger visibility, enable cross-network access, and generate additional revenue opportunities.',
    iconName: 'Globe',
    badge: 'OCPI Interoperability',
    features: ['Hubject & Gireve Roaming', 'Cross-Network Access', 'Boost Revenue Opportunities'],
  },
  {
    id: 'energy-load-management',
    title: 'Energy & Smart Load Management',
    description: 'Optimize power distribution and charging efficiency with intelligent load balancing powered by advanced automation. Reduce infrastructure costs, avoid unnecessary grid upgrades, and ensure a reliable, scalable, and sustainable EV charging network.',
    iconName: 'Activity',
    badge: 'Power Optimization',
    features: ['Intelligent Load Balancing', 'Prevent Grid Upgrades', 'Sustainable Power Scaling'],
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
    description: 'Provide car owners with a seamless charging experience using white-labeled mobile web apps, RFID cards, and embedded dashboard controls.',
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
  {
    name: 'Mike Becker',
    role: 'Founder & CEO',
    company: 'Collectron Energy',
    quote: "ScaleEV's platform has been a game-changer for our electric fleet management. The real-time monitoring and automated billing systems have streamlined our operations significantly. We've seen a 40% improvement in charging efficiency and our drivers love the intuitive mobile web app.",
    avatar: '/assets/Mike_Becker.png',
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
    question: 'How can I maximize the performance of my EV charging network?',
    answer: 'Use Scale EV’s intelligent load balancing, real-time health monitoring, usage analytics, predictive maintenance, and live diagnostics to maintain high efficiency and reliable performance across your EV charging infrastructure.',
  },
  {
    question: 'What customer and partner management capabilities are available?',
    answer: 'Scale EV provides role-based access control, partner management dashboards, automated reporting, fleet management tools, billing support, RFID management, contract handling, revenue-sharing features, and real-time charging session monitoring.',
  },
  {
    question: 'How does the OCPP protocol improve your EV charging platform?',
    answer: 'Our platform supports the Open Charge Point Protocol (OCPP), enabling seamless compatibility with a broad range of EV charging stations while ensuring smooth communication between chargers and backend systems for enhanced flexibility and operational efficiency.',
  },
  {
    question: 'What is white-label EV charging software?',
    answer: 'White-label EV charging software enables businesses to launch EV charging services under their own brand identity. Scale EV’s customizable platform includes features such as charger management, payment integration, and customer engagement tools through a fully branded experience.',
  },
  {
    question: 'What support do you provide for global EV charging networks?',
    answer: 'Scale EV supports international EV charging operations with multilingual capabilities, OCPI/OICP roaming support (such as Hubject and Gireve), timezone compatibility, and integrations with regional payment gateways for a seamless global charging experience.',
  },
];
