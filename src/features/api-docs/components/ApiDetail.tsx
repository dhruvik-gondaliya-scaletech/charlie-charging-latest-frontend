'use client';

import { ApiEndpoint, GuideSection, ResponseField } from '../data/api-data';
import { ChevronRight, ChevronDown, ArrowLeft, ArrowRight, BookOpen, Cpu, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { CredentialsCard } from './CredentialsCard';
import { ApiPlayground } from './ApiPlayground';

interface ApiDetailProps {
  item: ApiEndpoint | GuideSection;
  type: 'api' | 'guide';
  formValues: Record<string, any>;
  onFormChange: (key: string, value: any) => void;
  activeResponseStatus: number | null;
  onResponseStatusChange: (status: number) => void;
  prevItem: { id: string; type: 'api' | 'guide'; title: string } | null;
  nextItem: { id: string; type: 'api' | 'guide'; title: string } | null;
  onNavigate: (id: string, type: 'api' | 'guide') => void;
}

export function ApiDetail({ 
  item, type, formValues, onFormChange, 
  activeResponseStatus, onResponseStatusChange,
  prevItem, nextItem, onNavigate 
}: ApiDetailProps) {

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
      case 'POST': return 'text-blue-400 bg-blue-400/10 border-blue-500/20';
      case 'PUT': return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
      default: return 'text-white/40 bg-white/5 border-white/5';
    }
  };

  const renderSchemaRow = (key: string, field: ResponseField, depth = 0) => (
    <div key={key} className="space-y-0">
      <div className={cn(
        "grid grid-cols-[1.5fr_2fr] gap-6 py-3 px-6 border-b border-white/5 items-center",
        depth > 0 && "bg-white/[0.02] border-l border-primary/20 ml-4"
      )}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-black text-[14px] text-primary tracking-tight">{key}</span>
            {field.required && <span className="text-[9px] text-rose-500 font-black uppercase tracking-widest bg-rose-500/10 px-1.5 py-0.5 rounded">Required</span>}
          </div>
          <span className="text-[10px] text-white/20 font-mono font-black uppercase tracking-[0.2em]">{field.type}</span>
        </div>
        <p className="text-[14px] text-white/50 leading-relaxed font-medium">{field.description}</p>
      </div>
      {field.children && Object.entries(field.children).map(([k, f]) => renderSchemaRow(k, f, depth + 1))}
    </div>
  );

  const renderNavigationFooter = () => (
    <div className="pt-10 mt-16 border-t border-white/5 flex items-center justify-between gap-6 pb-20">
      {prevItem ? (
        <button 
          onClick={() => onNavigate(prevItem.id, prevItem.type)}
          className="flex-1 group p-5 rounded-2xl bg-white/5 hover:bg-white/[0.08] transition-all cursor-pointer text-left relative overflow-hidden border border-white/5"
        >
          <div className="flex items-center gap-2 text-white/30 mb-2 font-black uppercase text-[10px] tracking-[0.3em] opacity-60 group-hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Previous
          </div>
          <span className="text-[15px] font-black text-white group-hover:text-primary tracking-tight leading-tight relative z-10 transition-colors">{prevItem.title}</span>
        </button>
      ) : <div className="flex-1" />}
      
      {nextItem ? (
        <button 
          onClick={() => onNavigate(nextItem.id, nextItem.type)}
          className="flex-1 group p-5 rounded-2xl bg-primary text-primary-foreground transition-all cursor-pointer text-right relative overflow-hidden shadow-xl shadow-primary/10 border border-primary/20"
        >
          <div className="flex items-center justify-end gap-2 text-primary-foreground/40 mb-2 font-black uppercase text-[10px] tracking-[0.3em]">
             Next <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
          <span className="text-[15px] font-black tracking-tight leading-tight">{nextItem.title}</span>
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-12 h-12" />
          </div>
        </button>
      ) : <div className="flex-1" />}
    </div>
  );

  if (type === 'guide') {
    const guide = item as GuideSection;
    return (
      <div className="max-w-4xl mx-auto py-16 px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-primary/10 shadow-inner">
                <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 block mb-0.5">Documentation Guide</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">Resource Protocol</span>
            </div>
        </div>
        
        <div className="prose prose-invert prose-neutral prose-headings:tracking-tight prose-h1:text-4xl prose-h1:font-black prose-h1:mb-10 prose-h1:text-white prose-h2:text-2xl prose-h2:font-black prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-white/90 prose-h3:uppercase prose-h3:tracking-[0.2em] prose-h3:text-[10px] prose-h3:font-black prose-h3:text-primary prose-p:text-white/50 prose-p:leading-relaxed prose-p:text-[16px] prose-p:font-medium prose-pre:bg-neutral-900/50 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:border border-white/5 prose-code:text-primary max-w-none">
          <ReactMarkdown>{guide.content}</ReactMarkdown>
        </div>

        {guide.id === 'authentication' && (
          <div className="mt-24">
            <CredentialsCard />
          </div>
        )}

        {renderNavigationFooter()}
      </div>
    );
  }
  const endpoint = item as ApiEndpoint;

  return (
    <div className="max-w-4xl mx-auto py-16 px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-white/5 shadow-inner border border-white/5">
            <Cpu className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
                <span className={cn(
                "text-[9px] font-black px-3 py-1.5 rounded-lg tracking-[0.15em] uppercase border",
                getMethodColor(endpoint.method)
                )}>
                {endpoint.method}
                </span>
                <code className="text-[12px] font-mono font-black text-white/30 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 tracking-tight">
                {endpoint.path}
                </code>
            </div>
        </div>
      </div>

      <h1 className="text-3xl font-black tracking-tight mb-12 text-white leading-[1.1] max-w-3xl">
        {endpoint.description}
      </h1>

      {/* Body Params Section */}
      {endpoint.body && (
        <div className="mb-12">
          <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
            <span className="h-px w-6 bg-white/10" />
            Body Parameters
          </h4>
          <div className="space-y-0 bg-white/[0.01] rounded-2xl overflow-hidden border border-white/5 shadow-inner">
            {Object.entries(endpoint.body).map(([key, info]) => (
              <div key={key} className="grid grid-cols-[1.5fr_2fr] gap-8 py-6 px-8 border-b border-white/5 items-start last:border-b-0 hover:bg-white/[0.01] transition-colors">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-[14px] text-primary tracking-tight">{key}</span>
                    {info.required && <span className="text-[8px] text-rose-500 font-black uppercase tracking-widest bg-rose-500/10 px-1.5 py-0.5 rounded">Required</span>}
                  </div>
                  <span className="text-[10px] text-white/20 font-mono font-black uppercase tracking-[0.2em]">{info.type}</span>
                </div>
                <div className="space-y-4">
                  <p className="text-[14px] text-white/40 font-medium leading-relaxed">{info.description}</p>
                  <div className="relative group">
                    <input 
                      type="text"
                      value={formValues[key] || ''}
                      onChange={(e) => onFormChange(key, e.target.value)}
                      placeholder={`Example: ${info.defaultValue || '...'}`}
                      className="w-full bg-black/30 border border-white/5 rounded-xl px-5 py-3 text-[14px] font-bold text-white placeholder:text-white/10 focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responses Section */}
      <div className="mb-12">
        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
            <span className="h-px w-6 bg-white/10" />
            Response Patterns
        </h4>
        <div className="space-y-3">
          {endpoint.responses.map((resp) => (
            <div key={resp.status} className={cn(
              "rounded-2xl transition-all overflow-hidden relative border",
              activeResponseStatus === resp.status ? "bg-white/[0.03] border-primary/20 shadow-xl shadow-primary/5" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
            )}>
              <button 
                onClick={() => onResponseStatusChange(resp.status)}
                className="w-full px-6 py-4 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all ring-4",
                    resp.status < 300 ? "bg-emerald-500 ring-emerald-400/10" : "bg-rose-500 ring-rose-400/10"
                  )} />
                  <div className="flex flex-col text-left gap-1">
                    <span className={cn(
                        "text-[15px] font-black tracking-tight transition-colors",
                        activeResponseStatus === resp.status ? "text-white" : "text-white/60 group-hover:text-white"
                    )}>
                      {resp.status} — <span className="text-[11px] text-white/20 uppercase tracking-widest font-black ml-2">{resp.description}</span>
                    </span>
                  </div>
                </div>
                {activeResponseStatus === resp.status ? <ChevronDown className="h-5 w-5 text-white/40" /> : <ChevronRight className="h-5 w-5 text-white/20" />}
              </button>
              
              {activeResponseStatus === resp.status && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                  <div className="px-6 pb-6 pt-3 bg-black/20">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                       <History className="w-3.5 h-3.5 opacity-40" />
                       Schema Definition
                    </h5>
                    {resp.schema ? (
                      <div className="rounded-xl bg-neutral-900 border border-white/5 overflow-hidden shadow-xl">
                        {Object.entries(resp.schema).map(([k, f]) => renderSchemaRow(k, f))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                        <p className="text-[13px] text-white/20 italic font-medium">No structured schema defined for this response.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="mb-12">
        <ApiPlayground endpoint={endpoint} formValues={formValues} />
      </div>

      {renderNavigationFooter()}
    </div>
  );
}
