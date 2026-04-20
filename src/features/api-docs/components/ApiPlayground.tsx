import { Play, Loader2, Globe, Terminal, Send, CheckCircle2, AlertCircle, ShieldCheck, History } from 'lucide-react';
import { apiDocsService } from '@/services/api-docs.service';
import { useDocumentationToken, useStoredToken } from '../hooks/useApiDocs';
import { ApiEndpoint } from '../data/api-data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
  const storedToken = useStoredToken();

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatus(null);

    try {
      // 1. Use stored token if available, otherwise get new one
      let token = storedToken;
      if (!token) {
        token = await getToken();
      }

      // 2. Format Path with Params
      let finalPath = endpoint.path;
      if (endpoint.params) {
        Object.keys(endpoint.params).forEach(key => {
          const val = formValues[key] || `[${key}]`;
          finalPath = finalPath.replace(`:${key}`, val);
        });
      }

      // 3. Make the actual Partner API call
      const res = await apiDocsService.testPartnerApi(
        endpoint.method,
        finalPath,
        token,
        endpoint.method !== 'GET' ? formValues : undefined,
        endpoint.method === 'GET' ? formValues : undefined
      );

      setResponse(res);
      setStatus(200);
    } catch (err: any) {
      console.error('API Test Error:', err);
      // If token is invalid, maybe it expired. Let's try to get a new one and retry once
      if (err.response?.status === 401 && storedToken) {
        try {
          const newToken = await getToken();
          // Retry logic would go here, but for now we'll just show the error and the next attempt will use new token
          setError('Token expired. A new session has been initialized. Please try running the request again.');
        } catch (tokenErr) {
          setError('Authentication session failed. Please check your credentials.');
        }
      } else {
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
        setStatus(err.response?.status || 500);
        setResponse(err.response?.data || null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 shadow-lg shadow-primary/5">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-[16px] font-black tracking-tight text-white">Interactive Playground</h4>
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mt-1">Live Endpoint Testing</p>
          </div>
        </div>
        <button
          onClick={handleTest}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-tight hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-primary/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {loading ? 'Executing...' : 'Run Request'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-[2.5rem] bg-neutral-900 border border-white/5 overflow-hidden shadow-2xl flex flex-col min-h-[400px]">
          <div className="px-8 py-5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              </div>
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-white/40" />
                <span className="text-[12px] font-mono font-black text-white/40 uppercase tracking-[0.2em]">Response Console</span>
              </div>
            </div>
            {status && (
              <div className={cn(
                "px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 border",
                status < 300 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              )}>
                {status < 300 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                HTTP {status}
              </div>
            )}
          </div>

          <div className="flex-1 p-10 font-mono text-[14px] leading-relaxed overflow-auto custom-scrollbar-dark bg-black/20">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-5 text-white/10"
                >
                  <Loader2 className="w-12 h-12 animate-spin text-primary/40" />
                  <p className="font-black uppercase tracking-[0.3em] text-[11px]">Awaiting Server Response...</p>
                </motion.div>
              ) : response ? (
                <motion.pre
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400/90 whitespace-pre scroll-smooth"
                >
                  {JSON.stringify(response, null, 2)}
                </motion.pre>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400/90 whitespace-pre-wrap font-bold"
                >
                  {JSON.stringify(response || { message: error }, null, 2)}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center gap-6 text-white/5"
                >
                  <Globe className="w-20 h-20" />
                  <p className="font-black uppercase text-[12px] tracking-[0.4em] text-white/20">Ready for Live Execution</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white/60">Authentication Session</span>
            </div>
            {storedToken && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <History className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Session Resumed</span>
              </div>
            )}
          </div>
          <p className="text-[13px] text-white/40 leading-relaxed font-medium max-w-3xl">
            This playground utilizes a secure, encrypted documentation token. To maintain security, tokens are stored locally for your current session and will be automatically refreshed when they expire.
          </p>
        </div>
      </div>
    </div>
  );
}
