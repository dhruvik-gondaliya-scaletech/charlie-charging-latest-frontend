'use client';

import React, { useState } from 'react';
import { Station } from '@/types';
import { useConnectorUptime, useDowntimeIntervals, useComplianceReport } from '@/hooks/get/useCompliance';
import { useOverrideDowntime } from '@/hooks/post/useComplianceMutations';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { toast } from 'sonner';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  Calendar,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
  Info,
  Layers,
  FileText,
  HelpCircle,
} from 'lucide-react';
import {
  ConnectorDowntimeInterval,
  DowntimeClassification,
  DowntimeReasonCode,
} from '@/services/compliance.service';
import { cn } from '@/lib/utils';

interface StationUptimeTabProps {
  station: Station;
}

export function StationUptimeTab({ station }: StationUptimeTabProps) {
  // 1. Connector Selection (Default to first connector or empty)
  const defaultConnectorId = station.connectors?.[0]?.id || '';
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>(defaultConnectorId);

  // Find active connector model
  const activeConnector = station.connectors?.find((c) => c.id === selectedConnectorId);

  // 2. Date Range Selection (Default to last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const formatDateString = (d: Date) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(formatDateString(thirtyDaysAgo));
  const [endDate, setEndDate] = useState<string>(formatDateString(new Date()));

  // 3. Report View Toggle ('logs' | 'daily' | 'monthly' | 'quarterly')
  const [activeReportTab, setActiveReportTab] = useState<'logs' | 'daily' | 'monthly' | 'quarterly'>(
    'logs',
  );

  // 4. Override Dialog Modal State
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<ConnectorDowntimeInterval | null>(null);
  const [newClassification, setNewClassification] = useState<DowntimeClassification>('EXCLUDED');
  const [newReason, setNewReason] = useState<DowntimeReasonCode>('SCHEDULED_MAINTENANCE');
  const [ticketNumber, setTicketNumber] = useState('');
  const [evidence, setEvidence] = useState('');
  const [overrideNotes, setOverrideNotes] = useState('');

  // 5. Data Fetching Hooks
  const { data: uptimeData, isLoading: isUptimeLoading } = useConnectorUptime(
    selectedConnectorId,
    startDate,
    endDate,
  );

  const { data: downtimeIntervals, isLoading: isIntervalsLoading } = useDowntimeIntervals(
    selectedConnectorId || undefined,
  );

  const { data: complianceReport, isLoading: isReportLoading } = useComplianceReport(
    activeReportTab === 'logs' ? 'daily' : activeReportTab,
    startDate,
    endDate,
    { connectorId: selectedConnectorId },
  );

  // 6. Mutations Hook
  const overrideMutation = useOverrideDowntime();

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

  // Helper: Clean up Reason Codes
  const formatReasonCode = (code: string): string => {
    return code
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Handle opening override modal
  const handleOpenOverride = (interval: ConnectorDowntimeInterval) => {
    setSelectedInterval(interval);
    setNewClassification(interval.classification === 'OUTAGE' ? 'EXCLUDED' : 'OUTAGE');
    setNewReason(interval.reasonCode);
    setTicketNumber(interval.ticketNumber || '');
    setEvidence(interval.evidence || '');
    setOverrideNotes(interval.overrideNotes || '');
    setOverrideModalOpen(true);
  };

  // Handle submit override reclassification
  const handleSubmitOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterval) return;

    if (!overrideNotes.trim()) {
      toast.error('Audit justification notes are required.');
      return;
    }

    overrideMutation.mutate(
      {
        intervalId: selectedInterval.id,
        data: {
          classification: newClassification,
          reason: newReason,
          notes: overrideNotes,
          ticketNumber: ticketNumber.trim() || undefined,
          evidence: evidence.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setOverrideModalOpen(false);
          setSelectedInterval(null);
          setOverrideNotes('');
          setTicketNumber('');
          setEvidence('');
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-card border border-border/40 rounded-2xl">
        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight">Compliance & Uptime Reporting</h3>
          <p className="text-xs text-muted-foreground font-medium">
            Analyze port uptime compliance matching NEVI & California AB-2061 specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Connector Select */}
          <div className="space-y-1.5">
            <Label htmlFor="connector-select" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Connector Port</Label>
            <Select value={selectedConnectorId} onValueChange={setSelectedConnectorId}>
              <SelectTrigger id="connector-select" className="rounded-xl h-10 w-full bg-background/50 border-border/60">
                <SelectValue placeholder="Select Connector" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card">
                {station.connectors?.map((conn) => (
                  <SelectItem key={conn.id} value={conn.id} className="rounded-lg">
                    Port {conn.connectorId} ({conn.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <Label htmlFor="start-date" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Start Date</Label>
            <div className="relative">
              <Input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl h-10 bg-background/50 border-border/60 pl-9 font-medium"
              />
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <Label htmlFor="end-date" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">End Date</Label>
            <div className="relative">
              <Input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl h-10 bg-background/50 border-border/60 pl-9 font-medium"
              />
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Metric 1: Uptime Percentage */}
        <Card className="relative overflow-hidden border-border/40 bg-card hover:shadow-lg transition-all duration-300 rounded-2xl group">
          <div className={cn(
            "absolute top-0 left-0 w-full h-[3px] transition-all",
            uptimeData?.uptimePercentage !== undefined
              ? uptimeData.uptimePercentage >= 97
                ? "bg-emerald-500"
                : uptimeData.uptimePercentage >= 95
                  ? "bg-amber-500"
                  : "bg-rose-500"
              : "bg-border"
          )} />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
              Uptime Percentage
              <span title="Formula: (Total - Excluded - Outage) / (Total - Excluded)">
                <HelpCircle className="h-3.5 w-3.5 opacity-60 cursor-help" />
              </span>
            </CardDescription>
            <CardTitle className="text-4xl font-black tracking-tight text-foreground mt-1">
              {isUptimeLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : uptimeData ? (
                `${uptimeData.uptimePercentage.toFixed(2)}%`
              ) : (
                '0.00%'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {isUptimeLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : uptimeData ? (
              <div className="flex items-center gap-1.5 mt-1">
                {uptimeData.uptimePercentage >= 97 ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 shadow-none hover:bg-emerald-500/10">
                    Compliant (97%+)
                  </Badge>
                ) : uptimeData.uptimePercentage >= 95 ? (
                  <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 shadow-none hover:bg-amber-500/10">
                    Warning (95%-97%)
                  </Badge>
                ) : (
                  <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 shadow-none hover:bg-rose-500/10">
                    Non-Compliant
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Select connector range</span>
            )}
          </CardContent>
        </Card>

        {/* Metric 2: Total Inspected Time */}
        <Card className="border-border/40 bg-card hover:shadow-lg transition-all duration-300 rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Total Checked Time
            </CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-foreground mt-1">
              {isUptimeLoading ? (
                <Skeleton className="h-9 w-28" />
              ) : uptimeData ? (
                formatDuration(uptimeData.totalTimeSeconds)
              ) : (
                '0s'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-xs text-muted-foreground font-medium">
              Total operational logging duration scoped.
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Active Outage Time */}
        <Card className="border-border/40 bg-card hover:shadow-lg transition-all duration-300 rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <ShieldAlert className="h-3 w-3 text-rose-500" /> Outage Time
            </CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-rose-500 mt-1">
              {isUptimeLoading ? (
                <Skeleton className="h-9 w-20" />
              ) : uptimeData ? (
                formatDuration(uptimeData.outageTimeSeconds)
              ) : (
                '0s'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-xs text-muted-foreground font-medium">
              Unexcused downtime counts against uptime.
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Excluded Downtime */}
        <Card className="border-border/40 bg-card hover:shadow-lg transition-all duration-300 rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-indigo-500" /> Excluded Time
            </CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-indigo-500 mt-1">
              {isUptimeLoading ? (
                <Skeleton className="h-9 w-20" />
              ) : uptimeData ? (
                formatDuration(uptimeData.excludedTimeSeconds)
              ) : (
                '0s'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-xs text-muted-foreground font-medium">
              Excused delays excluded from uptime formula.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Toggleable Report/Logs View */}
      <div className="space-y-4">
        <div className="flex border-b border-border/40 pb-px overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'logs', label: 'Downtime Intervals Log', icon: Info },
            { id: 'daily', label: 'Daily Reports', icon: FileSpreadsheet },
            { id: 'monthly', label: 'Monthly Reports', icon: FileText },
            { id: 'quarterly', label: 'Quarterly Reports', icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
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

        {/* TAB 1: Downtime Intervals Log */}
        {activeReportTab === 'logs' && (
          <Card className="border-border/40 bg-card rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-black">Connector Outages & Exclusions</CardTitle>
                <CardDescription className="text-xs font-medium mt-1">
                  History of inactive state intervals detected for this connector.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isIntervalsLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : downtimeIntervals && downtimeIntervals.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Classification</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Reason</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Start Time</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">End Time</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Duration</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Source</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Audit / Ticket</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {downtimeIntervals.map((interval) => (
                        <TableRow key={interval.id} className="border-border/40 hover:bg-muted/10">
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-full font-bold uppercase tracking-wider text-[9px] px-2.5 py-0.5",
                                interval.classification === 'OUTAGE'
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                  : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                              )}
                            >
                              {interval.classification}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-sm">
                            {formatReasonCode(interval.reasonCode)}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                            {formatDateTime(interval.startTime)}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                            {interval.endTime ? formatDateTime(interval.endTime) : (
                              <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-full font-extrabold uppercase tracking-widest text-[8px] px-2 py-0.5 hover:bg-amber-500/10">
                                Active Outage
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold text-sm whitespace-nowrap">
                            {formatDuration(interval.durationSeconds)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="rounded-full text-[10px] font-semibold border-border/60">
                              {interval.autoGenerated ? 'Auto Logged' : 'Manual Override'}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground font-medium">
                            {interval.ticketNumber && (
                              <div className="font-mono text-foreground font-semibold">
                                Ticket: {interval.ticketNumber}
                              </div>
                            )}
                            {interval.overrideNotes && (
                              <div className="italic text-muted-foreground truncate" title={interval.overrideNotes}>
                                &ldquo;{interval.overrideNotes}&rdquo;
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-bold text-xs text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
                              onClick={() => handleOpenOverride(interval)}
                            >
                              Reclassify
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="p-4 bg-muted/20 text-muted-foreground/80 rounded-full mb-3">
                    <ShieldCheck className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-sm">No Downtime Intervals Logged</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                    This connector port is fully compliant and has not experienced outages or excluded downtimes.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 2, 3, 4: Compliance Reports (Daily, Monthly, Quarterly) */}
        {activeReportTab !== 'logs' && (
          <Card className="border-border/40 bg-card rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-black capitalize">{activeReportTab} Compliance Summaries</CardTitle>
                <CardDescription className="text-xs font-medium mt-1">
                  Uptime performance reports aggregated on a {activeReportTab} basis.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isReportLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : complianceReport && complianceReport.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Period</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">EVSE ID</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Port</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Total Time</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Excluded Duration</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Outage Duration</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Uptime Compliance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complianceReport.map((item, idx) => (
                        <TableRow key={idx} className="border-border/40 hover:bg-muted/10">
                          <TableCell className="font-bold text-sm font-mono">
                            {item.date || item.month || item.quarter || 'N/A'}
                          </TableCell>
                          <TableCell className="font-semibold text-sm font-mono">
                            {item.evseId || 'N/A'}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-semibold text-sm">
                            Port {item.connectorPortId}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium text-xs font-mono">
                            {formatDuration(item.totalTimeSeconds)}
                          </TableCell>
                          <TableCell className="text-indigo-500 font-semibold text-xs font-mono">
                            {formatDuration(item.excludedTimeSeconds)}
                          </TableCell>
                          <TableCell className="text-rose-500 font-semibold text-xs font-mono">
                            {formatDuration(item.outageTimeSeconds)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn(
                              "font-black text-sm",
                              item.uptimePercentage >= 97
                                ? "text-emerald-500"
                                : item.uptimePercentage >= 95
                                  ? "text-amber-500"
                                  : "text-rose-500"
                            )}>
                              {item.uptimePercentage.toFixed(2)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="p-4 bg-muted/20 text-muted-foreground/80 rounded-full mb-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-bold text-sm">No Report Data</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                    No report summaries found for the selected dates and connector.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 4. Reclassify / Override Dialog Modal */}
      {selectedInterval && (
        <AnimatedModal
          isOpen={overrideModalOpen}
          onClose={() => setOverrideModalOpen(false)}
          title="Administrative Downtime Override"
          description={`Reclassify downtime interval starting ${formatDateTime(selectedInterval.startTime)}`}
          size="lg"
        >
          <form onSubmit={handleSubmitOverride} className="space-y-5">
            <div className="p-4 bg-muted/30 border border-border/40 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-bold uppercase tracking-wider">Current Classification:</span>
                <Badge variant="outline" className={cn(
                  "font-bold text-[10px]",
                  selectedInterval.classification === 'OUTAGE' ? 'text-rose-500 border-rose-500/20 bg-rose-500/10' : 'text-indigo-500 border-indigo-500/20 bg-indigo-500/10'
                )}>
                  {selectedInterval.classification} ({formatReasonCode(selectedInterval.reasonCode)})
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-bold uppercase tracking-wider">Event Start:</span>
                <span className="font-mono text-foreground font-semibold">{formatDateTime(selectedInterval.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-bold uppercase tracking-wider">Duration:</span>
                <span className="font-bold text-foreground">{formatDuration(selectedInterval.durationSeconds)}</span>
              </div>
            </div>

            {/* Target Classification */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Classification</Label>
              <Select
                value={newClassification}
                onValueChange={(val: DowntimeClassification) => setNewClassification(val)}
              >
                <SelectTrigger className="rounded-xl border-border bg-background">
                  <SelectValue placeholder="Select target classification" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="OUTAGE" className="rounded-lg">OUTAGE (Counts against Uptime)</SelectItem>
                  <SelectItem value="EXCLUDED" className="rounded-lg">EXCLUDED (Excused downtime)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reclassification Reason */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reclassification Reason</Label>
              <Select
                value={newReason}
                onValueChange={(val: DowntimeReasonCode) => setNewReason(val)}
              >
                <SelectTrigger className="rounded-xl border-border bg-background">
                  <SelectValue placeholder="Select reason code" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="UTILITY_OUTAGE" className="rounded-lg">Utility Grid Power Outage</SelectItem>
                  <SelectItem value="ISP_OUTAGE" className="rounded-lg">ISP/Telecom Outage</SelectItem>
                  <SelectItem value="COMMUNICATION_LOSS" className="rounded-lg">Station Offline / Comm Loss</SelectItem>
                  <SelectItem value="VANDALISM" className="rounded-lg">Vandalism or Physical Damage</SelectItem>
                  <SelectItem value="FORCE_MAJEURE" className="rounded-lg">Force Majeure (Extreme Weather / Disaster)</SelectItem>
                  <SelectItem value="SCHEDULED_MAINTENANCE" className="rounded-lg">Scheduled Preventive Maintenance</SelectItem>
                  <SelectItem value="VEHICLE_ERROR" className="rounded-lg">Vehicle-Side Error or Failure</SelectItem>
                  <SelectItem value="UNKNOWN" className="rounded-lg">Unknown / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Support Ticket */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticketNumber" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Support Ticket # (Optional)</Label>
                <Input
                  id="ticketNumber"
                  placeholder="e.g. INC-40812"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  className="rounded-xl border-border bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Evidence URL/Reference (Optional)</Label>
                <Input
                  id="evidence"
                  placeholder="e.g. https://status.utility.com/report/1"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  className="rounded-xl border-border bg-background"
                />
              </div>
            </div>

            {/* Justification Notes */}
            <div className="space-y-2">
              <Label htmlFor="overrideNotes" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Audit justification Notes <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="overrideNotes"
                placeholder="Explain why this downtime qualifies for reclassification..."
                value={overrideNotes}
                onChange={(e) => setOverrideNotes(e.target.value)}
                className="rounded-xl border-border bg-background h-24"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
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
                disabled={overrideMutation.isPending}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-black rounded-xl h-11 px-6 shadow-md"
              >
                {overrideMutation.isPending ? 'Saving Override...' : 'Apply Reclassification'}
              </Button>
            </div>
          </form>
        </AnimatedModal>
      )}
    </div>
  );
}
