'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { API_CONFIG } from '@/constants/constants';
import { useApiKey } from '@/hooks/get/useReporting';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { toast } from 'sonner';
import {
  Terminal,
  Info,
  Key,
  EyeOff,
  Eye,
  Check,
  Copy,
} from 'lucide-react';

export function ApiDocsTab() {
  const { environment } = useEnvironment();
  const { data: apiKeyData } = useApiKey();

  const [selectedGroupDoc, setSelectedGroupDoc] = useState<'CALSTART' | 'PAC'>('CALSTART');
  const [activeApiEndpoint, setActiveApiEndpoint] = useState<string>('charge-events');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    toast.success('Copied copyable content!');
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <Card className="bg-card/40 border-border/40 backdrop-blur-md rounded-2xl shadow-md p-4 sm:p-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary shrink-0" /> {selectedGroupDoc} API Documentation
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Retrieve regulatory compliance datasets for locations in the {selectedGroupDoc} reporting group.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Label className="text-xs font-bold text-muted-foreground whitespace-nowrap">Reporting Group:</Label>
            <Select
              value={selectedGroupDoc}
              onValueChange={(val: 'CALSTART' | 'PAC') => {
                setSelectedGroupDoc(val);
                setActiveApiEndpoint(val === 'CALSTART' ? 'charge-events' : 'pac-site');
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs font-bold bg-card border-border/80 shadow-sm rounded-xl">
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CALSTART">CALSTART</SelectItem>
                <SelectItem value="PAC">PAC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground">Compliance Context:</span> These endpoints query datasets solely for charging stations belonging to locations assigned to the <code className="font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">{selectedGroupDoc}</code> group. Assign compliance-tracked sites in the <span className="font-bold text-foreground">Location Group</span> tab.
          </div>
        </div>

        {/* API Key Box */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-foreground">Your Encrypted API Key</span>
            </div>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium w-fit">
              AES-256 Encrypted Context
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Use this key to authenticate public {selectedGroupDoc} API requests by passing it in the <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">x-api-key</code> header or as a query parameter <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">apiKey</code>.
          </p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKeyData?.apiKey || ''}
                readOnly
                className="w-full font-mono text-[11px] sm:text-xs p-2.5 sm:p-3 pr-20 bg-muted/60 border border-border/40 rounded-xl focus:outline-none select-all text-foreground"
                placeholder="Loading API key..."
              />
              <div className="absolute right-2 top-1 sm:top-1.5 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground rounded-lg"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled={!apiKeyData?.apiKey}
                >
                  {showApiKey ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground rounded-lg"
                  onClick={() => {
                    if (apiKeyData?.apiKey) {
                      handleCopyText(apiKeyData.apiKey, 'api-key');
                    }
                  }}
                  disabled={!apiKeyData?.apiKey}
                >
                  {copiedEndpoint === 'api-key' ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Sidebar endpoint list */}
          <div className="lg:col-span-1 flex flex-col gap-2 self-start bg-card/30 border border-border/40 p-3 rounded-2xl">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 pb-1 border-b border-border/30 mb-1">
              Endpoints ({selectedGroupDoc})
            </div>
            {selectedGroupDoc === 'CALSTART' ? (
              <>
                <button
                  onClick={() => setActiveApiEndpoint('charge-events')}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                    activeApiEndpoint === 'charge-events'
                      ? "bg-primary/15 text-primary border-primary/40 shadow-sm"
                      : "bg-muted/10 text-muted-foreground border-border/30 hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Charge Events</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-500 uppercase shrink-0">GET</span>
                  </div>
                  <span className="text-[10px] opacity-75 truncate font-mono">/calstart/charge-events</span>
                </button>
                <button
                  onClick={() => setActiveApiEndpoint('downtime-events')}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                    activeApiEndpoint === 'downtime-events'
                      ? "bg-primary/15 text-primary border-primary/40 shadow-sm"
                      : "bg-muted/10 text-muted-foreground border-border/30 hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Downtime Events</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-500 uppercase shrink-0">GET</span>
                  </div>
                  <span className="text-[10px] opacity-75 truncate font-mono">/calstart/downtime-events</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveApiEndpoint('pac-site')}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                    activeApiEndpoint === 'pac-site'
                      ? "bg-primary/15 text-primary border-primary/40 shadow-sm"
                      : "bg-muted/10 text-muted-foreground border-border/30 hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Site API</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-500 uppercase shrink-0">GET</span>
                  </div>
                  <span className="text-[10px] opacity-75 truncate font-mono">/pac/site</span>
                </button>
                <button
                  onClick={() => setActiveApiEndpoint('pac-stations')}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                    activeApiEndpoint === 'pac-stations'
                      ? "bg-primary/15 text-primary border-primary/40 shadow-sm"
                      : "bg-muted/10 text-muted-foreground border-border/30 hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Station API</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-500 uppercase shrink-0">GET</span>
                  </div>
                  <span className="text-[10px] opacity-75 truncate font-mono">/pac/stations</span>
                </button>
                <button
                  onClick={() => setActiveApiEndpoint('pac-sessions')}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                    activeApiEndpoint === 'pac-sessions'
                      ? "bg-primary/15 text-primary border-primary/40 shadow-sm"
                      : "bg-muted/10 text-muted-foreground border-border/30 hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Session API</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-500 uppercase shrink-0">GET</span>
                  </div>
                  <span className="text-[10px] opacity-75 truncate font-mono">/pac/sessions</span>
                </button>
                <button
                  onClick={() => setActiveApiEndpoint('pac-interval')}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                    activeApiEndpoint === 'pac-interval'
                      ? "bg-primary/15 text-primary border-primary/40 shadow-sm"
                      : "bg-muted/10 text-muted-foreground border-border/30 hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Interval API</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-500 uppercase shrink-0">GET</span>
                  </div>
                  <span className="text-[10px] opacity-75 truncate font-mono">/pac/interval</span>
                </button>
              </>
            )}
          </div>

          {/* Right Column endpoint detail panel */}
          <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-border/40 lg:pl-6">
            {/* CALSTART Charge Events */}
            {activeApiEndpoint === 'charge-events' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                    <code className="font-mono text-sm sm:text-base font-bold text-foreground">/calstart/charge-events</code>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Retrieve a detailed, paginated array of compliance charging sessions (charge events) that occurred within the specified timeframe for a particular EVSE serial number. Returns 15-minute interval demand snapshots.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                  <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20 custom-scrollbar">
                    <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/40 font-bold">
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-medium">
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">from</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Start date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-01T00:00:00Z</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">to</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">End date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-08T23:59:59Z</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">evseId</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Optional filter by the physical charging station's serial number. If omitted, events for all stations in the location group are returned.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">env</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">page</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">limit</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Number of items to return per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                      onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/calstart/charge-events?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-charge')}
                    >
                      {copiedEndpoint === 'curl-charge' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy cURL
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                    {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/calstart/charge-events?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`[
  {
    "chargeEventId": "91a82f3c-5b6d-472a-8c9e-21ef0a43b567",
    "evseId": "ABB001",
    "portId": 1,
    "portMaximumKw": 150,
    "connectionStartDatetime": "2026-07-01T10:00:00Z",
    "connectionEndDatetime": "2026-07-01T10:45:00Z",
    "chargeSessionStartDatetime": "2026-07-01T10:05:00Z",
    "chargeSessionEndDatetime": "2026-07-01T10:40:00Z",
    "energyConsumedKwh": 42.5,
    "vehicleMake": "Tesla",
    "vehicleModel": "Model Y",
    "vehicleYear": 2023,
    "interval": [
      {
        "intervalId": 1,
        "intervalStartDatetime": "2026-07-01T10:05:00Z",
        "intervalEndDatetime": "2026-07-01T10:20:00Z",
        "intervalPeakDemandKw": 120.0,
        "intervalAverageDemandKw": 115.2,
        "idleDuration": 0
      }
    ]
  }
]`}
                  </pre>
                </div>
              </div>
            )}

            {/* CALSTART Downtime Events */}
            {activeApiEndpoint === 'downtime-events' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                    <code className="font-mono text-sm sm:text-base font-bold text-foreground">/calstart/downtime-events</code>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Retrieve a detailed, paginated list of connector outage and downtime events matching the requested serial number and date range.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                  <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20 custom-scrollbar">
                    <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/40 font-bold">
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-medium">
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">from</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Start date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-01T00:00:00Z</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">to</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">End date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-08T23:59:59Z</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">evseId</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Optional filter by the physical charging station's serial number. If omitted, events for all stations in the location group are returned.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">env</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">page</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">limit</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Number of items to return per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                      onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/calstart/downtime-events?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-downtime')}
                    >
                      {copiedEndpoint === 'curl-downtime' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy cURL
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                    {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/calstart/downtime-events?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`[
  {
    "evseId": "ABB001",
    "downtimeReason": "LOST_COMMUNICATION",
    "eventStartDatetime": "2026-07-02T14:30:00Z",
    "eventEndDatetime": "2026-07-02T15:15:00Z"
  },
  {
    "evseId": "ABB001",
    "downtimeReason": "CONNECTOR_LOCK_FAILURE",
    "eventStartDatetime": "2026-07-05T09:00:00Z",
    "eventEndDatetime": "2026-07-05T10:30:00Z"
  }
]`}
                  </pre>
                </div>
              </div>
            )}

            {/* PAC Site API */}
            {activeApiEndpoint === 'pac-site' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                    <code className="font-mono text-sm sm:text-base font-bold text-foreground">/pac/site</code>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Retrieve a detailed, paginated array of sites/locations assigned to the PAC reporting group.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                  <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20 custom-scrollbar">
                    <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/40 font-bold">
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-medium">
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">env</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">page</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">limit</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Number of items per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                      onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/pac/site?env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-pac-site')}
                    >
                      {copiedEndpoint === 'curl-pac-site' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy cURL
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                    {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/pac/site?env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`{
  "items": [
    {
      "site_id": "8fa134bc-1122-3344-5566-778899aabbcc",
      "site_name": "Pacific Hub - Downtown",
      "address_1": "100 Pacific Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zip_code": "90012",
      "operating_status": "Active",
      "access_type": "PUBLIC",
      "county": "USA"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* PAC Station API */}
            {activeApiEndpoint === 'pac-stations' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                    <code className="font-mono text-sm sm:text-base font-bold text-foreground">/pac/stations</code>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Retrieve a detailed, paginated list of charging stations in the PAC reporting group, including activation date (<code className="font-mono bg-muted px-1 rounded">initialboot</code>), port count, charger type, and total downtime hours.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                  <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20 custom-scrollbar">
                    <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/40 font-bold">
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-medium">
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">siteId</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Filter stations by location/site ID.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">env</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">page</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">limit</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Number of items per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                      onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/pac/stations?env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-pac-stations')}
                    >
                      {copiedEndpoint === 'curl-pac-stations' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy cURL
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                    {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/pac/stations?env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`{
  "items": [
    {
      "site_id": "8fa134bc-1122-3344-5566-778899aabbcc",
      "station_id": "31b94d12-4455-6677-8899-aabbccdd0011",
      "station_serial": "PAC-STA-001",
      "station_name": "Pacific Charger 1",
      "is_active": true,
      "power_level_kw": 50,
      "num_ports": 2,
      "station_activation_date": "2026-01-15 08:30:00",
      "charger_type": "Level 3",
      "connector_type": "CCS1, CHAdeMO",
      "model_number": "Express-250",
      "serial_number": "PAC-STA-001",
      "evse_manufacturer": "ChargePoint",
      "vendor_name": "ScaleEV",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "port_ID": ["e3b0c442-98fc-4c14-9626-d6652613c32e"],
      "install_date": "2026-01-10 12:00:00",
      "downtime_hours": 2.5,
      "latest_communication": "2026-07-20 16:00:00"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* PAC Session API */}
            {activeApiEndpoint === 'pac-sessions' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                    <code className="font-mono text-sm sm:text-base font-bold text-foreground">/pac/sessions</code>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Retrieve a detailed, paginated list of charging sessions under the PAC reporting group, including plug/unplug and charging start/end timestamps and session/charging durations in seconds.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                  <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20 custom-scrollbar">
                    <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/40 font-bold">
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-medium">
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">from</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Start date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-01T00:00:00Z</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">to</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">End date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-08T23:59:59Z</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">stationId</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Filter by station ID.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">siteId</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Filter by site/location ID.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">env</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">page</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">limit</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Number of items per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                      onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/pac/sessions?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-pac-sessions')}
                    >
                      {copiedEndpoint === 'curl-pac-sessions' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy cURL
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                    {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/pac/sessions?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`{
  "items": [
    {
      "session_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "station_id": "31b94d12-4455-6677-8899-aabbccdd0011",
      "port_number": 1,
      "plug_start_datetime": "2026-07-01 10:00:00",
      "plug_end_datetime": "2026-07-01 10:45:00",
      "charge_start_datetime": "2026-07-01 10:05:00",
      "charge_end_datetime": "2026-07-01 10:40:00",
      "session_duration": 2700,
      "charging_duration": 2100,
      "energy_kwh": 35.4,
      "peak_kw": 48.2,
      "total_fee_charged": "0"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* PAC Interval API */}
            {activeApiEndpoint === 'pac-interval' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                    <code className="font-mono text-sm sm:text-base font-bold text-foreground">/pac/interval</code>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Retrieve 15-minute interval power (kW) and energy (kWh) data for charging sessions under the PAC reporting group.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                  <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20 custom-scrollbar">
                    <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/40 font-bold">
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-medium">
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">from</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Start date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-01T00:00:00Z</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">to</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">End date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-08T23:59:59Z</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">sessionId</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Filter intervals by session ID.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">stationId</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Filter intervals by station ID.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">env</td>
                          <td className="p-3 text-muted-foreground font-mono">string</td>
                          <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                          <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">page</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-primary">limit</td>
                          <td className="p-3 text-muted-foreground font-mono">number</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                          <td className="p-3 text-muted-foreground">Number of items per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                      onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/pac/interval?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-pac-interval')}
                    >
                      {copiedEndpoint === 'curl-pac-interval' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy cURL
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                    {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/pac/interval?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`{
  "items": [
    {
      "interval_id": 1,
      "session_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "interval_start_date_time": "2026-07-01 10:00:00",
      "interval_end_date_time": "2026-07-01 10:14:59",
      "interval_kw": 42.1,
      "interval_kwh": 7.02
    },
    {
      "interval_id": 2,
      "session_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "interval_start_date_time": "2026-07-01 10:15:00",
      "interval_end_date_time": "2026-07-01 10:29:59",
      "interval_kw": 45.0,
      "interval_kwh": 11.25
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
