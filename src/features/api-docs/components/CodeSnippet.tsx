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
    <div className="w-[480px] bg-secondary/20 flex flex-col h-screen sticky top-0 backdrop-blur-3xl border-l border-primary/5">
      <div className="p-10 pb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 mb-8 flex items-center gap-2">
            Playground Output
        </h3>
        <div className="flex p-1.5 bg-secondary/50 rounded-2xl ring-1 ring-primary/5">
          <button
            onClick={() => setTab('curl')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2.5 py-2.5 text-[12px] font-bold rounded-xl transition-all cursor-pointer",
              tab === 'curl' ? "bg-background text-primary shadow-xl shadow-black/5" : "text-muted-foreground/60 hover:text-primary"
            )}
          >
            <Terminal className="h-4 w-4" /> cURL
          </button>
          <button
            onClick={() => setTab('node')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2.5 py-2.5 text-[12px] font-bold rounded-xl transition-all cursor-pointer",
              tab === 'node' ? "bg-background text-primary shadow-xl shadow-black/5" : "text-muted-foreground/60 hover:text-primary"
            )}
          >
            <Code2 className="h-4 w-4" /> Node.js
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-10 pt-4 space-y-12">
        {/* Request Snippet */}
        <div className="relative group/snippet">
          <button
            onClick={() => handleCopy(code)}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all opacity-0 group-hover/snippet:opacity-100 z-20 cursor-pointer shadow-2xl border border-white/10"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
          
          <div className="bg-[#0A0A0B] shadow-2xl shadow-black/20 rounded-[2.5rem] p-10 pt-8 overflow-hidden relative min-h-[220px] ring-1 ring-white/5">
             <div className="flex gap-2 mb-8 opacity-30">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
               <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <pre className="font-mono text-[12px] leading-[1.8] text-indigo-100/80 overflow-x-auto selection:bg-primary/30 custom-scrollbar-dark pb-4 pr-4">
              {code}
            </pre>
          </div>
        </div>

        {/* Response Preview */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Response Preview</h4>
            {selectedResponse && (
               <span className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border",
                selectedResponse.status < 300 
                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" 
                  : "bg-rose-500/5 text-rose-500 border-rose-500/10"
               )}>
                 {selectedResponse.status} {selectedResponse.status < 300 ? 'OK' : 'Error'}
               </span>
            )}
          </div>
          
          <div className="bg-background/80 backdrop-blur-md rounded-[2.5rem] p-10 overflow-hidden relative group/response shadow-2xl shadow-black/[0.03] border border-primary/5 min-h-[180px]">
            <button
              onClick={() => handleCopy(JSON.stringify(selectedResponse?.data || {}, null, 2))}
              className="absolute top-8 right-8 p-3 bg-secondary/50 hover:bg-secondary rounded-2xl text-primary transition-all border border-primary/10 opacity-0 group-hover/response:opacity-100 z-20 cursor-pointer"
            >
              <Copy className="h-4 w-4" />
            </button>
            <pre className="font-mono text-[13px] leading-[1.7] text-primary/70 overflow-x-auto max-h-[500px] custom-scrollbar selection:bg-primary/5">
              {JSON.stringify(selectedResponse?.data || {}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Dynamic Context Alert */}
        <div className="p-10 bg-gradient-to-br from-primary/[0.02] to-primary/[0.08] rounded-[2.5rem] relative overflow-hidden group border border-primary/5">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
             <Terminal className="h-32 w-32" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="w-8 h-1 bg-primary/20 rounded-full" />
            <p className="text-[13px] font-bold text-primary/60 leading-relaxed">
              Sandbox Sync: Modifying parameters in the central core will dynamically update these samples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
