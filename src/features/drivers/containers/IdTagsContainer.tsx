'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useIdTags } from '@/hooks/get/useIdTags';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Plus,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Edit2,
  ShieldAlert,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { IdTag, IdTagStatus } from '@/types';
import { formatDate } from '@/lib/date';
import { StatCard } from '../../dashboard/components/StatCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { IdTagFormModal } from '../components/IdTagFormModal';
import { useDeleteIdTag } from '@/hooks/delete/useDeleteIdTag';
import { AnimatedModal } from '@/components/shared/AnimatedModal';

export function IdTagsContainer() {
  const { data: idTags, isLoading, error } = useIdTags();
  const deleteIdTag = useDeleteIdTag();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedIdTag, setSelectedIdTag] = useState<IdTag | null>(null);
  const [idTagToDelete, setIdTagToDelete] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!idTags) return { total: 0, active: 0, blocked: 0 };
    return {
      total: idTags.length,
      active: idTags.filter(t => t.status === IdTagStatus.ACCEPTED).length,
      blocked: idTags.filter(t => t.status === IdTagStatus.BLOCKED).length,
    };
  }, [idTags]);

  const columns: ColumnDef<IdTag>[] = useMemo(
    () => [
      {
        accessorKey: 'idTag',
        header: 'RFID Tag ID',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-foreground uppercase">
              {row.getValue('idTag')}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'driver',
        header: 'Assigned Driver',
        cell: ({ row }) => {
          const driver = row.original.driver;
          if (!driver) return <span className="text-muted-foreground text-xs italic">Unassigned</span>;
          return (
            <div className="flex items-center gap-2 text-xs font-bold text-foreground tracking-tight">
              <User className="h-3.5 w-3.5 opacity-40" />
              {`${driver.firstName} ${driver.lastName}`}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          
          let badgeClass = "bg-muted/30 text-muted-foreground border-muted-foreground/20";
          let icon = <AlertTriangle className="h-3 w-3" />;

          if (status === IdTagStatus.ACCEPTED) {
            badgeClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            icon = <CheckCircle2 className="h-3 w-3" />;
          } else if (status === IdTagStatus.BLOCKED) {
            badgeClass = "bg-destructive/10 text-destructive border-destructive/20";
            icon = <XCircle className="h-3 w-3" />;
          } else if (status === IdTagStatus.EXPIRED) {
            badgeClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
            icon = <AlertTriangle className="h-3 w-3" />;
          }

          return (
            <Badge variant="outline" className={`${badgeClass} font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1 w-fit`}>
              {icon}
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'expiryDate',
        header: 'Expiry',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80 tracking-tight">
            <Calendar className="h-3.5 w-3.5 opacity-40" />
            {row.getValue('expiryDate') ? formatDate(row.getValue('expiryDate')) : 'Never'}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border/50 hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={() => {
                setSelectedIdTag(row.original);
                setIsFormModalOpen(true);
              }}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border/50 hover:bg-destructive/5 hover:text-destructive transition-colors"
              onClick={() => setIdTagToDelete(row.original.idTag)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black">ID Tag Directory Error</h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed uppercase tracking-wider opacity-60">Failed to establish connection with the ID tag database. Please secure your network and retry.</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={staggerItem} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Access Control (ID Tags)
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Manage RFID tags and authentication tokens for drivers</p>
          </div>
        </motion.div>

        {/* Performance Stats Overlay */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Tokens"
            value={stats.total}
            icon={CreditCard}
            color="text-primary"
            bottomRightGlobe="bg-primary"
            description="Enrolled ID tags in system"
          />
          <StatCard
            title="Authorized Tags"
            value={stats.active}
            icon={CheckCircle2}
            color="text-emerald-500"
            bottomRightGlobe="bg-emerald-500"
            description="Tags with active charging permissions"
          />
          <StatCard
            title="Blocked/Invalid"
            value={stats.blocked}
            icon={XCircle}
            color="text-destructive"
            bottomRightGlobe="bg-destructive"
            description="Tags with suspended permissions"
          />
        </motion.div>

        {/* Tabular Matrix */}
        <motion.div variants={staggerItem} className="relative">
          <Table<IdTag>
            data={idTags || []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            appendWithSearch={
              <Button
                onClick={() => {
                  setSelectedIdTag(null);
                  setIsFormModalOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
              >
                <Plus className="mr-2 h-4 w-4" />
                Enroll New Tag
              </Button>
            }
            pageSize={DEFAULT_PAGE_SIZE}
            maxHeight="700px"
            className="border-none shadow-none"
            emptyState={
              <div className="py-24 flex flex-col items-center justify-center text-center gap-6 bg-card/10 rounded-[2.5rem] border-2 border-dashed border-border/40">
                <div className="p-6 rounded-full bg-primary/5 text-primary/40 ring-1 ring-primary/10">
                  <CreditCard className="h-16 w-16" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-foreground">No Tags Found</h3>
                  <p className="max-w-xs text-muted-foreground font-medium text-xs leading-relaxed mx-auto uppercase tracking-wider opacity-60">
                    No access tokens detected. Register your first RFID tag to enable driver authentication.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedIdTag(null);
                    setIsFormModalOpen(true);
                  }}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-black px-8 mt-4 uppercase tracking-widest text-[10px]"
                >
                  Enroll First Tag
                </Button>
              </div>
            }
          />
        </motion.div>

        <IdTagFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedIdTag(null);
          }}
          initialData={selectedIdTag}
        />

        <AnimatedModal
          isOpen={!!idTagToDelete}
          onClose={() => setIdTagToDelete(null)}
          title="Security De-enrollment"
          description="Are you absolutely sure? This will permanently revoke all access permissions associated with this token."
          size="md"
          footer={
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIdTagToDelete(null)}
                className="flex-1 sm:flex-none uppercase tracking-widest text-[10px] font-black"
              >
                Abort
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (idTagToDelete) {
                    deleteIdTag.mutate(idTagToDelete);
                    setIdTagToDelete(null);
                  }
                }}
                className="flex-1 sm:flex-none uppercase tracking-widest text-[10px] font-black"
              >
                Confirm Revocation
              </Button>
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Trash2 className="h-10 w-10 text-destructive" />
            </div>
            <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">
              Token ID: <span className="text-foreground font-black tracking-widest">{idTagToDelete}</span>
            </p>
          </div>
        </AnimatedModal>
      </motion.div>
    </TooltipProvider>
  );
}
