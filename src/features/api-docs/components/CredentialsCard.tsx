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
      <div className="p-8 rounded-[2.5rem] bg-secondary/20 border border-primary/5 flex flex-col items-center justify-center text-center gap-6 group hover:bg-secondary/30 transition-all duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
            <Lock className="w-8 h-8 text-primary/40" />
        </div>
        <div className="space-y-2">
            <h3 className="font-black text-xl tracking-tight">Partner API Credentials</h3>
            <p className="text-muted-foreground text-sm max-w-[280px]">Access your unique client credentials to begin integration with our Partner APIs.</p>
        </div>
        <button 
          onClick={() => fetchCredentials()}
          className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          Reveal Credentials
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-12 rounded-[2.5rem] bg-secondary/20 border border-primary/5 flex flex-col items-center justify-center gap-6 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-primary/10" />
        <div className="h-4 w-48 bg-primary/10 rounded-full" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br from-background via-secondary/20 to-secondary/40 border border-primary/10 shadow-2xl shadow-black/5"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <ShieldCheck className="w-32 h-32 text-primary" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-2xl tracking-tighter">Your Partner API Credentials</h3>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Tenant Infrastructure Identity</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Client ID */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">Client ID</label>
            <div className="group relative flex items-center">
              <input 
                readOnly
                value={credentials?.clientId}
                className="w-full bg-secondary/30 border border-primary/5 rounded-2xl px-6 py-4 font-mono text-sm tracking-tight text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold"
              />
              <button 
                onClick={() => copyToClipboard(credentials?.clientId || '', 'id')}
                className="absolute right-3 p-2.5 rounded-xl bg-background/50 hover:bg-background transition-all"
              >
                {copiedField === 'id' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-primary/40" />}
              </button>
            </div>
          </div>

          {/* Client Secret */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">Client Secret</label>
            <div className="group relative flex items-center">
              <input 
                type={showSecret ? 'text' : 'password'}
                readOnly
                value={credentials?.clientSecret}
                className="w-full bg-secondary/30 border border-primary/5 rounded-2xl px-6 py-4 font-mono text-sm tracking-tight text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold"
              />
              <div className="absolute right-3 flex items-center gap-1.5">
                <button 
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-2.5 rounded-xl bg-background/50 hover:bg-background transition-all"
                >
                  {showSecret ? <EyeOff className="w-4 h-4 text-primary/40" /> : <Eye className="w-4 h-4 text-primary/40" />}
                </button>
                <button 
                  onClick={() => copyToClipboard(credentials?.clientSecret || '', 'secret')}
                  className="p-2.5 rounded-xl bg-background/50 hover:bg-background transition-all"
                >
                  {copiedField === 'secret' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-primary/40" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-start">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-600/80 font-bold leading-relaxed">
              Treat your client secret as a password. Never share it or commit it to your source code repository. Use environment variables to store it securely.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
