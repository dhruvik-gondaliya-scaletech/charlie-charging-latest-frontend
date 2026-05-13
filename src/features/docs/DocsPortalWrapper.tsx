'use client';

import React from 'react';
import Link from 'next/link';
import { getPortalEndpoint, getGuideSection } from './data/portal-data';
import { EndpointDetail } from './components/EndpointDetail';
import { RequestCodePanel } from './components/RequestCodePanel';
import { LivePlayground } from './components/LivePlayground';
import { CredentialsCard } from './components/CredentialsCard';
import { FileQuestion, ArrowLeft, Terminal } from 'lucide-react';
import { API_CONFIG } from '@/constants/constants';

interface DocsPortalWrapperProps {
  categorySlug: string;
  endpointId: string;
}

export function DocsPortalWrapper({ categorySlug, endpointId }: DocsPortalWrapperProps) {
  const isGuide = categorySlug === 'guides';
  const guide = isGuide ? getGuideSection(endpointId) : undefined;
  const endpoint = !isGuide ? getPortalEndpoint(categorySlug, endpointId) : undefined;

  // Render Premium 404 Missing Document Layout
  if (!guide && !endpoint) {
    return (
      <main className="flex-1 flex items-center justify-center p-6 min-w-0">
        <div className="max-w-md w-full border border-gray-800 bg-gray-900/40 rounded-2xl p-8 text-center space-y-4 backdrop-blur-sm shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center mx-auto border border-rose-500/20">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-200">Document Not Discovered</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              The requested URL route parameter mapped to <span className="text-amber-400 font-mono">/{categorySlug}/{endpointId}</span> does not associate with any configured Partner API specification layout schema.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/docs/guides/getting-started"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium transition-colors border border-gray-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Getting Started Guide</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-w-0 lg:h-full lg:overflow-hidden">
      {/* Primary Dynamic Content Frame Render Layer (Middle Content) */}
      <main className="flex-1 lg:h-full lg:overflow-y-auto p-4 lg:p-8 space-y-8 max-w-5xl mx-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isGuide && guide ? (
          /* Render Content Documentation Block */
          <div className="max-w-4xl space-y-6">
            {/* Guide Content Header Banner */}
            <div className="border-b border-gray-800 pb-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                Integration Reference
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{guide.title}</h1>
            </div>

            {/* Custom high-fidelity styled blocks for manual layout formatting */}
            <div className="prose prose-invert prose-emerald max-w-none text-gray-300 text-sm leading-relaxed space-y-4">
              {guide.id === 'getting-started' ? (
                <div className="space-y-6">
                  <p className="text-base text-gray-400">
                    The Partner API allows trusted external third-party partners and tenant integrations to programmatically provision infrastructure, manage locations and hardware stations, control charging sessions (remote start/stop), configure pricing tariffs, and fetch real-time analytics.
                  </p>

                  <div className="border border-gray-800 bg-gray-900/40 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Target API Core Targets</h4>
                    <div className="flex items-center justify-between text-xs font-mono bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                      <span className="text-gray-500">Dynamic Base URL:</span>
                      <span className="text-sky-400">{process.env.NEXT_PUBLIC_API_BASE_URL}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-200">Standard Integration Sequence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { step: '1', title: 'Authentication', desc: 'Acquire JWT keys with client authorization logic.' },
                        { step: '2', title: 'Pricing Structure', desc: 'Formulate calculation tariff definitions.' },
                        { step: '3', title: 'Physical Site', desc: 'Provision physical destination markers.' },
                        { step: '4', title: 'Hardware Onboarding', desc: 'Bind equipment nodes assigned to sites.' },
                        { step: '5', title: 'Remote Control', desc: 'Execute real-time OT remote charging sessions.' }
                      ].map(item => (
                        <div key={item.step} className="border border-gray-800 bg-gray-950 p-3 rounded-xl flex gap-3 items-start">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                            {item.step}
                          </span>
                          <div>
                            <h5 className="text-xs font-bold text-gray-200">{item.title}</h5>
                            <p className="text-[11px] text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-200">Universal JSON Envelope Format</h3>
                    <p className="text-xs text-gray-500">Standardized REST success payloads enforce schema parameters consistency:</p>
                    <pre className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
                      {`{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-05-13T12:00:00Z"
}`}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <p className="text-base text-gray-400 leading-relaxed">
                    Scale EV utilizes an OAuth2 Client Credentials pattern for service-to-service access. Trusted tenant clients request short-lived JSON Web Tokens (JWT) using unique Client IDs and API Secrets. Securely disclose your assigned sandbox tenant identity below to instantly provision testing authorizations.
                  </p>

                  {/* High-fidelity interactive credentials manager component */}
                  <div className="my-6">
                    <CredentialsCard />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-800">
                    <h3 className="text-lg font-bold text-gray-200">Manual API Handshake Protocol</h3>
                    <div className="border border-gray-800 bg-gray-950 rounded-xl overflow-hidden">
                      <div className="bg-gray-900/60 px-4 py-2 border-b border-gray-800 text-xs font-mono text-gray-400 flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>1. Post Client Secrets Payload Handshake</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto">
                        {`curl -X POST "${API_CONFIG.baseUrl}/partner/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientId": "your_tenant_client_id",
    "clientSecret": "your_confidential_secret"
  }'`}
                      </pre>
                    </div>

                    <div className="border border-gray-800 bg-gray-950 rounded-xl overflow-hidden">
                      <div className="bg-gray-900/60 px-4 py-2 border-b border-gray-800 text-xs font-mono text-gray-400 flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-sky-400" />
                        <span>2. Authorize Resource Queries via Header</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-sky-400 overflow-x-auto">
                        {`Authorization: Bearer <your_access_token>`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : endpoint ? (
          /* Main Center Specification Stream Pane */
          <div className="space-y-8">
            <EndpointDetail endpoint={endpoint} />

            <div className="pt-4 border-t border-gray-800/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 block">
                Code Snippets Generator
              </h3>
              <RequestCodePanel endpoint={endpoint} />
            </div>
          </div>
        ) : null}
      </main>

      {/* Right Sticky / Fixed Sandbox Column */}
      {endpoint && (
        <aside className="w-full lg:w-[420px] xl:w-[460px] lg:h-full shrink-0 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-950 flex flex-col overflow-hidden">
          <LivePlayground endpoint={endpoint} />
        </aside>
      )}
    </div>
  );
}
