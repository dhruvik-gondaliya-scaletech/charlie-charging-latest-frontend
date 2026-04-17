import { ApiDocsContainer } from '@/features/api-docs/ApiDocsContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Reference | Scale EV',
  description: 'Comprehensive API documentation for the Scale EV charging management platform.',
};

export default function ApiDocsPage() {
  return <ApiDocsContainer />;
}
