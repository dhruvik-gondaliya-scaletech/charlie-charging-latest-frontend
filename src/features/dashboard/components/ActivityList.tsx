import { RecentActivity } from '@/types';
import { formatTimeAgo } from '@/lib/date';
import { Table } from '@/components/shared/Table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Activity, Battery, User, Clock, Zap, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityListProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

export function ActivityList({ activities, isLoading = false }: ActivityListProps) {
  const columns: ColumnDef<RecentActivity>[] = [
    {
      accessorKey: 'event',
      header: 'Event',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Activity className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-semibold text-sm tracking-tight">{row.original.event}</span>
        </div>
      ),
    },
    {
      accessorKey: 'station',
      header: 'Station',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
          <Battery className="h-4 w-4 text-blue-500/70" />
          <span className="text-sm font-medium">{row.original.station}</span>
        </div>
      ),
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
          <User className="h-4 w-4 text-purple-500/70" />
          <span className="text-sm font-medium">{row.original.user}</span>
        </div>
      ),
    },
    {
      accessorKey: 'eventTime',
      header: 'Time',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground/60">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{formatTimeAgo(row.original.eventTime)}</span>
        </div>
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
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => (
        row.original.duration !== undefined ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-400">
            <Timer className="h-3 w-3" />
            <span>{row.original.duration}m</span>
          </div>
        ) : '-'
      ),
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

  return (
    <Table
      data={activities}
      columns={columns}
      isLoading={isLoading}
      pageSize={10}
      showSearch={false}
      showPagination={true}
      maxHeight="540px"
      className="border-none shadow-none bg-transparent"
    />
  );
}
