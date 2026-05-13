'use strict';

import React from 'react';
import Link from 'next/link';
import { PORTAL_GROUPS, GUIDE_DATA } from '../data/portal-data';
import { BookOpen, Code2, Terminal, ChevronRight } from 'lucide-react';

interface DocsSidebarProps {
  activeCategory: string;
  activeEndpoint: string;
}

export function DocsSidebar({ activeCategory, activeEndpoint }: DocsSidebarProps) {
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

  return (
    <aside className="w-full lg:w-72 border-r border-gray-800 bg-gray-950/60 backdrop-blur-xl shrink-0 flex flex-col h-full select-none">
      {/* Platform Branding Header */}
      <div className="p-5 border-b border-gray-800/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Code2 className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-200 text-sm tracking-wide">Partner Portal</h2>
          <p className="text-xs text-gray-500">API Documentation v2</p>
        </div>
      </div>

      {/* Navigation Groups Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {/* Integration Guides */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Core Guides</span>
          </div>
          <div className="space-y-0.5">
            {GUIDE_DATA.map((guide) => {
              const isActive = activeCategory === 'guides' && activeEndpoint === guide.id;
              return (
                <Link
                  key={guide.id}
                  href={`/docs/guides/${guide.id}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
                  }`}
                >
                  <span className="truncate">{guide.title}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* API Reference Groups */}
        {PORTAL_GROUPS.map((group) => (
          <div key={group.categorySlug} className="space-y-1.5">
            <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate">{group.name}</span>
            </div>
            <div className="space-y-0.5">
              {group.endpoints.map((endpoint) => {
                const isActive = activeCategory === group.categorySlug && activeEndpoint === endpoint.id;
                return (
                  <Link
                    key={endpoint.id}
                    href={`/docs/${group.categorySlug}/${endpoint.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                      isActive
                        ? 'bg-gray-900/80 text-white font-medium border border-gray-800 shadow-sm shadow-black/20'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/40'
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
      </div>
    </aside>
  );
}
