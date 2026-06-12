'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PORTAL_GROUPS, GUIDE_DATA } from '../data/portal-data';
import { BookOpen, Terminal, ChevronRight, Search } from 'lucide-react';
import { BrandLogo } from '@/components/shared/BrandLogo';

interface DocsSidebarProps {
  activeCategory?: string;
  activeEndpoint?: string;
}

export function DocsSidebar({ activeCategory, activeEndpoint }: DocsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);
  const resolvedCategory = activeCategory || segments[1] || 'guides';
  const resolvedEndpoint = activeEndpoint || segments[2] || 'getting-started';

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'POST':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'PATCH':
      case 'PUT':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'DELETE':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const query = searchQuery.toLowerCase().trim();

  const filteredGuides = GUIDE_DATA.filter((guide) =>
    guide.title.toLowerCase().includes(query) ||
    guide.content.toLowerCase().includes(query)
  );

  const filteredGroups = PORTAL_GROUPS.map((group) => {
    const filteredEndpoints = group.endpoints.filter((endpoint) =>
      endpoint.description.toLowerCase().includes(query) ||
      endpoint.path.toLowerCase().includes(query) ||
      endpoint.method.toLowerCase().includes(query) ||
      group.name.toLowerCase().includes(query)
    );
    return {
      ...group,
      endpoints: filteredEndpoints,
    };
  }).filter((group) => group.endpoints.length > 0);

  return (
    <aside className="w-full lg:w-72 border-r border-gray-800 bg-gray-950/60 backdrop-blur-xl shrink-0 flex flex-col h-full select-none">
      {/* Platform Branding Header */}
      <div className="p-4 border-b border-gray-800/60 flex flex-col items-center justify-center gap-3 shrink-0 text-center">
        <Link href="/" prefetch={false} className="inline-block cursor-pointer transition-opacity hover:opacity-90">
          <BrandLogo width={140} height={35} />
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold tracking-wide uppercase">
            Partner Portal
          </span>
          <span className="text-[11px] text-gray-500 font-medium">API Docs</span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="p-3 border-b border-gray-800/60 bg-gray-950/40 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search docs, routes, methods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-gray-900 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 p-1 text-gray-500 hover:text-gray-300 cursor-pointer"
              title="Clear search"
            >
              <span className="text-[10px] font-bold">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Groups Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filteredGuides.length === 0 && filteredGroups.length === 0 ? (
          <div className="text-center py-8 px-4 text-gray-600 text-xs space-y-1">
            <p className="font-medium text-gray-500">No matching endpoints found</p>
            <p className="text-[11px]">Try searching with a different term or query path.</p>
          </div>
        ) : (
          <>
            {/* Integration Guides */}
            {filteredGuides.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Core Guides</span>
                </div>
                <div className="space-y-0.5">
                  {filteredGuides.map((guide) => {
                    const isActive = resolvedCategory === 'guides' && resolvedEndpoint === guide.id;
                    return (
                      <Link
                        key={guide.id}
                        href={`/docs/guides/${guide.id}`}
                        prefetch={false}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer border ${isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
                          }`}
                      >
                        <span className="truncate">{guide.title}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* API Reference Groups */}
            {filteredGroups.map((group) => (
              <div key={group.categorySlug} className="space-y-1.5">
                <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span className="truncate">{group.name}</span>
                </div>
                <div className="space-y-0.5">
                  {group.endpoints.map((endpoint) => {
                    const isActive = resolvedCategory === group.categorySlug && resolvedEndpoint === endpoint.id;
                    return (
                      <Link
                        key={endpoint.id}
                        href={`/docs/${group.categorySlug}/${endpoint.id}`}
                        prefetch={false}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 group cursor-pointer border ${isActive
                          ? 'bg-gray-900/80 text-white border-gray-800 shadow-sm shadow-black/20'
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-900/40'
                          }`}
                      >
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold tracking-tighter w-12 text-center shrink-0 transition-colors ${getMethodColor(
                            endpoint.method
                          )}`}
                        >
                          {endpoint.method}
                        </span>
                        <span className="truncate flex-1 text-xs">{endpoint.description}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
