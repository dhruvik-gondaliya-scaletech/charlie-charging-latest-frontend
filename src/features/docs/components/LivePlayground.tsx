'use client';

import React, { useState, useEffect } from 'react';
import { PortalEndpoint } from '../data/portal-data';
import { Play, RefreshCw, CheckCircle2, AlertCircle, Layers, Globe } from 'lucide-react';
import { getStoredDocsToken, getStoredCredentials } from '../hooks/useDocsAuth';
import { API_CONFIG } from '@/constants/constants';

interface LivePlaygroundProps {
  endpoint: PortalEndpoint;
}

export function LivePlayground({ endpoint }: LivePlaygroundProps) {
  const [authToken, setAuthToken] = useState<string>('');
  const [useMockCall, setUseMockCall] = useState<boolean>(true);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<{
    status?: number;
    data?: unknown;
    error?: string;
    duration?: number;
  } | null>(null);

  // Poll local storage to securely auto-hydrate access tokens and credentials generated across portal frames
  useEffect(() => {
    const checkStorage = () => {
      const storedToken = getStoredDocsToken();
      if (storedToken) {
        setAuthToken(prev => prev !== storedToken ? storedToken : prev);
      }

      const creds = getStoredCredentials();
      if (creds?.clientId || creds?.clientSecret) {
        setFormValues(prev => {
          let updated = false;
          const next = { ...prev };
          if (endpoint.body?.['clientId'] && !prev['clientId'] && creds.clientId) {
            next['clientId'] = creds.clientId;
            updated = true;
          }
          if (endpoint.body?.['clientSecret'] && !prev['clientSecret'] && creds.clientSecret) {
            next['clientSecret'] = creds.clientSecret;
            updated = true;
          }
          return updated ? next : prev;
        });
      }
    };
    checkStorage();
    const interval = setInterval(checkStorage, 1500);
    return () => clearInterval(interval);
  }, [endpoint]);

  // Re-initialize default values when active endpoint shifts
  useEffect(() => {
    const defaultVals: Record<string, unknown> = {};
    const creds = getStoredCredentials();

    if (endpoint.body) {
      Object.entries(endpoint.body).forEach(([key, field]) => {
        if (key === 'clientId' && creds?.clientId) {
          defaultVals[key] = creds.clientId;
        } else if (key === 'clientSecret' && creds?.clientSecret) {
          defaultVals[key] = creds.clientSecret;
        } else if (field.defaultValue !== undefined) {
          defaultVals[key] = field.defaultValue;
        }
      });
    }
    if (endpoint.query) {
      Object.entries(endpoint.query).forEach(([key, field]) => {
        if (field.defaultValue !== undefined) {
          defaultVals[key] = field.defaultValue;
        }
      });
    }
    if (endpoint.params) {
      Object.entries(endpoint.params).forEach(([key, field]) => {
        if (field.defaultValue !== undefined) {
          defaultVals[key] = field.defaultValue;
        }
      });
    }
    setFormValues(defaultVals);
    setResponse(null);
  }, [endpoint]);

  const handleInputChange = (key: string, value: unknown) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const executeLiveCall = async () => {
    setIsLoading(true);
    setResponse(null);
    const startTime = Date.now();

    // If simulating mock response execution
    if (useMockCall) {
      setTimeout(() => {
        const defaultResp = endpoint.responses?.[0] || {
          status: 200,
          data: { success: true, message: 'Simulated mock handshake success' }
        };
        setResponse({
          status: defaultResp.status,
          data: defaultResp.data,
          duration: Date.now() - startTime
        });
        setIsLoading(false);
      }, 600);
      return;
    }

    // Prepare target path interpolating route path params
    let resolvedPath = endpoint.path;
    if (endpoint.params) {
      Object.keys(endpoint.params).forEach(paramKey => {
        const val = formValues[paramKey] || `:${paramKey}`;
        resolvedPath = resolvedPath.replace(`:${paramKey}`, encodeURIComponent(String(val)));
      });
    }

    // Append configured URL query string params
    const queryParams = new URLSearchParams();
    if (endpoint.query) {
      Object.keys(endpoint.query).forEach(qKey => {
        if (formValues[qKey] !== undefined && formValues[qKey] !== '') {
          queryParams.append(qKey, String(formValues[qKey]));
        }
      });
    }
    const queryString = queryParams.toString();
    const finalUrlPath = `${resolvedPath}${queryString ? `?${queryString}` : ''}`;

    // Target API base URL environment setup
    const baseUrl = API_CONFIG.baseUrl || 'https://api.scale-ev.com';
    const targetEndpoint = `${baseUrl.replace(/\/$/, '')}${finalUrlPath}`;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (endpoint.requiresAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const fetchOptions: RequestInit = {
        method: endpoint.method,
        headers,
      };

      if (endpoint.method !== 'GET' && endpoint.method !== 'DELETE' && endpoint.body) {
        const bodyPayload: Record<string, unknown> = {};
        Object.keys(endpoint.body).forEach(bKey => {
          if (formValues[bKey] !== undefined) {
            bodyPayload[bKey] = formValues[bKey];
          }
        });
        fetchOptions.body = JSON.stringify(bodyPayload);
      }

      const res = await fetch(targetEndpoint, fetchOptions);
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const responseData = isJson ? await res.json() : await res.text();

      setResponse({
        status: res.status,
        data: responseData,
        duration: Date.now() - startTime
      });
    } catch (err: unknown) {
      setResponse({
        error: err instanceof Error ? err.message : 'Network handshake failed or CORS header configuration restriction blocked access.',
        duration: Date.now() - startTime
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputControls = (
    fields: Record<string, { type: string; required: boolean; description: string; defaultValue?: unknown }>,
    sectionTitle: string
  ) => {
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-1.5">
          {sectionTitle}
        </h4>
        <div className="space-y-3">
          {Object.entries(fields).map(([key, field]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-gray-200 flex items-center gap-1.5">
                  <span>{key}</span>
                  {field.required && <span className="text-rose-500 text-[10px]">*required</span>}
                </label>
                <span className="text-[10px] font-mono text-gray-500">{field.type}</span>
              </div>
              {field.type === 'boolean' ? (
                <select
                  value={formValues[key] !== undefined ? String(formValues[key]) : ''}
                  onChange={(e) => handleInputChange(key, e.target.value === 'true')}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">-- select --</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  placeholder={String(field.defaultValue ?? '')}
                  value={formValues[key] !== undefined ? String(formValues[key]) : ''}
                  onChange={(e) => {
                    const val = field.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                    handleInputChange(key, isNaN(val as number) && field.type === 'number' ? '' : val);
                  }}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-emerald-500/50 placeholder:text-gray-700 font-mono"
                />
              )}
              <p className="text-[10px] text-gray-500 leading-tight">{field.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-950 border border-gray-800/80 rounded-xl overflow-hidden flex flex-col shadow-xl">
      {/* Playground Sub-Header Controls */}
      <div className="bg-gray-900/60 px-4 py-3 border-b border-gray-800/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-gray-200">Interactive Console</span>
        </div>

        {/* Toggle Execution target environment */}
        <div className="flex items-center bg-gray-950 p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => setUseMockCall(true)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${useMockCall ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            Mock Pipeline
          </button>
          <button
            onClick={() => setUseMockCall(false)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${!useMockCall ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            Live Target Endpoint
          </button>
        </div>
      </div>

      {/* Target Preview Overlay */}
      <div className="px-4 py-2 bg-gray-900/20 border-b border-gray-800/40 font-mono text-[11px] flex items-center gap-2 overflow-x-auto">
        <span className="text-gray-500 select-none shrink-0">Target URL:</span>
        <span className="text-emerald-400/90 tracking-tight font-medium">
          {API_CONFIG.baseUrl || 'https://api.scale-ev.com'}
        </span>
        <span className="text-gray-400 tracking-tight">{endpoint.path}</span>
      </div>

      {/* Dynamic Forms Frame */}
      <div className="p-4 space-y-5 flex-1 overflow-y-auto max-h-[420px]">
        {/* API Token Input injection */}
        {endpoint.requiresAuth && (
          <div className="space-y-1.5 bg-gray-900/40 p-3 rounded-lg border border-gray-800/60">
            <label className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <span>Authorization Bearer Token</span>
            </label>
            <input
              type="text"
              placeholder="Paste active access token starting with eyJhbGciOi..."
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
            <p className="text-[10px] text-gray-500">
              Required header parameter token signature authorization lease setup.
            </p>
          </div>
        )}

        {/* Input parameters sections rendering */}
        {endpoint.params && renderInputControls(endpoint.params, 'Path Parameters')}
        {endpoint.query && renderInputControls(endpoint.query, 'Query Parameters')}
        {endpoint.body && renderInputControls(endpoint.body, 'JSON Request Body payload')}

        {!endpoint.params && !endpoint.query && !endpoint.body && (
          <div className="text-center py-6 text-gray-600 text-xs flex flex-col items-center gap-1">
            <Layers className="w-6 h-6 text-gray-700" />
            <span>This route takes no body arguments or path configuration schemas.</span>
          </div>
        )}
      </div>

      {/* Submit Trigger Actions */}
      <div className="p-4 bg-gray-900/40 border-t border-gray-800/80">
        <button
          onClick={executeLiveCall}
          disabled={isLoading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs py-2.5 px-4 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Transmitting Packet...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{useMockCall ? 'Simulate Sandbox Action' : 'Transmit Live Network Command'}</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Result Output Inspector */}
      {response && (
        <div className="border-t border-gray-800 bg-gray-950 animate-in fade-in duration-200">
          <div className="px-4 py-2 bg-gray-900/60 border-b border-gray-800/60 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">Execution Output</span>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              {response.status && (
                <span className={`flex items-center gap-1 font-bold ${response.status >= 200 && response.status < 300 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                  {response.status >= 200 && response.status < 300 ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {response.status}
                </span>
              )}
              {response.duration !== undefined && (
                <span className="text-gray-500">{response.duration}ms</span>
              )}
            </div>
          </div>
          <div className="p-4 overflow-x-auto font-mono text-xs max-h-60 overflow-y-auto">
            {response.error ? (
              <div className="text-rose-400 p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 whitespace-pre-wrap">
                {response.error}
              </div>
            ) : (
              <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
