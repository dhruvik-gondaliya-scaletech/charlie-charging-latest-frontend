'use client';

import { useState } from 'react';
import { ApiEndpoint } from '../data/api-data';
import { Copy, Check, Terminal, Code2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeSnippetProps {
  endpoint: ApiEndpoint;
  formValues: Record<string, any>;
  activeResponseStatus: number | null;
}

export function CodeSnippet({ endpoint, formValues, activeResponseStatus }: CodeSnippetProps) {
  const [tab, setTab] = useState<'curl' | 'node'>('curl');
  const [copied, setCopied] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.scale-ev.com';
  
  const getProcessedPath = () => {
    let path = endpoint.path;
    if (endpoint.params) {
      Object.keys(endpoint.params).forEach(key => {
        path = path.replace(`:${key}`, formValues[key] || `:${key}`);
      });
    }
    const queryParams = new URLSearchParams();
    if (endpoint.query) {
      Object.keys(endpoint.query).forEach(key => {
        if (formValues[key]) queryParams.append(key, formValues[key]);
      });
    }
    const queryString = queryParams.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const currentPath = getProcessedPath();

  const generateCurl = () => {
    let curl = `curl -X ${endpoint.method} "${baseUrl}${currentPath}" \\\n`;
    curl += `  -H "Content-Type: application/json"`;
    
    if (endpoint.requiresAuth !== false) {
      curl += ` \\\n  -H "Authorization: Bearer <TOKEN>"`;
    }
    
    if (endpoint.body) {
      const bodyData: Record<string, any> = {};
      Object.entries(endpoint.body).forEach(([key, info]) => {
        bodyData[key] = formValues[key] || info.defaultValue || '...';
      });
      curl += ` \\\n  -d '${JSON.stringify(bodyData, null, 2)}'`;
    }
    return curl;
  };

  const generateNode = () => {
    let node = `// Node.js Implementation\n\nconst response = await fetch("${baseUrl}${currentPath}", {\n`;
    node += `  method: "${endpoint.method}",\n`;
    node += `  headers: {\n`;
    node += `    "Content-Type": "application/json"`;
    
    if (endpoint.requiresAuth !== false) {
      node += `,\n    "Authorization": "Bearer <TOKEN>"\n`;
    } else {
      node += `\n`;
    }
    node += `  },\n`;
    
    if (endpoint.body) {
      const bodyData: Record<string, any> = {};
      Object.entries(endpoint.body).forEach(([key, info]) => {
        bodyData[key] = formValues[key] || info.defaultValue || '...';
      });
      node += `  body: JSON.stringify(${JSON.stringify(bodyData, null, 2).replace(/"/g, "'")})\n`;
    }
    node += `});\n\nconst data = await response.json();`;
    return node;
  };

  const code = tab === 'curl' ? generateCurl() : generateNode();
  const selectedResponse = endpoint.responses.find(r => r.status === activeResponseStatus);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[420px] bg-[#050505] flex flex-col h-screen sticky top-0 border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-30">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <Code2 className="w-4 h-4 text-primary" />
            </div>
            <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Request Builder</h3>
                <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest mt-0.5">Sandbox Environment</p>
            </div>
        </div>
        
        <div className="flex p-1 bg-white/[0.02] rounded-xl border border-white/5 shadow-inner">
          <button
            onClick={() => setTab('curl')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2.5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer",
              tab === 'curl' ? "bg-primary text-primary-foreground" : "text-white/20 hover:text-white/40 hover:bg-white/5"
            )}
          >
            <Terminal className="h-3.5 w-3.5" /> cURL
          </button>
          <button
            onClick={() => setTab('node')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2.5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer",
              tab === 'node' ? "bg-primary text-primary-foreground" : "text-white/20 hover:text-white/40 hover:bg-white/5"
            )}
          >
            <Globe className="h-3.5 w-3.5" /> Node.js
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-6 pt-2 space-y-10">
        {/* Request Snippet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                Input Code
            </h4>
          </div>
          <div className="relative group/snippet">
            <button
              onClick={() => handleCopy(code)}
              className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-primary hover:text-primary-foreground backdrop-blur-xl rounded-xl text-white transition-all opacity-0 group-hover/snippet:opacity-100 z-20 cursor-pointer shadow-xl border border-white/10"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            
            <div className="bg-neutral-900 border border-white/5 shadow-2xl rounded-2xl p-6 overflow-hidden relative group-hover/snippet:border-primary/20 transition-colors">
               <div className="flex gap-2 mb-6 opacity-30">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                 <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                 <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
               </div>
              <pre className="font-mono text-[12px] leading-relaxed text-indigo-300/80 overflow-x-auto selection:bg-primary/40 custom-scrollbar-dark">
                {code}
              </pre>
            </div>
          </div>
        </div>

        {/* Response Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
                 Expected Response
            </h4>
            {selectedResponse && (
               <span className={cn(
                "px-3 py-1 rounded-lg text-[9px] font-black tracking-[0.1em] uppercase border",
                selectedResponse.status < 300 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
               )}>
                 {selectedResponse.status} {selectedResponse.status < 300 ? 'SUCCESS' : 'ERROR'}
               </span>
            )}
          </div>
          
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 overflow-hidden relative group/response shadow-2xl border border-white/5 hover:border-white/10 transition-colors">
            <button
              onClick={() => handleCopy(JSON.stringify(selectedResponse?.data || {}, null, 2))}
              className="absolute top-4 right-4 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all border border-white/10 opacity-0 group-hover/response:opacity-100 z-20 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <pre className="font-mono text-[12px] leading-relaxed text-white/40 overflow-x-auto max-h-[400px] custom-scrollbar-dark selection:bg-emerald-500/20">
              {JSON.stringify(selectedResponse?.data || {}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Dynamic Context Alert */}
        <div className="p-6 bg-neutral-900 border border-white/5 rounded-2xl relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-1000">
             <Terminal className="h-32 w-32 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="w-8 h-1 bg-primary/30 rounded-full" />
            <p className="text-[13px] font-bold text-white/40 leading-relaxed">
              <strong className="text-white/60 block mb-1 font-black uppercase text-[10px] tracking-widest">Environment Insight</strong>
              Parameters are synced portal-wide. Modifying values reflects here in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
