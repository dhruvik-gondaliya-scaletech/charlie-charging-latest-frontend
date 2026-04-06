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
    <div className="w-[440px] bg-secondary/30 flex flex-col h-screen sticky top-0 backdrop-blur-xl">
      <div className="p-8 pb-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 flex items-center gap-2">
          Request Samples
        </h3>
        <div className="flex p-1 bg-background/50 rounded-2xl ring-1 ring-primary/5">
          <button
            onClick={() => setTab('curl')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-[12px] font-bold rounded-xl transition-all cursor-pointer",
              tab === 'curl' ? "bg-background text-primary shadow-sm shadow-black/5" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Terminal className="h-3.5 w-3.5" /> cURL
          </button>
          <button
            onClick={() => setTab('node')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-[12px] font-bold rounded-xl transition-all cursor-pointer",
              tab === 'node' ? "bg-background text-primary shadow-sm shadow-black/5" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Code2 className="h-3.5 w-3.5" /> Node.js
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
        {/* Request Snippet */}
        <div className="relative group">
          <button
            onClick={() => handleCopy(code)}
            className="absolute top-6 right-6 p-2.5 bg-background hover:bg-secondary/20 rounded-xl text-primary transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-xl border border-primary/5"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
          
          <div className="bg-primary/95 shadow-2xl shadow-primary/20 rounded-[2rem] p-8 pt-6 overflow-hidden relative min-h-[200px]">
             <div className="flex gap-2 mb-6 opacity-20">
               <div className="w-2.5 h-2.5 rounded-full bg-background" />
               <div className="w-2.5 h-2.5 rounded-full bg-background" />
               <div className="w-2.5 h-2.5 rounded-full bg-background" />
            </div>
            <pre className="font-mono text-[11px] leading-[1.8] text-primary-foreground/90 overflow-x-auto selection:bg-background/20 custom-scrollbar pb-4 pr-4">
              {code}
            </pre>
          </div>
        </div>

        {/* Response Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Response Example</h4>
            {selectedResponse && (
               <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase",
                selectedResponse.status < 300 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
               )}>
                 {selectedResponse.status}
               </span>
            )}
          </div>
          
          <div className="bg-background rounded-[2rem] p-8 overflow-hidden relative group/response shadow-xl shadow-black/[0.02] ring-1 ring-primary/5 min-h-[150px]">
            <button
              onClick={() => handleCopy(JSON.stringify(selectedResponse?.data || {}, null, 2))}
              className="absolute top-6 right-6 p-2.5 bg-secondary/50 hover:bg-secondary rounded-xl text-primary transition-all border border-primary/5 opacity-0 group-hover/response:opacity-100 z-20 cursor-pointer"
            >
              <Copy className="h-4 w-4" />
            </button>
            <pre className="font-mono text-[12px] leading-[1.6] text-primary/80 overflow-x-auto max-h-[400px] no-scrollbar">
              {JSON.stringify(selectedResponse?.data || {}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Dynamic Context Alert */}
        <div className="p-8 bg-primary/5 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
             <Terminal className="h-24 w-24" />
          </div>
          <p className="text-[12px] font-bold text-primary/70 leading-relaxed relative z-10">
            Real-time Sandbox: Modifying parameters in the central core will automatically update these snippets.
          </p>
        </div>
      </div>
    </div>
  );
}
