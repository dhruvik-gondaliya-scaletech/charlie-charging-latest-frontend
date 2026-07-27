'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocations } from '@/hooks/get/useLocations';
import { useLocationGroup, useLocationGroups, useApiKey } from '@/hooks/get/useReporting';
import { useUpdateLocationGroupLocations } from '@/hooks/put/useReportingMutations';
import { reportingService } from '@/services/reporting.service';
import { stationService } from '@/services/station.service';
import { locationService } from '@/services/location.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { DatePicker } from '@/components/shared/DatePicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { startOfDay, endOfDay } from 'date-fns';
import { API_CONFIG } from '@/constants/constants';
import {
  FileText,
  Download,
  MapPin,
  Search,
  Loader2,
  ShieldCheck,
  Info,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Clock,
  FileSpreadsheet,
  Terminal,
  Copy,
  Check,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';

// Import the reusable report selection components
import { ReportTypeSelector, Step as DownloadStep } from '@/features/dashboard/components/reports/ReportTypeSelector';
import { LocationStationTree } from '@/features/dashboard/components/reports/LocationStationTree';
import { ColumnsSelector } from '@/features/dashboard/components/reports/ColumnsSelector';

const AVAILABLE_COLUMNS = [
  { id: 'id', label: 'Charge event ID' },
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'evseId', label: 'EVSE ID' },
  { id: 'stationId', label: 'Station ID' },
  { id: 'stationName', label: 'Station Name' },
  { id: 'locationId', label: 'Location ID' },
  { id: 'locationName', label: 'Location Name' },
  { id: 'userFirstName', label: 'User First Name' },
  { id: 'userLastName', label: 'User Last Name' },
  { id: 'connectorId', label: 'Port ID' },
  { id: 'connectorType', label: 'Connector Type' },
  { id: 'connectorMaxPower', label: 'Port Maximum Kw' },
  { id: 'pluggedAt', label: 'Connection start datetime' },
  { id: 'startTime', label: 'Charge sesssion start datetime' },
  { id: 'endTime', label: 'Charge session end datetime' },
  { id: 'unpluggedAt', label: 'Connection end datetime' },
  { id: 'durationMinutes', label: 'Duration (Minutes)' },
  { id: 'energyDeliveredKwh', label: 'Energy consumed' },
  { id: 'co2Emitted', label: 'CO2 Emitted (kg)' },
  { id: 'currentSpeed', label: 'Speed (kW)' },
  { id: 'peakKwh', label: 'Peak Power (kW)' },
  { id: 'vehicleMake', label: 'Vehicle make' },
  { id: 'vehicleModel', label: 'Vehicle model' },
  { id: 'vehicleYear', label: 'Vehicle year' },
  { id: 'status', label: 'Status' },
];

const DEFAULT_COLUMNS = [
  'id',
  'transactionId',
  'evseId',
  'stationId',
  'stationName',
  'locationId',
  'locationName',
  'userFirstName',
  'userLastName',
  'connectorId',
  'connectorType',
  'connectorMaxPower',
  'startTime',
  'endTime',
  'durationMinutes',
  'energyDeliveredKwh',
  'status',
];

const CALSTART_SESSION_COLUMNS = [
  'id',
  'evseId',
  'connectorId',
  'connectorMaxPower',
  'pluggedAt',
  'unpluggedAt',
  'startTime',
  'endTime',
  'energyDeliveredKwh',
  'vehicleMake',
  'vehicleModel',
  'vehicleYear',
];

const CALSTART_INTERVAL_COLUMNS = [
  'sessionId',
  'intervalId',
  'intervalStart',
  'intervalEnd',
  'peakKw',
  'avgKw',
  'idleDurationSeconds',
];

const AVAILABLE_INTERVAL_COLUMNS = [
  { id: 'intervalId', label: 'Interval ID' },
  { id: 'intervalStart', label: 'Interval start datetime' },
  { id: 'intervalEnd', label: 'Interval end datetime' },
  { id: 'intervalLabel', label: 'Interval Label' },
  { id: 'sessionId', label: 'Charge event ID' },
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'evseId', label: 'EVSE ID' },
  { id: 'stationId', label: 'Station ID' },
  { id: 'stationName', label: 'Station Name' },
  { id: 'locationId', label: 'Location ID' },
  { id: 'locationName', label: 'Location Name' },
  { id: 'energyKwh', label: 'Energy (kWh)' },
  { id: 'peakKw', label: 'Interval peak demand' },
  { id: 'avgKw', label: 'Interval average demand' },
  { id: 'overlapMinutes', label: 'Overlap (min)' },
  { id: 'dataSource', label: 'Data Source' },
  { id: 'totalTimeSeconds', label: 'Total Time (sec)' },
  { id: 'excludedTimeSeconds', label: 'Excluded Time (sec)' },
  { id: 'outageTimeSeconds', label: 'Outage Time (sec)' },
  { id: 'uptimePercentage', label: 'Uptime (%)' },
  { id: 'idleDurationSeconds', label: 'Idle Duration (sec)' },
];

const DEFAULT_INTERVAL_COLUMNS = [
  'intervalId',
  'intervalStart',
  'intervalEnd',
  'sessionId',
  'stationId',
  'stationName',
  'locationId',
  'locationName',
  'energyKwh',
  'peakKw',
  'avgKw',
  'overlapMinutes',
  'idleDurationSeconds',
];

