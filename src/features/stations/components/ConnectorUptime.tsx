'use client';

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table } from '@/components/shared/Table';
import { DatePicker } from '@/components/shared/DatePicker';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { BackButton } from '@/components/shared/BackButton';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  FileSpreadsheet,
  Info,
  Layers,
  FileText,
  Percent,
  Zap,
  Wifi,
  WifiOff,
  Hammer,
  CloudLightning,
  Wrench,
  Car,
  HelpCircle,
  Link,
  Tag,
} from 'lucide-react';
import {
  ConnectorDowntimeInterval,
  DowntimeClassification,
  DowntimeReasonCode,
} from '@/services/compliance.service';
import { cn } from '@/lib/utils';

interface ReportItem {
  date?: string;
  month?: string;
  quarter?: string;
  evseId: string;
  connectorPortId: number;
  totalTimeSeconds: number;
  excludedTimeSeconds: number;
  outageTimeSeconds: number;
  uptimePercentage: number | null;
}

interface ConnectorUptimeProps {
  station: any;
  connector: any;
  backHref: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
  handleDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  activeReportTab: 'logs' | 'daily' | 'monthly' | 'quarterly';
  setActiveReportTab: (tab: 'logs' | 'daily' | 'monthly' | 'quarterly') => void;
  uptimeData: any;
  isUptimeLoading: boolean;
  downtimeIntervals: ConnectorDowntimeInterval[] | undefined;
  isIntervalsLoading: boolean;
  complianceReport: any;
  isReportLoading: boolean;

  // Override Modal States & Callbacks
  overrideModalOpen: boolean;
  setOverrideModalOpen: (open: boolean) => void;
  selectedInterval: ConnectorDowntimeInterval | null;
  newClassification: DowntimeClassification;
  setNewClassification: (classification: DowntimeClassification) => void;
  newReason: DowntimeReasonCode;
  setNewReason: (reason: DowntimeReasonCode) => void;
  ticketNumber: string;
  setTicketNumber: (num: string) => void;
  evidence: string;
  setEvidence: (url: string) => void;
  overrideNotes: string;
  setOverrideNotes: (notes: string) => void;
  isSavingOverride: boolean;
  handleSubmitOverride: (e: React.FormEvent) => void;
  handleOpenOverride: (interval: ConnectorDowntimeInterval) => void;
}

