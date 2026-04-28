'use client';

import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, ShieldCheck, Key, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetCredentials } from '../hooks/useApiDocs';
import { toast } from 'sonner';

export function CredentialsCard() {
  const { data: credentials, isLoading: loading, refetch: fetchCredentials, isError } = useGetCredentials();
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<'id' | 'secret' | null>(null);

  const copyToClipboard = (text: string, field: 'id' | 'secret') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field === 'id' ? 'Client ID' : 'Client Secret'} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!credentials && !loading) {
    return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center gap-6 group hover:bg-white/[0.08] transition-all duration-700 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-xl shadow-primary/10">
            <Lock className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-1.5">
            <h3 className="font-black text-xl tracking-tight text-white">Partner API Credentials</h3>
            <p className="text-white/40 text-[13px] max-w-[280px] font-medium leading-relaxed">Access your unique client credentials to begin integration with our Partner APIs.</p>
        </div>
        <button 
          onClick={() => fetchCredentials()}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-[13px] tracking-tight hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          Reveal Credentials
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-10 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-4 animate-pulse backdrop-blur-xl">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="h-3 w-32 bg-white/10 rounded-full" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative overflow-hidden p-6 rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl"
    >
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <ShieldCheck className="w-32 h-32 text-primary" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 shadow-inner">
                    <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-black text-xl tracking-tight text-white">Your Credentials</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30">Infrastructure Identity</p>
                        <div className="h-1 w-1 rounded-full bg-emerald-500/40" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">Encrypted</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4">
          {/* Client ID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-0.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Client ID</label>
            </div>
            <div className="group relative flex items-center">
              <input 
                readOnly
                value={credentials?.clientId}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 font-mono text-[13px] tracking-tight text-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all font-bold"
              />
              <button 
                onClick={() => copyToClipboard(credentials?.clientId || '', 'id')}
                className="absolute right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5"
              >
                {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/20" />}
              </button>
            </div>
          </div>

          {/* Client Secret */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-0.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Client Secret</label>
            </div>
            <div className="group relative flex items-center">
              <input 
                type={showSecret ? 'text' : 'password'}
                readOnly
                value={credentials?.clientSecret}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 font-mono text-[13px] tracking-tight text-white outline-none focus:ring-1 focus:ring-primary/20 transition-all font-bold"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button 
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-white/20 hover:text-white"
                >
                  {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onClick={() => copyToClipboard(credentials?.clientSecret || '', 'secret')}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                >
                  {copiedField === 'secret' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/20" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="p-4 rounded-xl bg-neutral-950 border border-white/5 flex gap-4 items-start">
            <div className="p-1.5 rounded-lg bg-amber-500/10 shrink-0">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-[11px] text-white/40 font-medium leading-relaxed">
              <strong className="text-white/60 block mb-0.5">Security Tip</strong>
              Treat your client secret as a password. Use environment variables to store it securely.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