export function ReportsContainer() {
  const { environment } = useEnvironment();

  // API Docs state
  const [selectedGroupDoc, setSelectedGroupDoc] = useState<'CALSTART' | 'PAC'>('CALSTART');
  const [activeApiEndpoint, setActiveApiEndpoint] = useState<string>('charge-events');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    toast.success('Copied copyable content!');
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  // Tab 2 (Group Management) logic states
  const { data: rawLocations, isLoading: isLocationsLoading } = useLocations();
  const { data: locationGroups, isLoading: isGroupsLoading } = useLocationGroups();
  const { data: apiKeyData } = useApiKey();
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const updateGroup = useUpdateLocationGroupLocations();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupLocationIds, setSelectedGroupLocationIds] = useState<string[]>([]);
  const [isSavingGroup, setIsSavingGroup] = useState(false);

  // Sync selected group locations to state on group selection/update
  useEffect(() => {
    if (selectedGroup) {
      const groupName = selectedGroup.name;
      const groupFromData = locationGroups?.find((g: any) => g.name === groupName);
      if (groupFromData) {
        setSelectedGroupLocationIds(groupFromData.locations.map((loc: any) => loc.id));
      }
    } else {
      setSelectedGroupLocationIds([]);
    }
  }, [selectedGroup, locationGroups]);

  // Tab 1 (Report Downloading) logic states
  const [downloadStep, setDownloadStep] = useState<DownloadStep>('select-type');
  const [isExporting, setIsExporting] = useState(false);

  // Sessions Configuration State
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  // Intervals Configuration State
  const [intervalMinutes, setIntervalMinutes] = useState<15 | 30 | 60>(15);
  const [intervalExportType, setIntervalExportType] = useState<'flat' | 'aggregated'>('flat');
  const [selectedIntervalColumns, setSelectedIntervalColumns] = useState<string[]>(DEFAULT_INTERVAL_COLUMNS);

  // Recipient Preset State
  const [exportForRecipient, setExportForRecipient] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('calstart');

  // Hierarchical Filter State (shared by configuration steps)
  const [treeLocations, setTreeLocations] = useState<any[]>([]);
  const [treeStations, setTreeStations] = useState<any[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [expandedLocationIds, setExpandedLocationIds] = useState<Set<string>>(new Set());
  const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(new Set());
  const [selectedStationIds, setSelectedStationIds] = useState<Set<string>>(new Set());

  // Default date range: Last 7 days to now
  const getInitialDateRange = () => {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    return { from, to };
  };

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(getInitialDateRange());

  // Fetch locations and stations when entering any configuration step
  useEffect(() => {
    if (downloadStep !== 'select-type') {
      const fetchData = async () => {
        try {
          setIsLoadingTree(true);
          const [locData, staData] = await Promise.all([
            locationService.getAllLocations(environment),
            stationService.getAllStations(environment),
          ]);
          setTreeLocations(locData || []);
          setTreeStations(staData || []);

          // Automatically expand all locations
          if (locData) {
            setExpandedLocationIds(new Set(locData.map((l: any) => l.id)));
          }
        } catch (err) {
          console.error('Failed to load locations/stations for CSV export:', err);
          toast.error('Failed to load locations or stations.');
        } finally {
          setIsLoadingTree(false);
        }
      };
      fetchData();
    }
  }, [downloadStep, environment]);

  const handleStepReset = () => {
    setDownloadStep('select-type');
    setSelectedColumns(DEFAULT_COLUMNS);
    setIntervalMinutes(15);
    setIntervalExportType('flat');
    setSelectedIntervalColumns(DEFAULT_INTERVAL_COLUMNS);
    setExportForRecipient(false);
    setSelectedRecipient('calstart');
    setDateRange(getInitialDateRange());
    setSelectedLocationIds(new Set());
    setSelectedStationIds(new Set());
    setExpandedLocationIds(new Set());
  };

  const handleExportForRecipientToggle = (checked: boolean) => {
    setExportForRecipient(checked);
    if (checked) {
      if (selectedRecipient === 'calstart') {
        setSelectedColumns(CALSTART_SESSION_COLUMNS);
        setSelectedIntervalColumns(CALSTART_INTERVAL_COLUMNS);
      }
    } else {
      setSelectedColumns(DEFAULT_COLUMNS);
      setSelectedIntervalColumns(DEFAULT_INTERVAL_COLUMNS);
    }
  };

  const handleRecipientChange = (recipient: string) => {
    setSelectedRecipient(recipient);
    if (exportForRecipient) {
      if (recipient === 'calstart') {
        setSelectedColumns(CALSTART_SESSION_COLUMNS);
        setSelectedIntervalColumns(CALSTART_INTERVAL_COLUMNS);
      }
    }
  };

  const handleExportSessions = async () => {
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column to export.');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Generating sessions report...', { id: 'export-csv' });

      const locationIdsParam = Array.from(selectedLocationIds).join(',');
      const stationIdsParam = Array.from(selectedStationIds).join(',');

      const params = {
        startFrom: dateRange.from ? startOfDay(dateRange.from).toISOString() : undefined,
        startTo: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
        columns: selectedColumns,
        env: environment,
        locationIds: locationIdsParam || undefined,
        stationIds: stationIdsParam || undefined,
      };

      const csvBlob = await reportingService.exportSessions(params);

      const url = window.URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `charging-sessions-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!', { id: 'export-csv' });
      handleStepReset();
    } catch (error) {
      console.error('Failed to export sessions report:', error);
      toast.error('Failed to generate report. Please try again.', { id: 'export-csv' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportIntervals = async () => {
    if (intervalExportType === 'flat' && selectedIntervalColumns.length === 0) {
      toast.error('Please select at least one column to export.');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Generating interval report...', { id: 'export-intervals' });

      const stationIdsParam = Array.from(selectedStationIds).join(',') || undefined;
      const locationIdsParam = Array.from(selectedLocationIds).join(',') || undefined;

      const params = {
        startFrom: dateRange.from ? startOfDay(dateRange.from).toISOString() : undefined,
        startTo: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
        intervalMinutes,
        env: environment,
        stationIds: stationIdsParam,
        locationIds: locationIdsParam,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };

      if (intervalExportType === 'flat') {
        const csvBlob = await reportingService.exportIntervalsCsv({
          ...params,
          columns: selectedIntervalColumns,
        });
        const url = window.URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `interval-slices-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        await reportingService.exportAggregatedCsv(params);
      }

      toast.success('Interval report downloaded!', { id: 'export-intervals' });
      handleStepReset();
    } catch (error) {
      console.error('Failed to export interval report:', error);
      toast.error('Failed to generate interval report. Please try again.', { id: 'export-intervals' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDowntime = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating downtime report...', { id: 'export-downtime' });

      const stationIdsParam = Array.from(selectedStationIds).join(',') || undefined;
      const locationIdsParam = Array.from(selectedLocationIds).join(',') || undefined;

      const params = {
        startFrom: dateRange.from ? startOfDay(dateRange.from).toISOString() : undefined,
        startTo: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
        env: environment,
        stationIds: stationIdsParam,
        locationIds: locationIdsParam,
      };

      const csvBlob = await reportingService.exportDowntime(params);

      const url = window.URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `station-downtime-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Downtime report downloaded successfully!', { id: 'export-downtime' });
      handleStepReset();
    } catch (error) {
      console.error('Failed to export downtime report:', error);
      toast.error('Failed to generate downtime report. Please try again.', { id: 'export-downtime' });
    } finally {
      setIsExporting(false);
    }
  };

  // Tree functions
  const handleLocationCheck = (locationId: string, checked: boolean) => {
    const stationIdsInLoc = treeStations.filter((s) => s.locationId === locationId).map((s) => s.id);

    setSelectedLocationIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(locationId);
      } else {
        next.delete(locationId);
      }
      return next;
    });

    setSelectedStationIds((prev) => {
      const next = new Set(prev);
      stationIdsInLoc.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const handleStationCheck = (stationId: string, locationId: string, checked: boolean) => {
    setSelectedStationIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(stationId);
      } else {
        next.delete(stationId);
      }

      // Check if all stations of this location are selected
      const stationIdsInLoc = treeStations.filter((s) => s.locationId === locationId).map((s) => s.id);
      const allChecked = stationIdsInLoc.length > 0 && stationIdsInLoc.every((id) => next.has(id));

      setSelectedLocationIds((locPrev) => {
        const locNext = new Set(locPrev);
        if (allChecked) {
          locNext.add(locationId);
        } else {
          locNext.delete(locationId);
        }
        return locNext;
      });

      return next;
    });
  };

  const toggleLocationExpand = (locationId: string) => {
    setExpandedLocationIds((prev) => {
      const next = new Set(prev);
      if (next.has(locationId)) {
        next.delete(locationId);
      } else {
        next.add(locationId);
      }
      return next;
    });
  };

  // Tab 2 (CALSTART Grouping) functions
  const filteredGroupLocations = useMemo(() => {
    if (!rawLocations) return [];
    return rawLocations.filter(loc =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loc.address && loc.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [rawLocations, searchTerm]);

  const handleToggleGroupLocation = (id: string) => {
    setSelectedGroupLocationIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllGroup = () => {
    if (rawLocations) {
      setSelectedGroupLocationIds(rawLocations.map(l => l.id));
    }
  };

  const handleDeselectAllGroup = () => {
    setSelectedGroupLocationIds([]);
  };

  const handleSaveChangesGroup = async () => {
    if (!selectedGroup) return;
    setIsSavingGroup(true);
    try {
      await updateGroup.mutateAsync({
        groupName: selectedGroup.name,
        locationIds: selectedGroupLocationIds
      });
      setSelectedGroup(null);
    } catch (err) {
      // Handled by hook
    } finally {
      setIsSavingGroup(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto pb-16"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Reports & Reporting Group Management
        </h1>
        <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">
          Manage location filters for regulatory reporting compliance and network export data.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={staggerItem}>
        <Tabs defaultValue="downloads" className="space-y-6">
          <TabsList className="bg-muted/40 p-1 border border-border/40 rounded-xl backdrop-blur-md w-fit inline-flex h-auto gap-1 shadow-inner">
            <TabsTrigger value="downloads" className="rounded-lg font-bold px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4 mr-2" />
              Download Reports
            </TabsTrigger>
            <TabsTrigger value="groups" className="rounded-lg font-bold px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
              <MapPin className="h-4 w-4 mr-2" />
              Location Group
            </TabsTrigger>
            <TabsTrigger value="api-docs" className="rounded-lg font-bold px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
              <Terminal className="h-4 w-4 mr-2" />
              API Docs
            </TabsTrigger>
          </TabsList>

          {/* Downloads Tab */}
          <TabsContent value="downloads">
            <Card className="bg-card/40 border-border/40 backdrop-blur-md rounded-2xl shadow-md p-6">
              
              {/* Step Header */}
              {downloadStep !== 'select-type' && (
                <div className="flex items-center gap-3 border-b border-border/60 pb-5 mb-5">
                  <button
                    onClick={handleStepReset}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-primary" /> Configure Export
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {downloadStep === 'configure-intervals'
                        ? 'Configure interval size, type, and date range for your interval export.'
                        : downloadStep === 'configure-downtime'
                          ? 'Configure date range and filters for station downtime CSV export.'
                          : 'Configure parameters, filters, and custom fields for your CSV export.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Select Type */}
              {downloadStep === 'select-type' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-border/40">
                    <h2 className="text-lg font-bold">Export Reports</h2>
                    <p className="text-sm text-muted-foreground">Select a report type to begin your data export.</p>
                  </div>
                  <ReportTypeSelector onSelectStep={setDownloadStep} />
                </div>
              )}

              {/* Step 2: Configure Intervals */}
              {downloadStep === 'configure-intervals' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                    {/* Left Column */}
                    <div className="space-y-5 flex flex-col min-h-0">
                      {/* Date Range */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-emerald-500" /> Date Range
                        </Label>
                        <DatePicker
                          dateRange={dateRange}
                          onDateRangeChange={setDateRange}
                          className="w-full"
                        />
                      </div>

                      {/* Interval Size */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-emerald-500" /> Interval Size
                        </Label>
                        <div className="flex gap-2 max-w-md">
                          {([15, 30, 60] as const).map((m) => (
                            <button
                              key={m}
                              onClick={() => setIntervalMinutes(m)}
                              className={cn(
                                `flex-1 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer`,
                                intervalMinutes === m
                                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                                  : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted/40',
                              )}
                            >
                              {m}min
                            </button>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground rounded-xl border border-border bg-muted/20 px-4 py-2.5 leading-relaxed">
                        📊 Flat Slices — one row per session per interval block. Best for per-transaction compliance or billing verification.
                      </p>

                      {/* Locations & Stations */}
                      <div className="space-y-2 flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-emerald-500" /> Locations &amp; Stations
                          </Label>
                          {selectedStationIds.size > 0 && (
                            <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                              {selectedStationIds.size} stations selected
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-h-[180px] max-h-[220px] overflow-y-auto custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-1">
                          <LocationStationTree
                            locations={treeLocations}
                            stations={treeStations}
                            isLoadingTree={isLoadingTree}
                            selectedLocationIds={selectedLocationIds}
                            selectedStationIds={selectedStationIds}
                            expandedLocationIds={expandedLocationIds}
                            onLocationCheck={handleLocationCheck}
                            onStationCheck={handleStationCheck}
                            onToggleExpand={toggleLocationExpand}
                            accentColor="emerald"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="h-full flex flex-col gap-4">
                      {/* Preset Switcher */}
                      <div className="rounded-xl border border-border bg-muted/5 p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-xs font-semibold text-foreground/90">
                              Export for specific recipient
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                              Pre-selects required columns for compliance.
                            </p>
                          </div>
                          <Switch
                            checked={exportForRecipient}
                            onCheckedChange={handleExportForRecipientToggle}
                          />
                        </div>

                        {exportForRecipient && (
                          <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">
                              Recipient:
                            </Label>
                            <Select
                              value={selectedRecipient}
                              onValueChange={handleRecipientChange}
                            >
                              <SelectTrigger className="w-full h-8 text-xs bg-muted/20 border-border/60 hover:bg-muted/40">
                                <SelectValue placeholder="Select Recipient" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="calstart">CALSTART</SelectItem>
                                <SelectItem value="pac">PAC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-h-0">
                        <ColumnsSelector
                          availableColumns={AVAILABLE_INTERVAL_COLUMNS}
                          selectedColumns={selectedIntervalColumns}
                          onColumnToggle={(colId, checked) => {
                            if (checked) {
                              setSelectedIntervalColumns((prev) => [...prev, colId]);
                            } else {
                              setSelectedIntervalColumns((prev) => prev.filter((id) => id !== colId));
                            }
                          }}
                          onSelectAll={() => setSelectedIntervalColumns(AVAILABLE_INTERVAL_COLUMNS.map(c => c.id))}
                          onDeselectAll={() => setSelectedIntervalColumns([])}
                          disabled={exportForRecipient}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <Button variant="ghost" onClick={handleStepReset} disabled={isExporting}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleExportIntervals}
                      disabled={isExporting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isExporting ? 'Exporting...' : 'Export Intervals CSV'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Configure Downtime */}
              {downloadStep === 'configure-downtime' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                    {/* Left Column */}
                    <div className="space-y-5 flex flex-col min-h-0">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-rose-500" /> Date Range
                        </Label>
                        <DatePicker
                          dateRange={dateRange}
                          onDateRangeChange={setDateRange}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2 flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-rose-500" /> Locations &amp; Stations
                          </Label>
                          {selectedStationIds.size > 0 && (
                            <span className="text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold px-2 py-0.5 rounded-full">
                              {selectedStationIds.size} stations
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-1">
                          <LocationStationTree
                            locations={treeLocations}
                            stations={treeStations}
                            isLoadingTree={isLoadingTree}
                            selectedLocationIds={selectedLocationIds}
                            selectedStationIds={selectedStationIds}
                            expandedLocationIds={expandedLocationIds}
                            onLocationCheck={handleLocationCheck}
                            onStationCheck={handleStationCheck}
                            onToggleExpand={toggleLocationExpand}
                            accentColor="rose"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="h-full flex flex-col gap-4 justify-between">
                      <div className="rounded-xl border border-border bg-muted/5 p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold text-sm text-foreground/90 mb-1">
                            Downtime Report Details
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            This report compiles downtime intervals across all stations within the selected range and locations, grouped by unique station downtime events.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-xs font-semibold text-foreground/80">
                            Included Columns:
                          </Label>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                              <div>
                                <span className="font-semibold text-foreground/90">EVSE ID</span>
                                <p className="text-[11px] text-muted-foreground">The station's physical hardware serial number.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                              <div>
                                <span className="font-semibold text-foreground/90">Downtime reason</span>
                                <p className="text-[11px] text-muted-foreground">Reason code or category for the downtime event.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                              <div>
                                <span className="font-semibold text-foreground/90">Event start datetime</span>
                                <p className="text-[11px] text-muted-foreground">Start of the downtime event (MM/DD/YYYY HH:MM:SS).</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                              <div>
                                <span className="font-semibold text-foreground/90">Event end datetime</span>
                                <p className="text-[11px] text-muted-foreground">End of the downtime event (MM/DD/YYYY HH:MM:SS).</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <Button variant="ghost" onClick={handleStepReset} disabled={isExporting}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleExportDowntime}
                      disabled={isExporting}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isExporting ? 'Exporting...' : 'Export Downtime CSV'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Configure Sessions */}
              {downloadStep === 'configure-sessions' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                    {/* Left Column */}
                    <div className="space-y-5 flex flex-col min-h-0">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-primary" /> Date Range
                        </Label>
                        <DatePicker
                          dateRange={dateRange}
                          onDateRangeChange={setDateRange}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2 flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary" /> Locations &amp; Stations
                          </Label>
                          {selectedStationIds.size > 0 && (
                            <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                              {selectedStationIds.size} stations
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-1">
                          <LocationStationTree
                            locations={treeLocations}
                            stations={treeStations}
                            isLoadingTree={isLoadingTree}
                            selectedLocationIds={selectedLocationIds}
                            selectedStationIds={selectedStationIds}
                            expandedLocationIds={expandedLocationIds}
                            onLocationCheck={handleLocationCheck}
                            onStationCheck={handleStationCheck}
                            onToggleExpand={toggleLocationExpand}
                            accentColor="primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="h-full flex flex-col gap-4">
                      {/* Preset Switcher */}
                      <div className="rounded-xl border border-border bg-muted/5 p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-xs font-semibold text-foreground/90">
                              Export for specific recipient
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                              Pre-selects required columns for compliance.
                            </p>
                          </div>
                          <Switch
                            checked={exportForRecipient}
                            onCheckedChange={handleExportForRecipientToggle}
                          />
                        </div>

                        {exportForRecipient && (
                          <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">
                              Recipient:
                            </Label>
                            <Select
                              value={selectedRecipient}
                              onValueChange={handleRecipientChange}
                            >
                              <SelectTrigger className="w-full h-8 text-xs bg-muted/20 border-border/60 hover:bg-muted/40">
                                <SelectValue placeholder="Select Recipient" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="calstart">CALSTART</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-h-0">
                        <ColumnsSelector
                          availableColumns={AVAILABLE_COLUMNS}
                          selectedColumns={selectedColumns}
                          onColumnToggle={(colId, checked) => {
                            if (checked) {
                              setSelectedColumns((prev) => [...prev, colId]);
                            } else {
                              setSelectedColumns((prev) => prev.filter((id) => id !== colId));
                            }
                          }}
                          onSelectAll={() => setSelectedColumns(AVAILABLE_COLUMNS.map(c => c.id))}
                          onDeselectAll={() => setSelectedColumns([])}
                          disabled={exportForRecipient}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <Button variant="ghost" onClick={handleStepReset} disabled={isExporting}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleExportSessions}
                      disabled={isExporting}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isExporting ? 'Exporting...' : 'Export CSV'}
                    </Button>
                  </div>
                </div>
              )}

            </Card>
          </TabsContent>

          {/* Location Group Tab */}
          <TabsContent value="groups">
            {!selectedGroup ? (
              <Card className="bg-card/40 border-border/40 backdrop-blur-md rounded-2xl shadow-md p-6">
                <div className="pb-4 border-b border-border/10 mb-6">
                  <h2 className="text-xl font-bold">Location Groups</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select a location group to configure its assigned compliance locations.</p>
                </div>

                {isGroupsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">Loading location groups...</p>
                  </div>
                ) : !locationGroups || locationGroups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/20 rounded-xl gap-2">
                    <Info className="h-8 w-8 opacity-40" />
                    <p className="text-sm font-semibold">No location groups found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locationGroups.map((group: any) => (
                      <Card
                        key={group.id || group.name}
                        onClick={() => setSelectedGroup(group)}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
                            <MapPin className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-primary truncate">
                              {group.name.toUpperCase()} Group
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">
                              {group.locations?.length || 0} locations attached
                            </p>
                            <div className="mt-4 flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors rounded-lg border-primary/30 text-primary"
                              >
                                Manage Locations
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <Card className="bg-card/40 border-border/40 backdrop-blur-md rounded-2xl shadow-md p-6">
                <div className="pb-4 border-b border-border/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedGroup(null)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">
                          {selectedGroup.name.toUpperCase()} Group Assignments
                        </h2>
                        <span className="bg-primary/15 text-primary text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-primary/20 tracking-wider">
                          {selectedGroup.name.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check the locations whose stations should be included in {selectedGroup.name.toUpperCase()} reporting API outputs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pl-12 md:pl-0">
                    <Button 
                      variant="outline" 
                      onClick={handleSelectAllGroup} 
                      size="sm" 
                      className="rounded-lg text-xs font-bold"
                      disabled={isLocationsLoading}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleDeselectAllGroup} 
                      size="sm" 
                      className="rounded-lg text-xs font-bold"
                      disabled={isLocationsLoading}
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="Search locations by name or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-background/50 border-border/40 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Locations Checklist */}
                  {isLocationsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium">Loading locations list...</p>
                    </div>
                  ) : filteredGroupLocations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/20 rounded-xl gap-2">
                      <Info className="h-8 w-8 opacity-40" />
                      <p className="text-sm font-semibold">No locations found</p>
                      <p className="text-xs text-muted-foreground">Try altering your search phrase.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                      {filteredGroupLocations.map((loc) => {
                        const isSelected = selectedGroupLocationIds.includes(loc.id);
                        return (
                          <div
                            key={loc.id}
                            onClick={() => handleToggleGroupLocation(loc.id)}
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
                                : 'border-border/40 bg-background/20 hover:border-border/80'
                            }`}
                          >
                            <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleToggleGroupLocation(loc.id)}
                                className="rounded-md border-2"
                              />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <p className="text-sm font-bold truncate leading-snug">{loc.name}</p>
                              {loc.address && (
                                <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                  {loc.address}
                                </p>
                              )}
                              <div className="flex items-center gap-1.5 pt-1">
                                <span className="text-[9px] font-black uppercase text-muted-foreground bg-muted/60 border px-1.5 py-0.5 rounded">
                                  {loc.stationCount || 0} Stations
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Footer Save Button */}
                  <div className="flex items-center justify-between pt-6 border-t border-border/10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>{selectedGroupLocationIds.length} location(s) selected for group inclusion.</span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedGroup(null)}
                        disabled={isSavingGroup}
                        className="rounded-xl px-5 h-11 font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveChangesGroup}
                        disabled={isSavingGroup || isLocationsLoading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 h-11 rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-2"
                      >
                        {isSavingGroup ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving Group...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </div>

                </div>
              </Card>
            )}
          </TabsContent>

          {/* API Docs Tab */}
          <TabsContent value="api-docs">
            <Card className="bg-card/40 border-border/40 backdrop-blur-md rounded-2xl shadow-md p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" /> {selectedGroupDoc} API Documentation
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Retrieve regulatory compliance datasets for locations in the {selectedGroupDoc} reporting group.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Label className="text-xs font-bold text-muted-foreground whitespace-nowrap">Reporting Group:</Label>
                    <Select
                      value={selectedGroupDoc}
                      onValueChange={(val: 'CALSTART' | 'PAC') => {
                        setSelectedGroupDoc(val);
                        setActiveApiEndpoint(val === 'CALSTART' ? 'charge-events' : 'pac-site');
                      }}
                    >
                      <SelectTrigger className="w-[160px] h-9 text-xs font-bold bg-card border-border/80 shadow-sm rounded-xl">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CALSTART">CALSTART</SelectItem>
                        <SelectItem value="PAC">PAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground leading-relaxed flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground">Compliance Context:</span> These endpoints query datasets solely for charging stations belonging to locations assigned to the <code className="font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">{selectedGroupDoc}</code> group. Assign compliance-tracked sites in the <span className="font-bold text-foreground">Location Group</span> tab.
                  </div>
                </div>

                {/* API Key Box */}
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">Your Encrypted API Key</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                      AES-256 Encrypted Context
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this key to authenticate public {selectedGroupDoc} API requests by passing it in the <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">x-api-key</code> header or as a query parameter <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">apiKey</code>.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKeyData?.apiKey || ''}
                        readOnly
                        className="w-full font-mono text-xs p-3 pr-20 bg-muted/60 border border-border/40 rounded-xl focus:outline-none select-all text-foreground"
                        placeholder="Loading API key..."
                      />
                      <div className="absolute right-2 top-1.5 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                          onClick={() => setShowApiKey(!showApiKey)}
                          disabled={!apiKeyData?.apiKey}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                          onClick={() => {
                            if (apiKeyData?.apiKey) {
                              handleCopyText(apiKeyData.apiKey, 'api-key');
                            }
                          }}
                          disabled={!apiKeyData?.apiKey}
                        >
                          {copiedEndpoint === 'api-key' ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Sidebar endpoint list */}
                  <div className="lg:col-span-1 flex flex-col gap-2">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-3 mb-1">
                      Endpoints ({selectedGroupDoc})
                    </div>
                    {selectedGroupDoc === 'CALSTART' ? (
                      <>
                        <button
                          onClick={() => setActiveApiEndpoint('charge-events')}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                            activeApiEndpoint === 'charge-events'
                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                              : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/40 hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-extrabold text-emerald-500 uppercase">GET</span>
                            <span>Charge Events</span>
                          </div>
                          <span className="text-[10px] opacity-80 truncate font-mono">/calstart/charge-events</span>
                        </button>
                        <button
                          onClick={() => setActiveApiEndpoint('downtime-events')}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                            activeApiEndpoint === 'downtime-events'
                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                              : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/40 hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-extrabold text-emerald-500 uppercase">GET</span>
                            <span>Downtime Events</span>
                          </div>
                          <span className="text-[10px] opacity-80 truncate font-mono">/calstart/downtime-events</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveApiEndpoint('pac-site')}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                            activeApiEndpoint === 'pac-site'
                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                              : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/40 hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-extrabold text-emerald-500 uppercase">GET</span>
                            <span>Site API</span>
                          </div>
                          <span className="text-[10px] opacity-80 truncate font-mono">/pac/site</span>
                        </button>
                        <button
                          onClick={() => setActiveApiEndpoint('pac-stations')}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                            activeApiEndpoint === 'pac-stations'
                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                              : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/40 hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-extrabold text-emerald-500 uppercase">GET</span>
                            <span>Station API</span>
                          </div>
                          <span className="text-[10px] opacity-80 truncate font-mono">/pac/stations</span>
                        </button>
                        <button
                          onClick={() => setActiveApiEndpoint('pac-sessions')}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                            activeApiEndpoint === 'pac-sessions'
                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                              : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/40 hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-extrabold text-emerald-500 uppercase">GET</span>
                            <span>Session API</span>
                          </div>
                          <span className="text-[10px] opacity-80 truncate font-mono">/pac/sessions</span>
                        </button>
                        <button
                          onClick={() => setActiveApiEndpoint('pac-interval')}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col gap-1 cursor-pointer",
                            activeApiEndpoint === 'pac-interval'
                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                              : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/40 hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-extrabold text-emerald-500 uppercase">GET</span>
                            <span>Interval API</span>
                          </div>
                          <span className="text-[10px] opacity-80 truncate font-mono">/pac/interval</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Right Column endpoint detail panel */}
                  <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-border/40 lg:pl-6">
                    {/* CALSTART Charge Events */}
                    {activeApiEndpoint === 'charge-events' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                            <code className="font-mono text-sm sm:text-base font-bold text-foreground">/calstart/charge-events</code>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Retrieve a detailed, paginated array of compliance charging sessions (charge events) that occurred within the specified timeframe for a particular EVSE serial number. Returns 15-minute interval demand snapshots.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                          <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-border/40 bg-muted/40 font-bold">
                                  <th className="p-3">Parameter</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Requirement</th>
                                  <th className="p-3">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-medium">
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">from</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Start date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-01T00:00:00Z</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">to</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">End date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-08T23:59:59Z</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">evseId</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Optional filter by the physical charging station's serial number. If omitted, events for all stations in the location group are returned.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">env</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">page</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">limit</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Number of items to return per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                              onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/calstart/charge-events?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-charge')}
                            >
                              {copiedEndpoint === 'curl-charge' ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Copy cURL
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                            {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/calstart/charge-events?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                          </pre>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`[
  {
    "chargeEventId": "91a82f3c-5b6d-472a-8c9e-21ef0a43b567",
    "evseId": "ABB001",
    "portId": 1,
    "portMaximumKw": 150,
    "connectionStartDatetime": "2026-07-01T10:00:00Z",
    "connectionEndDatetime": "2026-07-01T10:45:00Z",
    "chargeSessionStartDatetime": "2026-07-01T10:05:00Z",
    "chargeSessionEndDatetime": "2026-07-01T10:40:00Z",
    "energyConsumedKwh": 42.5,
    "vehicleMake": "Tesla",
    "vehicleModel": "Model Y",
    "vehicleYear": 2023,
    "interval": [
      {
        "intervalId": 1,
        "intervalStartDatetime": "2026-07-01T10:05:00Z",
        "intervalEndDatetime": "2026-07-01T10:20:00Z",
        "intervalPeakDemandKw": 120.0,
        "intervalAverageDemandKw": 115.2,
        "idleDuration": 0
      }
    ]
  }
]`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* CALSTART Downtime Events */}
                    {activeApiEndpoint === 'downtime-events' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                            <code className="font-mono text-sm sm:text-base font-bold text-foreground">/calstart/downtime-events</code>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Retrieve a detailed, paginated list of connector outage and downtime events matching the requested serial number and date range.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                          <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-border/40 bg-muted/40 font-bold">
                                  <th className="p-3">Parameter</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Requirement</th>
                                  <th className="p-3">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-medium">
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">from</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Start date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-01T00:00:00Z</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">to</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">End date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-08T23:59:59Z</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">evseId</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Optional filter by the physical charging station's serial number. If omitted, events for all stations in the location group are returned.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">env</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">page</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">limit</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Number of items to return per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                              onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/calstart/downtime-events?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-downtime')}
                            >
                              {copiedEndpoint === 'curl-downtime' ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Copy cURL
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                            {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/calstart/downtime-events?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                          </pre>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`[
  {
    "evseId": "ABB001",
    "downtimeReason": "LOST_COMMUNICATION",
    "eventStartDatetime": "2026-07-02T14:30:00Z",
    "eventEndDatetime": "2026-07-02T15:15:00Z"
  },
  {
    "evseId": "ABB001",
    "downtimeReason": "CONNECTOR_LOCK_FAILURE",
    "eventStartDatetime": "2026-07-05T09:00:00Z",
    "eventEndDatetime": "2026-07-05T10:30:00Z"
  }
]`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* PAC Site API */}
                    {activeApiEndpoint === 'pac-site' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                            <code className="font-mono text-sm sm:text-base font-bold text-foreground">/pac/site</code>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Retrieve a detailed, paginated array of sites/locations assigned to the PAC reporting group.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                          <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-border/40 bg-muted/40 font-bold">
                                  <th className="p-3">Parameter</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Requirement</th>
                                  <th className="p-3">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-medium">
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">env</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">page</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">limit</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Number of items per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                              onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/pac/site?env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-pac-site')}
                            >
                              {copiedEndpoint === 'curl-pac-site' ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Copy cURL
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                            {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/pac/site?env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                          </pre>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`{
  "items": [
    {
      "site_id": "8fa134bc-1122-3344-5566-778899aabbcc",
      "site_name": "Pacific Hub - Downtown",
      "address_1": "100 Pacific Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zip_code": "90012",
      "operating_status": "Active",
      "access_type": "PUBLIC",
      "county": "USA"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* PAC Station API */}
                    {activeApiEndpoint === 'pac-stations' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                            <code className="font-mono text-sm sm:text-base font-bold text-foreground">/pac/stations</code>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Retrieve a detailed, paginated list of charging stations in the PAC reporting group, including activation date (<code className="font-mono bg-muted px-1 rounded">initialboot</code>), port count, charger type, and total downtime hours.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                          <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-border/40 bg-muted/40 font-bold">
                                  <th className="p-3">Parameter</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Requirement</th>
                                  <th className="p-3">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-medium">
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">siteId</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Filter stations by location/site ID.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">env</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">page</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">limit</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Number of items per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                              onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/pac/stations?env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-pac-stations')}
                            >
                              {copiedEndpoint === 'curl-pac-stations' ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Copy cURL
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                            {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/pac/stations?env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                          </pre>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`{
  "items": [
    {
      "site_id": "8fa134bc-1122-3344-5566-778899aabbcc",
      "station_id": "31b94d12-4455-6677-8899-aabbccdd0011",
      "station_serial": "PAC-STA-001",
      "station_name": "Pacific Charger 1",
      "is_active": true,
      "power_level_kw": 50,
      "num_ports": 2,
      "station_activation_date": "2026-01-15 08:30:00",
      "charger_type": "Level 3",
      "connector_type": "CCS1, CHAdeMO",
      "model_number": "Express-250",
      "serial_number": "PAC-STA-001",
      "evse_manufacturer": "ChargePoint",
      "vendor_name": "ScaleEV",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "port_ID": ["e3b0c442-98fc-4c14-9626-d6652613c32e"],
      "install_date": "2026-01-10 12:00:00",
      "downtime_hours": 2.5,
      "latest_communication": "2026-07-20 16:00:00"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* PAC Session API */}
                    {activeApiEndpoint === 'pac-sessions' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                            <code className="font-mono text-sm sm:text-base font-bold text-foreground">/pac/sessions</code>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Retrieve a detailed, paginated list of charging sessions under the PAC reporting group, including plug/unplug and charging start/end timestamps and session/charging durations in seconds.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                          <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-border/40 bg-muted/40 font-bold">
                                  <th className="p-3">Parameter</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Requirement</th>
                                  <th className="p-3">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-medium">
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">from</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Start date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-01T00:00:00Z</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">to</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">End date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-08T23:59:59Z</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">stationId</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Filter by station ID.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">siteId</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Filter by site/location ID.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">env</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">page</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">limit</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Number of items per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                              onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/pac/sessions?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-pac-sessions')}
                            >
                              {copiedEndpoint === 'curl-pac-sessions' ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Copy cURL
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                            {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/pac/sessions?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                          </pre>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`{
  "items": [
    {
      "session_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "station_id": "31b94d12-4455-6677-8899-aabbccdd0011",
      "port_number": 1,
      "plug_start_datetime": "2026-07-01 10:00:00",
      "plug_end_datetime": "2026-07-01 10:45:00",
      "charge_start_datetime": "2026-07-01 10:05:00",
      "charge_end_datetime": "2026-07-01 10:40:00",
      "session_duration": 2700,
      "charging_duration": 2100,
      "energy_kwh": 35.4,
      "peak_kw": 48.2,
      "total_fee_charged": "0"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* PAC Interval API */}
                    {activeApiEndpoint === 'pac-interval' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase">GET</span>
                            <code className="font-mono text-sm sm:text-base font-bold text-foreground">/pac/interval</code>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Retrieve 15-minute interval power (kW) and energy (kWh) data for charging sessions under the PAC reporting group.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Query Parameters</h4>
                          <div className="overflow-x-auto border border-border/40 rounded-xl bg-muted/20">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-border/40 bg-muted/40 font-bold">
                                  <th className="p-3">Parameter</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Requirement</th>
                                  <th className="p-3">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-medium">
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">from</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Start date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-01T00:00:00Z</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">to</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">End date-time in ISO 8601 format (e.g., <code className="font-mono bg-muted px-1 rounded">2026-07-08T23:59:59Z</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">sessionId</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Filter intervals by session ID.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">stationId</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Filter intervals by station ID.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">env</td>
                                  <td className="p-3 text-muted-foreground font-mono">string</td>
                                  <td className="p-3"><span className="text-muted-foreground font-bold">Optional</span></td>
                                  <td className="p-3 text-muted-foreground">Environment filter (<code className="font-mono bg-muted px-1 rounded">dev</code> or <code className="font-mono bg-muted px-1 rounded">prod</code>). Defaults to <code className="font-mono bg-muted px-1 rounded">prod</code> if omitted.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">page</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Pagination page index (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold text-primary">limit</td>
                                  <td className="p-3 text-muted-foreground font-mono">number</td>
                                  <td className="p-3"><span className="text-rose-500 font-bold">Required</span></td>
                                  <td className="p-3 text-muted-foreground">Number of items per page (minimum: <code className="font-mono bg-muted px-1 rounded">1</code>).</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Request</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg font-bold text-[11px] gap-1.5"
                              onClick={() => handleCopyText(`curl -X GET "${API_CONFIG.baseUrl || window.location.origin}/pac/interval?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`, 'curl-pac-interval')}
                            >
                              {copiedEndpoint === 'curl-pac-interval' ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Copy cURL
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                            {`curl -X GET "${API_CONFIG.baseUrl || 'https://api.example.com'}/pac/interval?from=2026-07-01T00:00:00Z&to=2026-07-08T23:59:59Z&env=${environment}&page=1&limit=10" \\\n  -H "x-api-key: ${apiKeyData?.apiKey || '<your_api_key>'}"`}
                          </pre>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Example Response</h4>
                          <pre className="p-4 rounded-xl bg-slate-950/80 border border-border/40 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px] shadow-inner no-scrollbar">
{`{
  "items": [
    {
      "interval_id": 1,
      "session_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "interval_start_date_time": "2026-07-01 10:00:00",
      "interval_end_date_time": "2026-07-01 10:14:59",
      "interval_kw": 42.1,
      "interval_kwh": 7.02
    },
    {
      "interval_id": 2,
      "session_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "interval_start_date_time": "2026-07-01 10:15:00",
      "interval_end_date_time": "2026-07-01 10:29:59",
      "interval_kw": 45.0,
      "interval_kwh": 11.25
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
