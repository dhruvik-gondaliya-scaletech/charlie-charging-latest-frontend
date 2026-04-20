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
    <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center gap-8 group hover:bg-white/[0.08] transition-all duration-700 backdrop-blur-xl">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-primary/20">
            <Lock className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-3">
            <h3 className="font-black text-2xl tracking-tight text-white">Partner API Credentials</h3>
            <p className="text-white/40 text-sm max-w-[320px] font-medium leading-relaxed">Access your unique client credentials to begin integration with our Partner APIs. These will be stored securely for your session.</p>
        </div>
        <button 
          onClick={() => fetchCredentials()}
          className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-black tracking-tight hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
        >
          <ShieldCheck className="w-5 h-5" />
          Reveal Credentials
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-16 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-8 animate-pulse backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-white/10" />
        <div className="h-4 w-48 bg-white/10 rounded-full" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative overflow-hidden p-12 rounded-[2.5rem] bg-neutral-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
        <ShieldCheck className="w-48 h-48 text-primary" />
      </div>

      <div className="relative z-10 space-y-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-primary/10 shadow-inner">
                    <Key className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h3 className="font-black text-3xl tracking-tighter text-white">Your Credentials</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Infrastructure Identity</p>
                        <div className="h-1 w-1 rounded-full bg-emerald-500/40" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">Stored & Encrypted</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-8">
          {/* Client ID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Client ID</label>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">Tenant Ref</span>
            </div>
            <div className="group relative flex items-center">
              <input 
                readOnly
                value={credentials?.clientId}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 font-mono text-sm tracking-tight text-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder:text-white/5"
              />
              <button 
                onClick={() => copyToClipboard(credentials?.clientId || '', 'id')}
                className="absolute right-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
              >
                {copiedField === 'id' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/20" />}
              </button>
            </div>
          </div>

          {/* Client Secret */}
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Client Secret</label>
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-500/40">Sensitive Data</span>
            </div>
            <div className="group relative flex items-center">
              <input 
                type={showSecret ? 'text' : 'password'}
                readOnly
                value={credentials?.clientSecret}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 font-mono text-sm tracking-tight text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              />
              <div className="absolute right-4 flex items-center gap-2">
                <button 
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-white/20 hover:text-white"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => copyToClipboard(credentials?.clientSecret || '', 'secret')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                >
                  {copiedField === 'secret' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/20" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="p-5 rounded-3xl bg-neutral-950 border border-white/5 flex gap-5 items-start">
            <div className="p-2 rounded-xl bg-amber-500/10">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[12px] text-white/50 font-medium leading-relaxed">
              <strong className="text-white/80 block mb-1">Security Recommendation</strong>
              Treat your client secret as a password. Never share it or commit it to your source code repository. Use environment variables to store it securely.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