export function ConnectorUptime({
  station,
  connector,
  backHref,
  dateRange,
  handleDateRangeChange,
  activeReportTab,
  setActiveReportTab,
  uptimeData,
  isUptimeLoading,
  downtimeIntervals,
  isIntervalsLoading,
  complianceReport,
  isReportLoading,
  overrideModalOpen,
  setOverrideModalOpen,
  selectedInterval,
  newClassification,
  setNewClassification,
  newReason,
  setNewReason,
  ticketNumber,
  setTicketNumber,
  evidence,
  setEvidence,
  overrideNotes,
  setOverrideNotes,
  isSavingOverride,
  handleSubmitOverride,
  handleOpenOverride,
}: ConnectorUptimeProps) {
  // Helper: Format duration in seconds to human readable form
  const formatDuration = (seconds: number | null): string => {
    if (seconds === null) return 'Active';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) return `${hours}h ${remainingMinutes}m`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h ${remainingMinutes}m`;
  };

  // Helper: Format date strings
  const formatDateTime = (dateStr: string | null): string => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Helper: Format date and time vertically
  const formatDateTimeVertical = (dateStr: string | null): React.ReactNode => {
    if (!dateStr) return <span className="text-muted-foreground font-mono text-xs">N/A</span>;
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
      return <span className="text-muted-foreground font-mono text-xs">N/A</span>;
    }
    const date = dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const time = dateObj.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return (
      <div className="flex flex-col font-mono text-xs leading-normal">
        <span className="text-foreground font-medium whitespace-nowrap">{date}</span>
        <span className="text-muted-foreground text-[11px] mt-0.5 whitespace-nowrap">{time}</span>
      </div>
    );
  };

  // Helper: Clean up Reason Codes
  const formatReasonCode = (code: string): string => {
    return code
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const downtimeColumns = useMemo<ColumnDef<ConnectorDowntimeInterval>[]>(() => [
    {
      id: 'classification',
      header: 'Classification',
      accessorKey: 'classification',
      cell: ({ row }) => {
        const interval = row.original;
        return (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full font-bold uppercase tracking-wider text-[9px] px-2.5 py-0.5",
              interval.classification === DowntimeClassification.OUTAGE
                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
            )}
          >
            {interval.classification}
          </Badge>
        );
      }
    },
    {
      id: 'reasonCode',
      header: 'Reason',
      accessorKey: 'reasonCode',
      cell: ({ row }) => formatReasonCode(row.original.reasonCode)
    },
    {
      id: 'startTime',
      header: 'Start Time',
      accessorKey: 'startTime',
      cell: ({ row }) => formatDateTimeVertical(row.original.startTime)
    },
    {
      id: 'endTime',
      header: 'End Time',
      accessorKey: 'endTime',
      cell: ({ row }) => {
        const interval = row.original;
        return interval.endTime ? (
          formatDateTimeVertical(interval.endTime)
        ) : (
          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-full font-extrabold uppercase tracking-widest text-[8px] px-2 py-0.5">
            Active Outage
          </Badge>
        );
      }
    },
    {
      id: 'duration',
      header: 'Duration',
      accessorKey: 'durationSeconds',
      cell: ({ row }) => (
        <span className="font-semibold text-sm whitespace-nowrap flex">
          {formatDuration(row.original.durationSeconds)}
        </span>
      )
    },
    {
      id: 'source',
      header: 'Source',
      accessorKey: 'autoGenerated',
      cell: ({ row }) => (
        <Badge variant="outline" className="rounded-full text-[10px] font-semibold border-border/60">
          {row.original.autoGenerated ? 'Auto Logged' : 'Manual Override'}
        </Badge>
      )
    },
    {
      id: 'audit',
      header: 'Audit / Ticket',
      cell: ({ row }) => {
        const interval = row.original;
        return (
          <div className="max-w-[150px] truncate text-xs text-muted-foreground font-medium">
            {interval.ticketNumber && (
              <div className="font-mono text-foreground font-semibold">
                Ticket: {interval.ticketNumber}
              </div>
            )}
            {interval.evidence && (
              <a
                href={interval.evidence}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline flex items-center gap-1 font-semibold text-[10px] uppercase tracking-wider mt-0.5"
              >
                <Link className="h-3 w-3" /> Proof Link
              </a>
            )}
            {interval.overrideNotes && (
              <div className="italic text-muted-foreground truncate" title={interval.overrideNotes}>
                &ldquo;{interval.overrideNotes}&rdquo;
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-start">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="font-bold text-xs text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
            onClick={() => handleOpenOverride(row.original)}
          >
            Reclassify
          </Button>
        </div>
      )
    }
  ], [handleOpenOverride]);

  const reportColumns = useMemo<ColumnDef<ReportItem>[]>(() => [
    {
      id: 'period',
      header: 'Period',
      cell: ({ row }) => (
        <span className="font-bold text-sm font-mono">
          {row.original.date || row.original.month || row.original.quarter || 'N/A'}
        </span>
      )
    },
    {
      id: 'evseId',
      header: 'EVSE ID',
      accessorKey: 'evseId',
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">
          {row.original.evseId || 'N/A'}
        </span>
      )
    },
    {
      id: 'port',
      header: 'Port',
      accessorKey: 'connectorPortId',
      cell: ({ row }) => (
        <span className="text-muted-foreground font-semibold text-sm">
          Port {row.original.connectorPortId}
        </span>
      )
    },
    {
      id: 'totalTime',
      header: 'Total Time',
      accessorKey: 'totalTimeSeconds',
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium text-xs font-mono">
          {formatDuration(row.original.totalTimeSeconds)}
        </span>
      )
    },
    {
      id: 'excludedTime',
      header: 'Excluded Duration',
      accessorKey: 'excludedTimeSeconds',
      cell: ({ row }) => (
        <span className="text-indigo-500 font-semibold text-xs font-mono">
          {formatDuration(row.original.excludedTimeSeconds)}
        </span>
      )
    },
    {
      id: 'outageTime',
      header: 'Outage Duration',
      accessorKey: 'outageTimeSeconds',
      cell: ({ row }) => (
        <span className="text-rose-500 font-semibold text-xs font-mono">
          {formatDuration(row.original.outageTimeSeconds)}
        </span>
      )
    },
    {
      id: 'uptime',
      header: 'Uptime Compliance',
      accessorKey: 'uptimePercentage',
      cell: ({ row }) => {
        const pct = row.original.uptimePercentage;
        if (pct === null || pct === undefined) {
          return (
            <div className="flex justify-end">
              <span className="font-black text-sm font-mono px-2 py-1 rounded-lg text-muted-foreground bg-muted/20">
                N/A
              </span>
            </div>
          );
        }
        return (
          <div className="flex justify-start">
            <span className={cn(
              "font-black text-sm font-mono px-2 py-1 rounded-lg",
              pct >= 97
                ? "text-emerald-500 bg-emerald-500/10"
                : pct >= 95
                  ? "text-amber-500 bg-amber-500/10"
                  : "text-rose-500 bg-rose-500/10"
            )}>
              {pct.toFixed(2)}%
            </span>
          </div>
        );
      }
    }
  ], []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto"
    >
      {/* Header with Back Button */}
      <motion.div variants={fadeInUp} className="space-y-1">
        <BackButton href={backHref} label={`Return to ${station.name}`} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-foreground truncate">
            Connector Uptime Compliance
          </h1>
          <Badge variant="outline" className="w-fit bg-primary/5 text-primary border-primary/25 font-black uppercase tracking-widest text-[10px] px-3.5 py-1 rounded-full shadow-sm">
            Port #{connector.connectorId} ({connector.type})
          </Badge>
        </div>
      </motion.div>

      {/* Date Picker (Top-level filter) */}
      <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-card border border-border/40 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h3 className="text-base font-black tracking-tight">Compliance Duration Scope</h3>
          <p className="text-xs text-muted-foreground font-medium">
            Select a custom date range to recalculate uptime averages and intervals.
          </p>
        </div>
        <div className="space-y-1.5 w-full sm:w-auto">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date Range</Label>
          <DatePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            className="w-full sm:w-72"
          />
        </div>
      </motion.div>

      {/* Stats Cards Section */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Uptime Percentage"
          value={
            uptimeData
              ? uptimeData.uptimePercentage !== null && uptimeData.uptimePercentage !== undefined
                ? `${uptimeData.uptimePercentage.toFixed(2)}%`
                : 'N/A'
              : '0.00%'
          }
          icon={Percent}
          color={
            uptimeData?.uptimePercentage !== null && uptimeData?.uptimePercentage !== undefined
              ? uptimeData.uptimePercentage >= 97
                ? "text-emerald-500"
                : uptimeData.uptimePercentage >= 95
                  ? "text-amber-500"
                  : "text-rose-500"
              : "text-muted-foreground"
          }
          bottomRightGlobe='bg-gradient-to-br from-emerald-500 to-green-500/80'
          description="NEVI Goal: >= 97.00%"
          loading={isUptimeLoading}
        />

        <StatCard
          title="Total Checked Time"
          value={uptimeData ? formatDuration(uptimeData.totalTimeSeconds) : '0s'}
          icon={Clock}
          color="text-blue-500"
          bottomRightGlobe='bg-gradient-to-br from-blue-500 to-cyan-500/80'
          description="Total operational logging duration scoped"
          loading={isUptimeLoading}
        />

        <StatCard
          title="Outage Time"
          value={uptimeData ? formatDuration(uptimeData.outageTimeSeconds) : '0s'}
          icon={ShieldAlert}
          color="text-rose-500"
          bottomRightGlobe='bg-gradient-to-br from-rose-500 to-pink-500/80'
          description="Unexcused downtime counts against uptime"
          loading={isUptimeLoading}
        />

        <StatCard
          title="Excluded Time"
          value={uptimeData ? formatDuration(uptimeData.excludedTimeSeconds) : '0s'}
          icon={ShieldCheck}
          color="text-indigo-500"
          bottomRightGlobe='bg-gradient-to-br from-indigo-500 to-purple-500/80'
          description="Excused delays excluded from uptime formula"
          loading={isUptimeLoading}
        />
      </motion.div>

      {/* Tabs and Data Tables */}
      <motion.div variants={fadeInUp} className="space-y-4">
        <div className="flex border-b border-border/40 pb-px overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'logs', label: 'Downtime Intervals Log', icon: Info },
            { id: 'daily', label: 'Daily Reports', icon: FileSpreadsheet },
            { id: 'monthly', label: 'Monthly Reports', icon: FileText },
            { id: 'quarterly', label: 'Quarterly Reports', icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as 'logs' | 'daily' | 'monthly' | 'quarterly')}
              className={cn(
                "px-5 py-3 border-b-2 font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer",
                activeReportTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Downtime Log */}
        {activeReportTab === 'logs' && (
          <Card className="border-border/40 bg-card rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-black">Connector Outages & Exclusions</CardTitle>
                <CardDescription className="text-xs font-medium mt-1">
                  History of inactive state intervals detected for this connector.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Table
                data={downtimeIntervals || []}
                columns={downtimeColumns}
                isLoading={isIntervalsLoading}
                pageSize={10}
                showPagination={true}
                emptyState={
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="p-4 bg-muted/20 text-muted-foreground/80 rounded-full mb-3">
                      <ShieldCheck className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h4 className="font-bold text-sm">No Downtime Intervals Logged</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                      This connector port is fully compliant and has not experienced outages or excluded downtimes.
                    </p>
                  </div>
                }
              />
            </CardContent>
          </Card>
        )}

        {/* Tab Content: Periodic Compliance Reports */}
        {activeReportTab !== 'logs' && (
          <Card className="border-border/40 bg-card rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-black capitalize">{activeReportTab} Compliance Summaries</CardTitle>
                <CardDescription className="text-xs font-medium mt-1">
                  Uptime performance reports aggregated on a {activeReportTab} basis.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Table
                data={complianceReport || []}
                columns={reportColumns}
                isLoading={isReportLoading}
                pageSize={10}
                showPagination={true}
                emptyState={
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="p-4 bg-muted/20 text-muted-foreground/80 rounded-full mb-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-bold text-sm">No Report Data</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                      No report summaries found for the selected dates and connector.
                    </p>
                  </div>
                }
              />
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Override Reclassification Dialog Modal */}
      {selectedInterval && (
        <AnimatedModal
          isOpen={overrideModalOpen}
          onClose={() => setOverrideModalOpen(false)}
          title="Administrative Downtime Override"
          description={`Reclassify downtime interval starting ${formatDateTime(selectedInterval.startTime)}`}
          size="3xl"
        >
          <form onSubmit={handleSubmitOverride} className="space-y-4">
            {/* Info Block */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 border border-border/40 rounded-2xl">
              <div className="flex flex-col items-center justify-center p-3 bg-background/50 border border-border/20 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Current Type</span>
                <Badge variant="outline" className={cn(
                  "font-bold text-[9px]",
                  selectedInterval.classification === DowntimeClassification.OUTAGE ? 'text-rose-500 border-rose-500/20 bg-rose-500/10' : 'text-indigo-500 border-indigo-500/20 bg-indigo-500/10'
                )}>
                  {selectedInterval.classification}
                </Badge>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-background/50 border border-border/20 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Start Time</span>
                <span className="font-mono text-foreground font-semibold leading-none mt-1">
                  {new Date(selectedInterval.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -  {new Date(selectedInterval.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-background/50 border border-border/20 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Duration</span>
                <div className="flex items-center gap-1 mt-1 text-foreground font-black text-xs leading-none">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{formatDuration(selectedInterval.durationSeconds)}</span>
                </div>
              </div>
            </div>

            {/* Target Classification Cards */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Classification</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setNewClassification(DowntimeClassification.OUTAGE)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
                    newClassification === DowntimeClassification.OUTAGE
                      ? "border-rose-500 bg-rose-500/10 ring-1 ring-rose-500"
                      : "border-border bg-muted/10 hover:bg-muted/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={cn("h-4 w-4", newClassification === DowntimeClassification.OUTAGE ? "text-rose-500" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", newClassification === DowntimeClassification.OUTAGE ? "text-rose-500" : "text-muted-foreground")}>Outage</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-2 leading-relaxed font-medium">
                    Downtime will count against the station&apos;s compliant uptime metrics.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewClassification(DowntimeClassification.EXCLUDED)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
                    newClassification === DowntimeClassification.EXCLUDED
                      ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                      : "border-border bg-muted/10 hover:bg-muted/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={cn("h-4 w-4", newClassification === DowntimeClassification.EXCLUDED ? "text-indigo-500" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", newClassification === DowntimeClassification.EXCLUDED ? "text-indigo-500" : "text-muted-foreground")}>Excluded</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-2 leading-relaxed font-medium">
                    Excused downtime under NEVI / AB2061 regulatory guidelines.
                  </span>
                </button>
              </div>
            </div>

            {/* Reclassification Reason */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reclassification Reason</Label>
              <Select
                value={newReason}
                onValueChange={(val: DowntimeReasonCode) => setNewReason(val)}
              >
                <SelectTrigger className="rounded-xl border-border bg-background w-full h-11">
                  <SelectValue placeholder="Select reason code" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value={DowntimeReasonCode.UTILITY_OUTAGE} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>Utility Grid Power Outage</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={DowntimeReasonCode.ISP_OUTAGE} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-3.5 w-3.5 text-blue-500" />
                      <span>ISP/Telecom Outage</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={DowntimeReasonCode.COMMUNICATION_LOSS} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <WifiOff className="h-3.5 w-3.5 text-rose-500" />
                      <span>Station Offline / Comm Loss</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={DowntimeReasonCode.VANDALISM} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <Hammer className="h-3.5 w-3.5 text-orange-500" />
                      <span>Vandalism or Physical Damage</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={DowntimeReasonCode.FORCE_MAJEURE} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <CloudLightning className="h-3.5 w-3.5 text-purple-500" />
                      <span>Force Majeure (Extreme Weather / Disaster)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={DowntimeReasonCode.SCHEDULED_MAINTENANCE} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Scheduled Preventive Maintenance</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={DowntimeReasonCode.VEHICLE_ERROR} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <Car className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Vehicle-Side Error or Failure</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={DowntimeReasonCode.UNKNOWN} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Unknown / Other</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Support Ticket */}
            <div className="space-y-2">
              <Label htmlFor="ticketNumber" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Support Ticket # (Optional)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ticketNumber"
                  placeholder="e.g. INC-40812"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  className="rounded-xl border-border bg-background pl-10 h-11"
                />
              </div>
            </div>

            {/* Evidence Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Upload Proof Image (Optional)</Label>
              <ImageUpload
                value={evidence}
                onChange={(url) => setEvidence(url)}
                label="Evidence Document"
                description="Proof of Downtime Work / Reclassification"
                uploadingText="Uploading Evidence..."
              />
            </div>

            {/* Justification Notes */}
            <div className="space-y-2">
              <Label htmlFor="overrideNotes" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Audit justification Notes <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="overrideNotes"
                placeholder="Explain why this downtime qualifies for reclassification..."
                value={overrideNotes}
                onChange={(e) => setOverrideNotes(e.target.value)}
                className="rounded-xl border-border bg-background h-24 p-3"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl font-bold h-11"
                onClick={() => setOverrideModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingOverride}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-black rounded-xl h-11 px-6 shadow-md"
              >
                {isSavingOverride ? 'Saving Override...' : 'Apply Reclassification'}
              </Button>
            </div>
          </form>
        </AnimatedModal>
      )}
    </motion.div>
  );
}
