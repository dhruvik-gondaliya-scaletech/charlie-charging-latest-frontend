'use client';

import { Search, ChevronRight, ChevronDown, ListCheck, BookOpen } from 'lucide-react';
import { ApiGroup, GUIDE_DATA } from '../data/api-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
    <div className="w-[300px] bg-secondary/50 flex flex-col h-screen sticky top-0 backdrop-blur-xl">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
           <div className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center rounded-lg text-[12px] font-black tracking-tighter">CC</div>
           <div className="flex flex-col">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-1">Charlie Charging</h2>
             <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Developer API</span>
           </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search documentation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background/50 border-none rounded-xl text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/10 focus:bg-background transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-12">
        {/* Guides Section */}
        {filteredGuides.length > 0 && (
          <div className="mb-10 mt-2">
            <h3 className="px-8 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-4 flex items-center gap-2">
              Guides
            </h3>
            <div className="space-y-1">
              {filteredGuides.map(guide => (
                <button
                  key={guide.id}
                  onClick={() => onSelect(guide.id, 'guide')}
                  className={cn(
                    "w-full px-8 py-2.5 flex items-center gap-3 text-[13.5px] font-semibold transition-all text-left cursor-pointer relative group",
                    selectedType === 'guide' && selectedId === guide.id
                      ? "text-primary translate-x-1"
                      : "text-muted-foreground hover:text-primary hover:translate-x-1"
                  )}
                >
                  {selectedType === 'guide' && selectedId === guide.id && (
                    <div className="absolute left-0 w-1 h-4 bg-primary rounded-r-full" />
                  )}
                  {guide.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* API Reference Section */}
        <div>
          <h3 className="px-8 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-4 flex items-center gap-2">
            API Reference
          </h3>
          {filteredGroups.map((group) => (
            <div key={group.name} className="mb-4">
              <button 
                onClick={() => toggleGroup(group.name)}
                className="w-full px-8 py-2 flex items-center justify-between text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{group.name}</span>
                {openGroups[group.name] ? <ChevronDown className="h-3.5 w-3.5 opacity-50" /> : <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
              </button>
              
              {openGroups[group.name] && (
                <div className="mt-1.5 space-y-0.5">
                  {group.endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => onSelect(endpoint.id, 'api')}
                      className={cn(
                        "w-full px-8 py-2.5 flex items-center justify-between transition-all text-left cursor-pointer relative group",
                        selectedType === 'api' && selectedId === endpoint.id 
                          ? "text-primary translate-x-1" 
                          : "text-muted-foreground hover:text-primary hover:translate-x-1"
                      )}
                    >
                      {selectedType === 'api' && selectedId === endpoint.id && (
                        <div className="absolute left-0 w-1 h-4 bg-primary rounded-r-full" />
                      )}
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className={cn(
                          "text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none min-w-[40px] text-center uppercase tracking-tighter",
                          getMethodColor(endpoint.method)
                        )}>
                          {endpoint.method}
                        </span>
                        <span className="text-[13px] font-semibold truncate tracking-tight">
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
