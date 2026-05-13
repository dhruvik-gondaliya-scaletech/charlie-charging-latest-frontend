'use client';

import React, { useState } from 'react';
import { PortalEndpoint } from '../data/portal-data';
import { Copy, Check, Terminal } from 'lucide-react';
import { API_CONFIG } from '@/constants/constants';

interface RequestCodePanelProps {
  endpoint: PortalEndpoint;
}

export function RequestCodePanel({ endpoint }: RequestCodePanelProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [copied, setCopied] = useState<boolean>(false);

  // Reconstruct an example default object payload
  const buildExamplePayload = () => {
    const payload: Record<string, any> = {};
    if (endpoint.body) {
      Object.entries(endpoint.body).forEach(([key, field]) => {
        payload[key] = field.defaultValue !== undefined ? field.defaultValue : `${field.type}_value`;
      });
    }
    return payload;
  };

  const getCodeSnippet = () => {
    const baseUrl = API_CONFIG.baseUrl || "https://api.scale-ev.com";
    const cleanPath = endpoint.path;
    const fullUrl = `${baseUrl}${cleanPath}`;
    const payload = buildExamplePayload();
    const hasBody = Object.keys(payload).length > 0 && endpoint.method !== 'GET' && endpoint.method !== 'DELETE';

    switch (activeTab) {
      case 'curl': {
        let curlCmd = `curl -X ${endpoint.method} "${fullUrl}" \\\n  -H "Content-Type: application/json"`;
        if (endpoint.requiresAuth) {
          curlCmd += ` \\\n  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"`;
        }
        if (hasBody) {
          curlCmd += ` \\\n  -d '${JSON.stringify(payload, null, 2)}'`;
        }
        return curlCmd;
      }
      case 'node': {
        let nodeCode = `const targetUrl = \`${fullUrl}\`;\n\nconst options = {\n  method: '${endpoint.method}',\n  headers: {\n    'Content-Type': 'application/json',`;
        if (endpoint.requiresAuth) {
          nodeCode += `\n    'Authorization': 'Bearer <YOUR_ACCESS_TOKEN>'`;
        }
        nodeCode += `\n  }`;
        if (hasBody) {
          nodeCode += `,\n  body: JSON.stringify(${JSON.stringify(payload, null, 2).replace(/\n/g, '\n  ')})`;
        }
        nodeCode += `\n};\n\nfetch(targetUrl, options)\n  .then(res => res.json())\n  .then(json => console.log(json))\n  .catch(err => console.error(err));`;
        return nodeCode;
      }
      case 'python': {
        let pyCode = `import requests\nimport os\n\nurl = f"${fullUrl.replace('${process.env.', '{os.getenv(').replace('}', '}')}"\nheaders = {\n    "Content-Type": "application/json"`;
        if (endpoint.requiresAuth) {
          pyCode += `,\n    "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"`
        }
        pyCode += `\n}`;
        if (hasBody) {
          pyCode += `\npayload = ${JSON.stringify(payload, null, 4)}\n\nresponse = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)`;
        } else {
          pyCode += `\n\nresponse = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`;
        }
        pyCode += `\nprint(response.json())`;
        return pyCode;
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-lg select-none">
      {/* Code Header Toolbar */}
      <div className="bg-gray-900/80 px-4 py-2 border-b border-gray-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Terminal className="w-3.5 h-3.5 text-gray-500" />
          <span>Code Integration</span>
        </div>

        {/* Tab selection controls */}
        <div className="flex items-center gap-1 bg-gray-950 p-0.5 rounded-lg border border-gray-800/80">
          {(['curl', 'node', 'python'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${activeTab === tab
                ? 'bg-gray-800 text-gray-200 font-bold shadow-sm'
                : 'text-gray-500 hover:text-gray-400'
                }`}
            >
              {tab === 'curl' ? 'cURL' : tab === 'node' ? 'Node.js' : 'Python'}
            </button>
          ))}
        </div>

        {/* Action Copy icon */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors relative group"
          title="Copy snippet"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="absolute right-0 top-7 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-800">
            {copied ? 'Copied!' : 'Copy Code'}
          </span>
        </button>
      </div>

      {/* Code Body Render Canvas */}
      <div className="p-4 bg-gray-950/80 overflow-x-auto font-mono text-xs max-h-72 overflow-y-auto selection:bg-gray-800">
        <pre className="text-gray-300 leading-relaxed">
          <code>{getCodeSnippet()}</code>
        </pre>
      </div>
    </div>
  );
}
