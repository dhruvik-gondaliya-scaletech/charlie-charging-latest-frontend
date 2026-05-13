import React, { use } from 'react';
import { DocsPortalWrapper } from '../../../../features/docs/DocsPortalWrapper';

interface DynamicDocsPageProps {
  params: Promise<{
    category: string;
    endpoint: string;
  }>;
}

export default function DynamicEndpointDocsPage({ params }: DynamicDocsPageProps) {
  // Gracefully unwrap routing parameters promise natively compatible with modern App Router signatures
  const resolvedParams = use(params);

  return (
    <DocsPortalWrapper
      categorySlug={resolvedParams.category}
      endpointId={resolvedParams.endpoint}
    />
  );
}
