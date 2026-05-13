import React from 'react';
import { DocsPortalWrapper } from '../../features/docs/DocsPortalWrapper';

export default function DocsIndexPage() {
  // Directly render the base default route template layout without forcing browser redirect latency
  return <DocsPortalWrapper categorySlug="guides" endpointId="getting-started" />;
}
