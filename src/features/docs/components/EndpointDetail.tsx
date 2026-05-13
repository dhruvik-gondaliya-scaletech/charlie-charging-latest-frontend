'use strict';

import React from 'react';
import { PortalEndpoint } from '../data/portal-data';
import { Lock, Unlock, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

interface EndpointDetailProps {
  endpoint: PortalEndpoint;
}

export function EndpointDetail({ endpoint }: EndpointDetailProps) {
  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'POST':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'PATCH':
      case 'PUT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const renderParametersTable = (
    fields: Record<string, { type: string; required: boolean; description: string; defaultValue?: any }>,
    title: string
  ) => {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-200 border-b border-gray-800 pb-2 tracking-wide flex items-center gap-2">
          <span>{title}</span>
          <span className="text-[10px] font-mono bg-gray-900 text-gray-400 px-2 py-0.5 rounded-full border border-gray-800">
            {Object.keys(fields).length} keys
          </span>
        </h3>
        <div className="border border-gray-800/80 rounded-xl overflow-hidden bg-gray-950/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/60 border-b border-gray-800 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-2.5 px-4 font-mono">Field Parameter</th>
                <th className="py-2.5 px-4 font-mono">Type</th>
                <th className="py-2.5 px-4 font-mono">Attributes</th>
                <th className="py-2.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-xs text-gray-300">
              {Object.entries(fields).map(([key, item]) => (
                <tr key={key} className="hover:bg-gray-900/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gray-200 align-top">
                    {key}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-emerald-400 align-top">
                    {item.type}
                  </td>
                  <td className="py-3 px-4 align-top">
                    <div className="flex flex-wrap gap-1">
                      {item.required ? (
                        <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20 font-semibold uppercase">
                          Required
                        </span>
                      ) : (
                        <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700 uppercase">
                          Optional
                        </span>
                      )}
                      {item.defaultValue !== undefined && (
                        <span className="text-[9px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20 font-mono">
                          default: {String(item.defaultValue)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 align-top leading-relaxed">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 select-none">
      {/* Endpoint Details Masthead Header */}
      <div className="space-y-3 pb-6 border-b border-gray-800/80">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`font-mono text-xs px-2.5 py-1 rounded-md border font-bold tracking-tight shadow-sm ${getMethodBadgeClass(
              endpoint.method
            )}`}
          >
            {endpoint.method}
          </span>
          <div className="flex items-center gap-2 bg-gray-950 px-3 py-1 rounded-md border border-gray-800 font-mono text-xs text-gray-300">
            <span className="text-gray-600 select-none">base</span>
            <span className="text-emerald-400">{endpoint.path}</span>
          </div>

          {endpoint.requiresAuth ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md ml-auto font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Requires Authentication</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-md ml-auto font-medium">
              <Unlock className="w-3.5 h-3.5" />
              <span>Public Endpoint</span>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">{endpoint.description}</h1>
      </div>

      {/* Endpoint Schema Parameter Payload Specifications */}
      <div className="space-y-6">
        {endpoint.params && renderParametersTable(endpoint.params, 'Path Parameters')}
        {endpoint.query && renderParametersTable(endpoint.query, 'Query Parameters')}
        {endpoint.body && renderParametersTable(endpoint.body, 'Request Body Schema')}

        {!endpoint.params && !endpoint.query && !endpoint.body && (
          <div className="border border-gray-800/60 rounded-xl p-6 bg-gray-950/40 text-center text-gray-500 text-xs flex flex-col items-center gap-2">
            <Layers className="w-8 h-8 text-gray-800" />
            <p>This endpoint endpoint interface processes incoming frames without expecting URL query parameters or custom request body payload envelopes.</p>
          </div>
        )}
      </div>

      {/* Output Response Mapping Structure */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-200 border-b border-gray-800 pb-2 tracking-wide flex items-center gap-2">
          <span>Expected Responses</span>
        </h3>
        <div className="space-y-4">
          {endpoint.responses.map((resp, index) => {
            const isSuccess = resp.status >= 200 && resp.status < 300;
            return (
              <div
                key={index}
                className="border border-gray-800 bg-gray-950 rounded-xl overflow-hidden shadow-md"
              >
                {/* Response Code Section Header */}
                <div className="bg-gray-900/60 px-4 py-2.5 border-b border-gray-800 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isSuccess
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {resp.status}
                    </span>
                    <span className="text-gray-300 font-sans font-medium text-xs">
                      {resp.description}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">application/json</span>
                </div>

                {/* Example Object Response preview block */}
                <div className="p-4 bg-gray-950 font-mono text-xs overflow-x-auto">
                  <pre className={`${isSuccess ? 'text-emerald-400/90' : 'text-rose-400'} leading-relaxed`}>
                    {JSON.stringify(resp.data, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
