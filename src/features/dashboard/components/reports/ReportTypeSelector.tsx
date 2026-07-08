'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import {
  FileSpreadsheet,
  BarChart2,
  CheckCircle2,
  Hourglass,
} from 'lucide-react';

export type Step = 'select-type' | 'configure-sessions' | 'configure-intervals';

interface ReportTypeSelectorProps {
  onSelectStep: (step: Step) => void;
}

export function ReportTypeSelector({ onSelectStep }: ReportTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {/* Sessions Option */}
      <Card
        onClick={() => onSelectStep('configure-sessions')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-primary group-hover:text-primary/80 transition-colors">
                Charging Sessions
              </h3>
              <CheckCircle2 className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
              Export granular list of raw charging sessions, including energy consumption, duration, and user details.
            </p>
          </div>
        </div>
      </Card>

      {/* Intervals Option */}
      <Card
        onClick={() => onSelectStep('configure-intervals')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
            <BarChart2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">
                Interval Meter Values
              </h3>
              <CheckCircle2 className="h-5 w-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
              Export clock-aligned interval blocks with energy, peak demand, and compliance data. Choose flat per-session slices or aggregated grid demand rows.
            </p>
          </div>
        </div>
      </Card>

      {/* Revenue Summary Option - Coming Soon */}
      <Card className="relative overflow-hidden rounded-xl border border-border/60 bg-muted/20 p-5 opacity-60">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-muted text-muted-foreground/60">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-muted-foreground">
                Revenue & Tariff Summary
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground flex items-center gap-1">
                <Hourglass className="h-3 w-3" /> Coming Soon
              </span>
            </div>
            <p className="text-muted-foreground/60 text-sm mt-1 leading-relaxed">
              Export financial transaction summaries, applied tariffs, tax items, and billing details.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
