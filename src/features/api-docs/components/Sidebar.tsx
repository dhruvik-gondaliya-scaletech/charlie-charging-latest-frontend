'use client';

import { Search, ChevronRight, ChevronDown, ListCheck, BookOpen } from 'lucide-react';
import { ApiGroup, GUIDE_DATA } from '../data/api-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  groups: ApiGroup[];
  selectedId: string;
  onSelect: (id: string, type: 'api' | 'guide') => void;
  selectedType: 'api' | 'guide';
}

export function Sidebar({ groups, selectedId, onSelect, selectedType }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    groups.reduce((acc, g) => ({ ...acc, [g.name]: true }), {})
  );

  const filteredGuides = GUIDE_DATA.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));
  
  const filteredGroups = groups.map(group => ({
    ...group,
    endpoints: group.endpoints.filter(e => 
      e.path.toLowerCase().includes(search.toLowerCase()) || 
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      group.name.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.endpoints.length > 0);

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-500 bg-emerald-500/5';
      case 'POST': return 'text-blue-500 bg-blue-500/5';
      case 'PUT': return 'text-amber-500 bg-amber-500/5';
      case 'PATCH': return 'text-purple-500 bg-purple-500/5';
      case 'DELETE': return 'text-rose-500 bg-rose-500/5';
      default: return 'text-neutral-500 bg-neutral-500/5';
    }
  };

  return (
    <div className="w-[320px] bg-secondary/30 flex flex-col h-screen sticky top-0 backdrop-blur-3xl border-r border-primary/5">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 mb-10">
           <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl text-[14px] font-black tracking-tighter shadow-lg shadow-primary/20">CC</div>
           <div className="flex flex-col">
             <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-1.5">Charlie Charging</h2>
             <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none">Partner Ecosystem</span>
           </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search API reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-transparent rounded-2xl text-[13px] font-bold text-foreground placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/10 focus:bg-background focus:border-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-12">
        {/* Guides Section */}
        {filteredGuides.length > 0 && (
          <div className="mb-12">
            <h3 className="px-10 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-6 flex items-center gap-2">
              Getting Started
            </h3>
            <div className="space-y-1 px-4">
              {filteredGuides.map(guide => (
                <button
                  key={guide.id}
                  onClick={() => onSelect(guide.id, 'guide')}
                  className={cn(
                    "w-full px-6 py-3 flex items-center gap-3 text-[14px] font-bold transition-all text-left cursor-pointer relative rounded-xl group",
                    selectedType === 'guide' && selectedId === guide.id
                      ? "text-primary bg-primary/5 shadow-sm"
                      : "text-muted-foreground/70 hover:text-primary hover:bg-secondary/40"
                  )}
                >
                  {selectedType === 'guide' && selectedId === guide.id && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
                  )}
                  <BookOpen className={cn("w-4 h-4 shrink-0 opacity-40", selectedType === 'guide' && selectedId === guide.id && "opacity-100")} />
                  {guide.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* API Reference Section */}
        <div>
          <h3 className="px-10 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-6 flex items-center gap-2">
            Endpoints Reference
          </h3>
          {filteredGroups.map((group) => (
            <div key={group.name} className="mb-6 px-4">
              <button 
                onClick={() => toggleGroup(group.name)}
                className="w-full px-6 py-2 flex items-center justify-between text-muted-foreground/60 hover:text-primary transition-colors cursor-pointer group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{group.name}</span>
                {openGroups[group.name] ? <ChevronDown className="h-4 w-4 opacity-40" /> : <ChevronRight className="h-4 w-4 opacity-40" />}
              </button>
              
              {openGroups[group.name] && (
                <div className="mt-2 space-y-1">
                  {group.endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => onSelect(endpoint.id, 'api')}
                      className={cn(
                        "w-full px-6 py-3 flex items-center justify-between transition-all text-left cursor-pointer relative rounded-xl group",
                        selectedType === 'api' && selectedId === endpoint.id 
                          ? "text-primary bg-primary/5 shadow-sm" 
                          : "text-muted-foreground/70 hover:text-primary hover:bg-secondary/40"
                      )}
                    >
                      {selectedType === 'api' && selectedId === endpoint.id && (
                        <motion.div layoutId="active-indicator-api" className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
                      )}
                      <div className="flex items-center gap-4 overflow-hidden">
                        <span className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded-md leading-none min-w-[42px] text-center uppercase tracking-tighter border border-transparent",
                          getMethodColor(endpoint.method),
                          selectedType === 'api' && selectedId === endpoint.id && "border-current/10"
                        )}>
                          {endpoint.method}
                        </span>
                        <span className="text-[13px] font-bold truncate tracking-tight">
                          {endpoint.path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
