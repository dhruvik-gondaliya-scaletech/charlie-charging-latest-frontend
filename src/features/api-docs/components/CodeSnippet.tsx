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
    <div className="w-[520px] bg-[#050505] flex flex-col h-screen sticky top-0 border-l border-white/5 shadow-[-50px_0_100px_rgba(0,0,0,0.5)] z-30">
      <div className="p-12 pb-8">
        <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/40">Request Builder</h3>
                <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest mt-1">Sandbox Environment</p>
            </div>
        </div>
        
        <div className="flex p-1.5 bg-white/[0.02] rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-inner">
          <button
            onClick={() => setTab('curl')}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 py-3 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer",
              tab === 'curl' ? "bg-primary text-primary-foreground shadow-2xl" : "text-white/20 hover:text-white/40 hover:bg-white/5"
            )}
          >
            <Terminal className="h-4 w-4" /> cURL
          </button>
          <button
            onClick={() => setTab('node')}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 py-3 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer",
              tab === 'node' ? "bg-primary text-primary-foreground shadow-2xl" : "text-white/20 hover:text-white/40 hover:bg-white/5"
            )}
          >
            <Globe className="h-4 w-4" /> Node.js
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-12 pt-6 space-y-16">
        {/* Request Snippet */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                Input Code
            </h4>
          </div>
          <div className="relative group/snippet">
            <button
              onClick={() => handleCopy(code)}
              className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-primary hover:text-primary-foreground backdrop-blur-xl rounded-2xl text-white transition-all opacity-0 group-hover/snippet:opacity-100 z-20 cursor-pointer shadow-3xl border border-white/10"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
            
            <div className="bg-neutral-900 border border-white/5 shadow-3xl rounded-[2.5rem] p-10 pt-10 overflow-hidden relative group-hover/snippet:border-primary/20 transition-colors">
               <div className="flex gap-2.5 mb-10 opacity-30">
                 <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                 <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                 <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <pre className="font-mono text-[13px] leading-[2] text-indigo-300/80 overflow-x-auto selection:bg-primary/40 custom-scrollbar-dark pb-6 pr-6">
                {code}
              </pre>
            </div>
          </div>
        </div>

        {/* Response Preview */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                 Expected Response
            </h4>
            {selectedResponse && (
               <span className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase border shadow-lg",
                selectedResponse.status < 300 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
               )}>
                 {selectedResponse.status} {selectedResponse.status < 300 ? 'SUCCESS' : 'ERROR'}
               </span>
            )}
          </div>
          
          <div className="bg-black/60 backdrop-blur-md rounded-[2.5rem] p-12 overflow-hidden relative group/response shadow-3xl border border-white/5 hover:border-white/10 transition-colors">
            <button
              onClick={() => handleCopy(JSON.stringify(selectedResponse?.data || {}, null, 2))}
              className="absolute top-8 right-8 p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/10 opacity-0 group-hover/response:opacity-100 z-20 cursor-pointer"
            >
              <Copy className="h-4 w-4" />
            </button>
            <pre className="font-mono text-[13px] leading-[1.8] text-white/40 overflow-x-auto max-h-[600px] custom-scrollbar-dark selection:bg-emerald-500/20">
              {JSON.stringify(selectedResponse?.data || {}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Dynamic Context Alert */}
        <div className="p-10 bg-neutral-900 border border-white/5 rounded-[3rem] relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-1000">
             <Terminal className="h-48 w-48 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col gap-5">
            <div className="w-10 h-1 bg-primary/30 rounded-full" />
            <p className="text-[14px] font-bold text-white/40 leading-[1.8]">
              <strong className="text-white/60 block mb-2 font-black uppercase text-[11px] tracking-widest">Environment Insight</strong>
              All parameters are dynamically synced across the portal. Modifying core values will reflect here in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
