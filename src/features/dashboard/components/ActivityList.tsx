import { useMemo } from 'react';
import { RecentActivity, AppPermission } from '@/types';
import { formatDateTime } from '@/lib/date';
import { Table } from '@/components/shared/Table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Battery, User, Clock, Zap, Timer, Terminal, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ProtectedAction } from '@/components/shared/ProtectedAction';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityListProps {
  activities: RecentActivity[];
  isLoading?: boolean;
  onViewLogs?: (stationId: string, sessionId: string) => void;
  limit?: number;
}

export function ActivityList({ activities, isLoading = false, onViewLogs, limit = 25 }: ActivityListProps) {
  const router = useRouter();

  const handleRowClick = (activity: RecentActivity) => {
    if (activity.stationId) {
      const sessionDate = activity.startDate || activity.eventTime;
      let dateStr = '';
      if (sessionDate) {
        const d = new Date(sessionDate);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        }
      }
      const params = new URLSearchParams();
      params.set('tab', 'sessions');
      if (dateStr) {
        params.set('date', dateStr);
      }
      if (activity.eventId) {
        params.set('sessionId', activity.eventId);
      }
      router.push(`/stations/${activity.stationId}?${params.toString()}`);
    }
  };

  const { hasPermission } = useAuth();
  const canViewLogs = hasPermission(AppPermission.OCPP_LOGS_READ);

  const columns: ColumnDef<RecentActivity>[] = useMemo(() => {
    const cols: ColumnDef<RecentActivity>[] = [
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: ({ row }) => {
          const val = row.original.startDate || row.original.eventTime;
          return (
            <div className="flex items-center gap-2 text-muted-foreground/80">
              <Clock className="h-3.5 w-3.5 text-sky-500/70" />
              <span className="text-xs font-semibold">{formatDateTime(val)}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'user',
        header: 'Start By',
        cell: ({ row }) => {
          const useMode = row.original.useMode;
          return (
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <User className="h-4 w-4 text-purple-500/70" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold leading-none">{row.original.user}</span>
                {useMode && (
                  <span className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit",
                    useMode === 'CSMS'
                      ? "bg-violet-500/10 text-violet-500 border-violet-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  )}>
                    {useMode}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'station',
        header: 'Station',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors cursor-pointer font-semibold">
            <Battery className="h-4 w-4 text-blue-500/70" />
            <span className="text-sm font-semibold">{row.original.station}</span>
          </div>
        ),
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => (
          row.original.duration !== undefined ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <Timer className="h-3.5 w-3.5" />
              <span>{row.original.duration}m</span>
            </div>
          ) : '-'
        ),
      },
      {
        accessorKey: 'energyDelivered',
        header: 'Energy',
        cell: ({ row }) => (
          row.original.energyDelivered !== undefined ? (
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-500/90">
              <Zap className="h-3 w-3" />
              <span>{row.original.energyDelivered.toFixed(2)} kWh</span>
            </div>
          ) : '-'
        ),
      },
      {
        accessorKey: 'cost',
        header: 'Cost',
        cell: ({ row }) => {
          const cost = row.original.cost;
          return (
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-foreground">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              <span>{cost !== undefined && cost !== null ? cost.toFixed(2) : '0.00'}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status.toLowerCase();

          let colorClasses = "";
          if (status === 'completed' || status === 'success') {
            colorClasses = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
          } else if (status === 'active' || status === 'in progress' || status === 'charging') {
            colorClasses = "bg-blue-500/10 text-blue-500 border-blue-500/20";
          } else if (status === 'failed' || status === 'error' || status === 'faulted') {
            colorClasses = "bg-destructive/10 text-destructive border-destructive/20";
          } else {
            colorClasses = "bg-muted text-muted-foreground border-border";
          }

          return (
            <Badge
              variant="outline"
              className={cn("capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-xs", colorClasses)}
            >
              {row.original.status}
            </Badge>
          );
        },
      },
    ];

    if (canViewLogs) {
      cols.push({
        id: 'actions',
        header: 'View Logs',
        cell: ({ row }) => {
          const { stationId, eventId } = row.original;
          if (!stationId || !eventId) return '-';
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewLogs?.(stationId, eventId);
              }}
              className="h-8 px-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10"
            >
              <Terminal className="h-3.5 w-3.5 mr-1.5" />
              View Logs
            </Button>
          );
        },
      });
    }

    return cols;
  }, [canViewLogs, onViewLogs]);

  return (
    <Table
      data={activities}
      columns={columns}
      isLoading={isLoading}
      pageSize={limit}
      showSearch={false}
      showPagination={false}
      onRowClick={handleRowClick}
      maxHeight="540px"
      className="border-none shadow-none bg-transparent"
      renderMobileCard={(activity) => {
        const status = activity.status.toLowerCase();
        let colorClasses = "";
        if (status === 'completed' || status === 'success') {
          colorClasses = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        } else if (status === 'active' || status === 'in progress' || status === 'charging') {
          colorClasses = "bg-blue-500/10 text-blue-500 border-blue-500/20";
        } else if (status === 'failed' || status === 'error' || status === 'faulted') {
          colorClasses = "bg-destructive/10 text-destructive border-destructive/20";
        } else {
          colorClasses = "bg-muted text-muted-foreground border-border";
        }

        const val = activity.startDate || activity.eventTime;

        return (
          <div
            onClick={() => handleRowClick(activity)}
            className="bg-card/40 mx-4 border border-border/40 rounded-2xl p-4 space-y-3 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Battery className="h-4 w-4 text-blue-500" />
                </div>
                <span className="font-bold text-sm tracking-tight">{activity.station}</span>
              </div>
              <Badge variant="outline" className={cn("capitalize font-bold px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-tighter", colorClasses)}>
                {activity.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <User className="h-3.5 w-3.5 text-purple-500/70" />
                <div className="flex flex-col gap-0.5">
                  <span className="truncate">By: {activity.user}</span>
                  {activity.useMode && (
                    <span className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit",
                      activity.useMode === 'CSMS'
                        ? "bg-violet-500/10 text-violet-500 border-violet-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    )}>
                      {activity.useMode}
                    </span>
                  )}
                </div>
              </div>
              {activity.duration !== undefined && (
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium justify-end">
                  <Timer className="h-3.5 w-3.5 text-blue-400" />
                  <span>{activity.duration}m</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/10">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                <Clock className="h-3 w-3" />
                {formatDateTime(val)}
              </div>
              <div className="flex items-center gap-3">
                {activity.energyDelivered !== undefined && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500/90 font-mono">
                    <Zap className="h-3 w-3" />
                    {activity.energyDelivered.toFixed(1)} kWh
                  </div>
                )}
                {activity.cost !== undefined && (
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-foreground font-mono">
                    <DollarSign className="h-3 w-3 text-emerald-500" />
                    {activity.cost.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {activity.stationId && activity.eventId && (
              <ProtectedAction permission={AppPermission.OCPP_LOGS_READ}>
                <div className="pt-2 border-t border-border/10 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewLogs?.(activity.stationId!, activity.eventId!);
                    }}
                    className="h-7 px-2 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10"
                  >
                    <Terminal className="h-3 w-3 mr-1" />
                    View Logs
                  </Button>
                </div>
              </ProtectedAction>
            )}
          </div>
        );
      }}
    />
  );
}
