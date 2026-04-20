'use client';

import { useState } from 'react';
import { Play, Loader2, Globe, Terminal, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiDocsService } from '@/services/api-docs.service';
import { useDocumentationToken } from '../hooks/useApiDocs';
import { ApiEndpoint } from '../data/api-data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiPlaygroundProps {
  endpoint: ApiEndpoint;
  formValues: Record<string, any>;
}

export function ApiPlayground({ endpoint, formValues }: ApiPlaygroundProps) {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const { mutateAsync: getToken } = useDocumentationToken();

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatus(null);

    try {
      // 1. Get Documentation Token
      const token = await getToken();

      // 2. Format Path with Params
      let finalPath = endpoint.path;
      if (endpoint.params) {
        Object.keys(endpoint.params).forEach(key => {
          finalPath = finalPath.replace(`:${key}`, formValues[key] || `[${key}]`);
        });
      }

      // 3. Make the actual Partner API call via standard service pattern
      const res = await apiDocsService.testPartnerApi(
        endpoint.method,
        finalPath,
        token,
        endpoint.method !== 'GET' ? formValues : undefined,
        endpoint.method === 'GET' ? formValues : undefined
      );

      setResponse(res);
      setStatus(200); // Standard service unwraps and might not return status, but we can assume success if it resolves
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
      setStatus(err.response?.status || 500);
      setResponse(err.response?.data || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
                <Play className="w-4 h-4 text-primary" />
            </div>
            <h4 className="text-[14px] font-black tracking-tight">Interactive Playground</h4>
        </div>
        <button 
          onClick={handleTest}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-tight hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? 'Executing...' : 'Run Request'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-[2rem] bg-neutral-950 border border-white/5 overflow-hidden shadow-2xl flex flex-col min-h-[300px]">
          <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-2" />
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-white/40" />
                <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest">Console Output</span>
              </div>
            </div>
            {status && (
              <div className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                status < 300 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                {status < 300 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                Status: {status}
              </div>
            )}
          </div>

          <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed overflow-auto custom-scrollbar-dark">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-4 text-white/20"
                >
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="font-bold tracking-tight">Awaiting Response...</p>
                </motion.div>
              ) : response ? (
                <motion.pre 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400/90 whitespace-pre-wrap"
                >
                  {JSON.stringify(response, null, 2)}
                </motion.pre>
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400/90 whitespace-pre-wrap"
                >
                    {JSON.stringify(response || { message: error }, null, 2)}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center gap-4 text-white/10"
                >
                  <Globe className="w-12 h-12" />
                  <p className="font-bold tracking-tight uppercase text-[11px] tracking-[0.2em]">Ready for execution</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-6 rounded-[1.5rem] bg-secondary/20 border border-primary/5">
             <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Auto-Auth Enabled</span>
             </div>
             <p className="text-[12px] text-muted-foreground/80 leading-relaxed font-bold">
                This playground automatically injects a temporary <strong>Documentation Bearer Token</strong>. You don't need to manually provide credentials to test these endpoints.
             </p>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
