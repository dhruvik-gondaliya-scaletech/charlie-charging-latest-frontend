import NotFoundClient from './NotFoundClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested page could not be found on the Scale EV platform.',
};

export default function NotFound() {
  return <NotFoundClient />;
}
