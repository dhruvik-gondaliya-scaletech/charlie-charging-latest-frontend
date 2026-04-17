'use client';

import { ApiEndpoint, GuideSection, ResponseField } from '../data/api-data';
import { ChevronRight, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

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
      case 'GET': return 'text-emerald-500 bg-emerald-500/5';
      case 'POST': return 'text-blue-500 bg-blue-500/5';
      case 'PUT': return 'text-amber-500 bg-amber-500/5';
      default: return 'text-neutral-500 bg-neutral-500/5';
    }
  };

  const renderSchemaRow = (key: string, field: ResponseField, depth = 0) => (
    <div key={key} className="space-y-0">
      <div className={cn(
        "grid grid-cols-[1.5fr_2fr] gap-8 py-4 px-6 border-b border-secondary/50",
        depth > 0 && "bg-secondary/10 border-l border-primary/10 ml-4"
      )}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[13px] text-primary tracking-tight">{key}</span>
            {field.required && <span className="text-[9px] text-destructive font-black uppercase tracking-widest">Required</span>}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono opacity-80 uppercase tracking-widest">{field.type}</span>
        </div>
        <p className="text-[13px] text-foreground/80 leading-relaxed font-medium">{field.description}</p>
      </div>
      {field.children && Object.entries(field.children).map(([k, f]) => renderSchemaRow(k, f, depth + 1))}
    </div>
  );

  const renderNavigationFooter = () => (
    <div className="pt-16 mt-24 border-t border-secondary flex items-center justify-between gap-8 pb-32">
      {prevItem ? (
        <button 
          onClick={() => onNavigate(prevItem.id, prevItem.type)}
          className="flex-1 group p-8 rounded-3xl bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer text-left relative overflow-hidden"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-3 font-black uppercase text-[10px] tracking-widest opacity-60">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Previous
          </div>
          <span className="text-[18px] font-black text-primary tracking-tighter leading-tight relative z-10">{prevItem.title}</span>
        </button>
      ) : <div className="flex-1" />}
      
      {nextItem ? (
        <button 
          onClick={() => onNavigate(nextItem.id, nextItem.type)}
          className="flex-1 group p-8 rounded-3xl bg-primary text-primary-foreground transition-all cursor-pointer text-right relative overflow-hidden shadow-xl shadow-primary/10"
        >
          <div className="flex items-center justify-end gap-2 text-primary-foreground/50 mb-3 font-black uppercase text-[10px] tracking-widest">
             Next <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
          <span className="text-[18px] font-black tracking-tighter leading-tight">{nextItem.title}</span>
        </button>
      ) : <div className="flex-1" />}
    </div>
  );

  if (type === 'guide') {
    const guide = item as GuideSection;
    return (
      <div className="max-w-4xl mx-auto py-24 px-4">
        <div className="prose prose-neutral prose-headings:tracking-tighter prose-h1:text-6xl prose-h1:font-black prose-h1:mb-16 prose-h3:uppercase prose-h3:tracking-widest prose-h3:text-[11px] prose-h3:font-bold prose-h3:text-muted-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-[18px] prose-pre:bg-secondary/50 prose-pre:rounded-3xl prose-pre:p-10 prose-pre:border-none prose-code:text-primary max-w-none">
          <ReactMarkdown>{guide.content}</ReactMarkdown>
        </div>
        {renderNavigationFooter()}
      </div>
    );
  }

  const endpoint = item as ApiEndpoint;

  return (
    <div className="max-w-4xl mx-auto py-24 px-4">
      <div className="flex items-center gap-4 mb-8">
        <span className={cn(
          "text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase",
          getMethodColor(endpoint.method)
        )}>
          {endpoint.method}
        </span>
        <code className="text-[11px] font-mono font-bold text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full">
          {endpoint.path}
        </code>
      </div>

      <h1 className="text-5xl font-black tracking-tighter mb-16 text-primary leading-[1.1]">
        {endpoint.description}
      </h1>

      {/* Body Params Section */}
      {endpoint.body && (
        <div className="mb-20">
          <h4 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-8">Body Parameters</h4>
          <div className="space-y-0 bg-secondary/10 rounded-3xl overflow-hidden">
            {Object.entries(endpoint.body).map(([key, info]) => (
              <div key={key} className="grid grid-cols-[1.5fr_2fr] gap-12 py-8 px-10 border-b border-secondary/50 items-start last:border-b-0">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-[15px] text-primary tracking-tight">{key}</span>
                    {info.required && <span className="text-[9px] text-destructive font-black uppercase tracking-widest">Required</span>}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono opacity-80 uppercase tracking-widest">{info.type}</span>
                </div>
                <div className="space-y-5">
                  <p className="text-[14px] text-muted-foreground font-medium leading-relaxed">{info.description}</p>
                  <input 
                    type="text"
                    value={formValues[key] || ''}
                    onChange={(e) => onFormChange(key, e.target.value)}
                    placeholder={`Example: ${info.defaultValue || '...'}`}
                    className="w-full bg-background border-none rounded-2xl px-6 py-3.5 text-[13px] font-bold text-primary placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/5 transition-all outline-none shadow-sm shadow-black/5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responses Section */}
      <div className="mb-20">
        <h4 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-8">Response Patterns</h4>
        <div className="space-y-4">
          {endpoint.responses.map((resp) => (
            <div key={resp.status} className={cn(
              "rounded-3xl transition-all overflow-hidden relative",
              activeResponseStatus === resp.status ? "bg-background shadow-2xl shadow-black/5 ring-1 ring-primary/5" : "bg-secondary/30 hover:bg-secondary/50"
            )}>
              <button 
                onClick={() => onResponseStatusChange(resp.status)}
                className="w-full px-10 py-6 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all ring-4",
                    resp.status < 300 ? "bg-emerald-500 ring-emerald-500/10" : "bg-rose-500 ring-rose-500/10"
                  )} />
                  <div className="flex flex-col text-left">
                    <span className="text-[15px] font-black text-primary tracking-tight">
                      {resp.status} — <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold ml-2">{resp.description}</span>
                    </span>
                  </div>
                </div>
                {activeResponseStatus === resp.status ? <ChevronDown className="h-5 w-5 opacity-40" /> : <ChevronRight className="h-5 w-5 opacity-40" />}
              </button>
              
              {activeResponseStatus === resp.status && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <div className="px-10 pb-10 pt-4 bg-secondary/10">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-6 flex items-center gap-2">
                       Schema Definition
                    </h5>
                    {resp.schema ? (
                      <div className="rounded-2xl bg-background shadow-sm ring-1 ring-primary/5">
                        {Object.entries(resp.schema).map(([k, f]) => renderSchemaRow(k, f))}
                      </div>
                    ) : (
                      <p className="text-[14px] text-muted-foreground/60 italic font-medium py-4">No structured schema defined for this response.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {renderNavigationFooter()}
    </div>
  );
}
