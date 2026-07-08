'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useStation } from '@/hooks/get/useStations';
import { useConnectorUptime, useDowntimeIntervals, useComplianceReport } from '@/hooks/get/useCompliance';
import { useOverrideDowntime } from '@/hooks/post/useComplianceMutations';
import { toast } from 'sonner';
import { BackButton } from '@/components/shared/BackButton';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import {
  ConnectorDowntimeInterval,
  DowntimeClassification,
  DowntimeReasonCode,
} from '@/services/compliance.service';
import { ConnectorUptime } from '../components/ConnectorUptime';
import { useQueryClient } from '@tanstack/react-query';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useWebSocketConnection, useRealTimeEvent } from '@/hooks/useRealTime';
import { invalidateQueriesDebounced } from '@/lib/query-utils';
import {
  StationStatusChangeEvent,
  ConnectorStatusChangeEvent,
  TransactionEvent,
} from '@/lib/realtime.service';

interface ConnectorUptimeContainerProps {
  stationId: string;
  connectorId: string;
}

export function ConnectorUptimeContainer({ stationId, connectorId }: ConnectorUptimeContainerProps) {
  const queryClient = useQueryClient();
  const { environment } = useEnvironment();

  // Establish WebSocket connection
  useWebSocketConnection();

  // Helper to invalidate all relevant uptime queries
  const invalidateUptimeQueries = useCallback(() => {
    invalidateQueriesDebounced(queryClient, ['station', environment, stationId]);
    invalidateQueriesDebounced(queryClient, ['compliance-uptime', connectorId]);
    invalidateQueriesDebounced(queryClient, ['compliance-downtime-intervals', connectorId]);
    invalidateQueriesDebounced(queryClient, ['compliance-report']);
  }, [queryClient, environment, stationId, connectorId]);

  // Listen for station status changes
  useRealTimeEvent<StationStatusChangeEvent>(
    'station-status-change',
    (data) => {
      if (data.stationId === stationId) {
        invalidateUptimeQueries();
      }
    },
    [stationId, invalidateUptimeQueries]
  );

  // Listen for connector status changes
  useRealTimeEvent<ConnectorStatusChangeEvent>(
    'connector-status-change',
    (data) => {
      if (data.stationId === stationId) {
        invalidateUptimeQueries();
      }
    },
    [stationId, invalidateUptimeQueries]
  );

  // Listen for transaction start
  useRealTimeEvent<TransactionEvent>(
    'transaction-start',
    (data) => {
      if (data.stationId === stationId) {
        invalidateUptimeQueries();
      }
    },
    [stationId, invalidateUptimeQueries]
  );

  // Listen for transaction stop
  useRealTimeEvent<TransactionEvent>(
    'transaction-stop',
    (data) => {
      if (data.stationId === stationId) {
        invalidateUptimeQueries();
      }
    },
    [stationId, invalidateUptimeQueries]
  );

  // Fetch Station Details
  const { data: station, isLoading: isStationLoading } = useStation(stationId);

  const searchParams = useSearchParams();
  const stationNameParam = searchParams.get('name');

  const backHref = useMemo(() => {
    const name = stationNameParam || station?.name;
    return name
      ? `/stations/${stationId}?name=${encodeURIComponent(name)}`
      : `/stations/${stationId}`;
  }, [stationId, stationNameParam, station?.name]);

  // Find targeted connector port info
  const connector = useMemo(() => {
    return station?.connectors?.find((c) => c.id === connectorId);
  }, [station, connectorId]);

  // Date Range Selection (Default to last 30 days)
  const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateString = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(formatDateString(thirtyDaysAgo));
  const [endDate, setEndDate] = useState<string>(formatDateString(new Date()));

  const dateRange = useMemo(() => {
    return {
      from: parseDateString(startDate),
      to: parseDateString(endDate),
    };
  }, [startDate, endDate]);

  const handleDateRangeChange = useCallback((range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from) {
      setStartDate(formatDateString(range.from));
    } else {
      setStartDate('');
    }
    if (range.to) {
      setEndDate(formatDateString(range.to));
    } else {
      setEndDate('');
    }
  }, []);

  // Report View Toggle ('logs' | 'daily' | 'monthly' | 'quarterly')
  const [activeReportTab, setActiveReportTab] = useState<'logs' | 'daily' | 'monthly' | 'quarterly'>(
    'logs',
  );

  // Override Dialog Modal State
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<ConnectorDowntimeInterval | null>(null);
  const [newClassification, setNewClassification] = useState<DowntimeClassification>(DowntimeClassification.EXCLUDED);
  const [newReason, setNewReason] = useState<DowntimeReasonCode>(DowntimeReasonCode.SCHEDULED_MAINTENANCE);
  const [ticketNumber, setTicketNumber] = useState('');
  const [evidence, setEvidence] = useState('');
  const [overrideNotes, setOverrideNotes] = useState('');

  // Data Fetching Hooks
  const { data: uptimeData, isLoading: isUptimeLoading } = useConnectorUptime(
    connectorId,
    startDate,
    endDate,
  );

  const { data: downtimeIntervals, isLoading: isIntervalsLoading } = useDowntimeIntervals(
    connectorId || undefined,
  );

  const { data: complianceReport, isLoading: isReportLoading } = useComplianceReport(
    activeReportTab === 'logs' ? 'daily' : activeReportTab,
    startDate,
    endDate,
    { connectorId },
  );

  // Mutations Hook
  const overrideMutation = useOverrideDowntime();

  // Handle opening override modal
  const handleOpenOverride = useCallback((interval: ConnectorDowntimeInterval) => {
    setSelectedInterval(interval);
    setNewClassification(interval.classification === DowntimeClassification.OUTAGE ? DowntimeClassification.EXCLUDED : DowntimeClassification.OUTAGE);

    // Map initial reasonCode if it's not one of the dropdown values
    let initialReason: DowntimeReasonCode = DowntimeReasonCode.UNKNOWN;
    if ((interval.reasonCode as string) === 'OFFLINE' || interval.reasonCode === DowntimeReasonCode.COMMUNICATION_LOSS) {
      initialReason = DowntimeReasonCode.COMMUNICATION_LOSS;
    } else if (interval.reasonCode === DowntimeReasonCode.UTILITY_OUTAGE) {
      initialReason = DowntimeReasonCode.UTILITY_OUTAGE;
    } else if (interval.reasonCode === DowntimeReasonCode.ISP_OUTAGE) {
      initialReason = DowntimeReasonCode.ISP_OUTAGE;
    } else if (interval.reasonCode === DowntimeReasonCode.VANDALISM) {
      initialReason = DowntimeReasonCode.VANDALISM;
    } else if (interval.reasonCode === DowntimeReasonCode.FORCE_MAJEURE) {
      initialReason = DowntimeReasonCode.FORCE_MAJEURE;
    } else if (interval.reasonCode === DowntimeReasonCode.SCHEDULED_MAINTENANCE) {
      initialReason = DowntimeReasonCode.SCHEDULED_MAINTENANCE;
    } else if (interval.reasonCode === DowntimeReasonCode.VEHICLE_ERROR) {
      initialReason = DowntimeReasonCode.VEHICLE_ERROR;
    }

    setNewReason(initialReason);
    setTicketNumber(interval.ticketNumber || '');
    setEvidence(interval.evidence || '');
    setOverrideNotes(interval.overrideNotes || '');
    setOverrideModalOpen(true);
  }, []);

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

  // Show Skeleton/Loading State
  if (isStationLoading) {
    return (
      <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="h-12 w-full max-w-lg bg-muted/20 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!station || !connector) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-8 space-y-4 text-center">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">Connector Port Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The requested connector port does not exist or you don&apos;t have access permission.
        </p>
        <BackButton href={backHref} label="Return to Station" />
      </div>
    );
  }

  return (
    <ConnectorUptime
      station={station}
      connector={connector}
      backHref={backHref}
      dateRange={dateRange}
      handleDateRangeChange={handleDateRangeChange}
      activeReportTab={activeReportTab}
      setActiveReportTab={setActiveReportTab}
      uptimeData={uptimeData}
      isUptimeLoading={isUptimeLoading}
      downtimeIntervals={downtimeIntervals}
      isIntervalsLoading={isIntervalsLoading}
      complianceReport={complianceReport}
      isReportLoading={isReportLoading}
      overrideModalOpen={overrideModalOpen}
      setOverrideModalOpen={setOverrideModalOpen}
      selectedInterval={selectedInterval}
      newClassification={newClassification}
      setNewClassification={setNewClassification}
      newReason={newReason}
      setNewReason={setNewReason}
      ticketNumber={ticketNumber}
      setTicketNumber={setTicketNumber}
      evidence={evidence}
      setEvidence={setEvidence}
      overrideNotes={overrideNotes}
      setOverrideNotes={setOverrideNotes}
      isSavingOverride={overrideMutation.isPending}
      handleSubmitOverride={handleSubmitOverride}
      handleOpenOverride={handleOpenOverride}
    />
  );
}
