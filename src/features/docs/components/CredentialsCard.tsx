'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, Check, ShieldCheck, Key, Lock, RefreshCw, Sparkles, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetCredentials, useDocumentationToken, getStoredDocsToken } from '../hooks/useDocsAuth';
import { toast } from 'sonner';

export function CredentialsCard() {
  const { data: credentials, isLoading: loadingCreds, refetch: fetchCredentials } = useGetCredentials();
  const { mutateAsync: generateTokenLease, isPending: loadingToken } = useDocumentationToken();
  
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<'id' | 'secret' | 'token' | null>(null);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydrate initial token from secure local storage on mount
  useEffect(() => {
    setMounted(true);
    const stored = getStoredDocsToken();
    if (stored) {
      setActiveToken(stored);
    }
  }, []);

  const displayCredentials = mounted ? credentials : null;

  const copyToClipboard = (text: string, field: 'id' | 'secret' | 'token') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    
    const labels = {
      id: 'Client ID',
      secret: 'Client Secret',
      token: 'Bearer Authorization Token'
    };
    
    toast.success(`${labels[field]} copied to active clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAcquireToken = async () => {
    try {
      const newToken = await generateTokenLease();
      setActiveToken(newToken);
    } catch (err) {
      // Error is caught and surfaced via toast in hook pipeline
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Client Credentials Sub-Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden p-6 rounded-2xl bg-gray-950 border border-gray-800 shadow-xl"
      >
        <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none select-none">
          <ShieldCheck className="w-40 h-40 text-emerald-500" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-tight">Tenant API Credentials</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Infrastructure Scope</span>
                  <div className="h-1 w-1 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">Encrypted Client Identity</span>
                </div>
              </div>
            </div>

            {!displayCredentials && (
              <button
                onClick={() => fetchCredentials()}
                disabled={loadingCreds}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 cursor-pointer"
              >
                {loadingCreds ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Decrypting Identity...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Disclose Keys</span>
                  </>
                )}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {displayCredentials ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-2"
              >
                {/* Client ID Frame */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">
                    Client ID
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      readOnly
                      value={displayCredentials.clientId}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-emerald-400 outline-none font-bold select-all pr-10"
                    />
                    <button 
                      onClick={() => copyToClipboard(displayCredentials.clientId, 'id')}
                      className="absolute right-2 p-1.5 rounded-lg bg-gray-950 hover:bg-gray-800 transition-all border border-gray-800 text-gray-400 hover:text-white"
                      title="Copy Client ID"
                    >
                      {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Client Secret Frame */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">
                    Client Secret
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type={showSecret ? 'text' : 'password'}
                      readOnly
                      value={displayCredentials.clientSecret}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-gray-100 outline-none font-bold select-all pr-20 tracking-wide"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      <button 
                        onClick={() => setShowSecret(!showSecret)}
                        className="p-1.5 rounded-lg bg-gray-950 hover:bg-gray-800 transition-all border border-gray-800 text-gray-400 hover:text-white"
                        title={showSecret ? 'Obfuscate Secret' : 'Reveal Secret'}
                      >
                        {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        onClick={() => copyToClipboard(displayCredentials.clientSecret, 'secret')}
                        className="p-1.5 rounded-lg bg-gray-950 hover:bg-gray-800 transition-all border border-gray-800 text-gray-400 hover:text-white"
                        title="Copy Client Secret"
                      >
                        {copiedField === 'secret' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 text-center text-xs text-gray-500 flex flex-col items-center gap-1.5 py-8">
                <Lock className="w-5 h-5 text-gray-700" />
                <span>Confidential keys remain securely obfuscated until disclosed via verification.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 2. Automatic Sandbox Access Token Sub-Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 rounded-2xl bg-gray-950 border border-gray-800 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-white tracking-tight">Ephemeral Testing Authorization Lease</h4>
              <p className="text-[11px] text-gray-500 leading-tight">Instantiate temporary Bearer tokens for rapid sandbox interface execution.</p>
            </div>
          </div>

          <button
            onClick={handleAcquireToken}
            disabled={loadingToken}
            className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-sky-500/10 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {loadingToken ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Negotiating...</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                <span>{activeToken ? 'Refresh Lease' : 'Generate Token'}</span>
              </>
            )}
          </button>
        </div>

        {activeToken ? (
          <div className="space-y-1.5 animate-in fade-in duration-200 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-wider text-sky-400 block font-semibold">
                Active Bearer Signature Payload
              </label>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Auto-Bound to Sandbox Console
              </span>
            </div>
            <div className="relative flex items-center">
              <input 
                readOnly
                value={activeToken}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-gray-300 outline-none font-bold select-all pr-10 truncate"
              />
              <button 
                onClick={() => copyToClipboard(activeToken, 'token')}
                className="absolute right-2 p-1.5 rounded-lg bg-gray-950 hover:bg-gray-800 transition-all border border-gray-800 text-gray-400 hover:text-white"
                title="Copy Bearer Token"
              >
                {copiedField === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-900/30 rounded-xl border border-gray-800/80 text-xs text-gray-500 text-center font-mono">
            No active ephemeral token injected. Generate lease to enable automatic authorization headers.
          </div>
        )}
      </motion.div>
    </div>
  );
}
