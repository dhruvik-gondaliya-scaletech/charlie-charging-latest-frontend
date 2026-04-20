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
    <div className="w-[280px] bg-neutral-900/40 flex flex-col h-screen sticky top-0 backdrop-blur-2xl border-r border-white/5">
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3 mb-6">
           <div className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center rounded-xl text-[12px] font-black tracking-tighter shadow-lg shadow-primary/30">CC</div>
           <div className="flex flex-col">
             <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-white leading-none mb-1">Charlie Charging</h2>
             <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">Partner Ecosystem</span>
           </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search API..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[12px] font-bold text-white placeholder:text-white/20 focus:ring-1 focus:ring-primary/20 focus:bg-white/10 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 pb-8 custom-scrollbar-dark">
        {/* Guides Section */}
        {filteredGuides.length > 0 && (
          <div className="mb-8">
            <h3 className="px-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              Getting Started
            </h3>
            <div className="space-y-1 px-3">
              {filteredGuides.map(guide => (
                <button
                  key={guide.id}
                  onClick={() => onSelect(guide.id, 'guide')}
                  className={cn(
                    "w-full px-4 py-2 flex items-center gap-3 text-[13px] font-bold transition-all text-left cursor-pointer relative rounded-xl group",
                    selectedType === 'guide' && selectedId === guide.id
                      ? "text-primary bg-primary/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {selectedType === 'guide' && selectedId === guide.id && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  )}
                  <BookOpen className={cn("w-3.5 h-3.5 shrink-0 transition-opacity", selectedType === 'guide' && selectedId === guide.id ? "opacity-100" : "opacity-40 group-hover:opacity-60")} />
                  {guide.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* API Reference Section */}
        <div>
          <h3 className="px-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            Endpoints
          </h3>
          {filteredGroups.map((group) => (
            <div key={group.name} className="mb-4 px-3">
              <button 
                onClick={() => toggleGroup(group.name)}
                className="w-full px-4 py-1.5 flex items-center justify-between text-white/40 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="text-[9px] font-black uppercase tracking-widest">{group.name}</span>
                {openGroups[group.name] ? <ChevronDown className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" /> : <ChevronRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />}
              </button>
              
              {openGroups[group.name] && (
                <div className="mt-1 space-y-0.5">
                  {group.endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => onSelect(endpoint.id, 'api')}
                      className={cn(
                        "w-full px-4 py-2 flex items-center justify-between transition-all text-left cursor-pointer relative rounded-xl group",
                        selectedType === 'api' && selectedId === endpoint.id 
                          ? "text-primary bg-primary/10" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {selectedType === 'api' && selectedId === endpoint.id && (
                        <motion.div layoutId="active-indicator-api" className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                      )}
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className={cn(
                          "text-[8px] font-black px-1.5 py-0.5 rounded leading-none min-w-[36px] text-center uppercase tracking-tighter border",
                          getMethodColor(endpoint.method),
                          selectedType === 'api' && selectedId === endpoint.id 
                            ? "border-primary/20 bg-primary/5" 
                            : "border-white/5 bg-white/5"
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
