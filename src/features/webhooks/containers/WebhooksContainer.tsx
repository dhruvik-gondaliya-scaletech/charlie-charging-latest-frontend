'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { useWebhooks, useWebhookSecret } from '@/hooks/get/useWebhooks';
import {
  useCreateWebhook
} from '@/hooks/post/useWebhookMutations';
import { useUpdateWebhook } from '@/hooks/patch/useWebhookMutations';
import { useDeleteWebhook } from '@/hooks/delete/useWebhookMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/shared/Table';
import { WebhookConfiguration, WebhookEvent } from '@/types';
import { formatDate } from '@/lib/date';
import { staggerContainer, staggerItem } from '@/lib/motion';
import {
  Plus,
  Webhook as WebhookIcon,
  Globe,
  Key,
  FileText,
  Power,
  PowerOff,
  Edit,
  Trash2,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { ActionIconButton } from '@/components/shared/ActionIconButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { WebhookFormModal } from '../components/WebhookFormModal';
import { WebhookSecretModal } from '../components/WebhookSecretModal';
import { WebhookFormData } from '@/lib/validations/webhook.schema';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { toast } from 'sonner';
import { DEFAULT_PAGE_SIZE, FRONTEND_ROUTES } from '@/constants/constants';
import { cn } from '@/lib/utils';

export function WebhooksContainer() {
  const router = useRouter();
  const { data: webhooks, isLoading } = useWebhooks();
  const createWebhook = useCreateWebhook();
  const updateWebhook = useUpdateWebhook();
  const deleteWebhook = useDeleteWebhook();

  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfiguration | null>(null);

  const handleCreate = useCallback(async (data: WebhookFormData) => {
    try {
      await createWebhook.mutateAsync(data);
      setIsFormOpen(false);
    } catch {
      // toast handled in hook
    }
  }, [createWebhook]);

  const handleUpdate = useCallback(async (data: WebhookFormData) => {
    if (!selectedWebhook) return;
    try {
      await updateWebhook.mutateAsync({ id: selectedWebhook.id, data });
      setIsFormOpen(false);
      setSelectedWebhook(null);
    } catch {
      // toast handled in hook
    }
  }, [selectedWebhook, updateWebhook]);

  const handleDelete = useCallback((webhook: WebhookConfiguration) => {
    setSelectedWebhook(webhook);
    setIsDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedWebhook) return;
    try {
      await deleteWebhook.mutateAsync(selectedWebhook.id);
      setIsDeleteOpen(false);
      setSelectedWebhook(null);
    } catch {
      // toast handled in hook
    }
  }, [deleteWebhook, selectedWebhook]);

  const handleToggleStatus = useCallback(async (webhook: WebhookConfiguration) => {
    try {
      await updateWebhook.mutateAsync({
        id: webhook.id,
        data: { isActive: !webhook.isActive }
      });
    } catch {
      // toast handled in hook
    }
  }, [updateWebhook]);

  const columns: ColumnDef<WebhookConfiguration>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Webhook Integration',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-bold text-foreground tracking-tight leading-none mb-1">
                {row.getValue('name')}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                <Globe className="h-2.5 w-2.5" />
                <span className="truncate max-w-[150px]">{new URL(row.original.url).hostname}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'url',
        header: 'Endpoint URL',
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="group flex items-center gap-2 max-w-sm cursor-help">
                <span className="text-sm font-mono text-muted-foreground truncate">
                  {row.getValue('url')}
                </span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[400px] break-all">
              <p className="text-xs font-mono">{row.getValue('url')}</p>
            </TooltipContent>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'events',
        header: 'Subscribed Events',
        cell: ({ row }) => {
          const events = row.getValue('events') as WebhookEvent[];
          const getEventColor = (event: WebhookEvent) => {
            switch (event) {
              case WebhookEvent.START_TRANSACTION:
                return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
              case WebhookEvent.STOP_TRANSACTION:
                return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
              case WebhookEvent.STATUS_NOTIFICATION:
                return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
              case WebhookEvent.METER_VALUES:
                return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
              default:
                return 'bg-primary/5 border-primary/20 text-primary';
            }
          };

          return (
            <div className="flex flex-wrap gap-1.5">
              {events.slice(0, 2).map((event) => (
                <Badge
                  key={event}
                  variant="outline"
                  className={cn(
                    'rounded-full border shadow-sm px-2.5 py-0.5 text-[10px] uppercase font-bold whitespace-nowrap',
                    getEventColor(event)
                  )}
                >
                  {event}
                </Badge>
              ))}
              {events.length > 2 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="rounded-full border shadow-sm px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground cursor-help bg-muted"
                    >
                      +{events.length - 2} MORE
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="p-3 bg-card/95 backdrop-blur-md border border-primary/20 shadow-2xl rounded-2xl mt-1">
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Subscribed Events</p>
                      <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                        {events.map((event) => (
                          <Badge
                            key={event}
                            variant="outline"
                            className={cn(
                              'rounded-full border shadow-sm px-2.5 py-0.5 text-[10px] uppercase font-bold whitespace-nowrap',
                              getEventColor(event)
                            )}
                          >
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
          const isActive = row.getValue('isActive');
          const colorClasses = isActive
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            : 'bg-muted text-muted-foreground border-border';
          return (
            <Badge
              variant="outline"
              className={cn(
                'capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm',
                colorClasses
              )}
            >
              {isActive ? 'live' : 'paused'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Last Modified',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {formatDate(row.getValue('createdAt'))}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
              Revision Logged
            </span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1 px-2">
            <ActionIconButton
              tone="info"
              tooltip="View Delivery Logs"
              href={`${FRONTEND_ROUTES.WEBHOOKS_LOGS(row.original.id)}?name=${encodeURIComponent(row.original.name)}`}
              icon={<FileText className="h-4 w-4" />}
            />

            <ActionIconButton
              tone="warning"
              tooltip="View Secret Key"
              icon={<Key className="h-4 w-4" />}
              onClick={() => {
                setSelectedWebhook(row.original);
                setIsSecretOpen(true);
              }}
            />

            <ActionIconButton
              tone="primary"
              tooltip="Modify Settings"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => {
                setSelectedWebhook(row.original);
                setIsFormOpen(true);
              }}
            />

            <ActionIconButton
              tone={row.original.isActive ? 'warning' : 'success'}
              tooltip={row.original.isActive ? 'Pause Integration' : 'Resume Integration'}
              icon={row.original.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              onClick={() => handleToggleStatus(row.original)}
            />

            <ActionIconButton
              tone="destructive"
              tooltip="Delete Webhook"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => handleDelete(row.original)}
            />
          </div>
        ),
        meta: { headerAlign: 'center' }
      },
    ],
    [handleDelete, handleToggleStatus]
  );

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
              Webhooks
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Manage your service integrations and real-time charging event stream hooks.</p>
          </div>
        </motion.div>


        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Hooks"
            value={webhooks?.length || 0}
            icon={WebhookIcon}
            color="text-primary"
            bottomRightGlobe="bg-primary"
            description="Total configured integrations"
          />
          <StatCard
            title="Active Hooks"
            value={webhooks?.filter(w => w.isActive).length || 0}
            icon={Power}
            color="text-green-500"
            bottomRightGlobe="bg-green-500"
            description="Currently running streams"
          />
          <StatCard
            title="Events Subscribed"
            value={webhooks?.reduce((acc, w) => acc + w.events.length, 0) || 0}
            icon={FileText}
            color="text-blue-500"
            bottomRightGlobe="bg-blue-500"
            description="Total event listeners active"
          />
        </motion.div>

        {/* Tabular Matrix */}
        <motion.div variants={staggerItem} className="relative">
          <Table<WebhookConfiguration>
            data={webhooks || []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            appendWithSearch={
              <Button
                onClick={() => {
                  setSelectedWebhook(null);
                  setIsFormOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
              >
                <Plus className="h-4 w-4" />
                New Integration
              </Button>
            }
            pageSize={DEFAULT_PAGE_SIZE}
            maxHeight="700px"
            className="border-none shadow-none"
            renderMobileCard={(webhook) => (
              <div className="bg-card border border-border rounded-[1.5rem] p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight">{webhook.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      <Globe className="h-2.5 w-2.5" />
                      {new URL(webhook.url).hostname}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm text-[9px] uppercase tracking-tighter',
                      webhook.isActive
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border-border'
                    )}
                  >
                    {webhook.isActive ? 'live' : 'paused'}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Endpoint URL</span>
                  <p className="text-sm font-mono text-muted-foreground break-all bg-muted/30 p-2 rounded-lg border border-border/20">
                    {webhook.url}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {webhook.events.slice(0, 3).map((event) => (
                    <Badge
                      key={event}
                      variant="outline"
                      className="rounded-full bg-primary/5 border-primary/20 text-primary px-2.5 py-0.5 text-[9px] uppercase font-bold"
                    >
                      {event}
                    </Badge>
                  ))}
                  {webhook.events.length > 3 && (
                    <Badge variant="outline" className="rounded-full bg-muted border-border text-muted-foreground px-2 py-0.5 text-[9px] font-bold">
                      +{webhook.events.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/50">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
                    onClick={() => {
                      router.push(`${FRONTEND_ROUTES.WEBHOOKS_LOGS(webhook.id)}?name=${encodeURIComponent(webhook.name)}`);
                    }}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                    onClick={() => {
                      setSelectedWebhook(webhook);
                      setIsSecretOpen(true);
                    }}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-xl bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    onClick={() => {
                      setSelectedWebhook(webhook);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-xl border-2 hover:opacity-80 transition-opacity",
                      webhook.isActive
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    )}
                    onClick={() => handleToggleStatus(webhook)}
                  >
                    {webhook.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(webhook)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          />
        </motion.div>

        {/* Modals */}
        <WebhookFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={selectedWebhook ? handleUpdate : handleCreate}
          initialData={selectedWebhook}
          isLoading={createWebhook.isPending || updateWebhook.isPending}
        />

        <SecretModalWrapper
          isOpen={isSecretOpen}
          onClose={() => setIsSecretOpen(false)}
          webhook={selectedWebhook}
        />

        <AnimatedModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            if (!isFormOpen && !isSecretOpen) setSelectedWebhook(null);
          }}
          title="Delete Webhook"
          className="max-w-md"
        >
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">Are you absolutely sure?</h3>
            <p className="text-muted-foreground text-sm max-w-[300px] mb-8">
              This action cannot be undone. You are about to delete <span className="text-foreground font-bold font-mono">"{selectedWebhook?.name}"</span> integration.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12 font-bold"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteWebhook.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-destructive/20"
                onClick={handleConfirmDelete}
                disabled={deleteWebhook.isPending}
              >
                {deleteWebhook.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Webhook'
                )}
              </Button>
            </div>
          </div>
        </AnimatedModal>
      </motion.div>
    </TooltipProvider>
  );
}

function SecretModalWrapper({
  isOpen,
  onClose,
  webhook
}: {
  isOpen: boolean;
  onClose: () => void;
  webhook: WebhookConfiguration | null
}) {
  const { data, isLoading } = useWebhookSecret(webhook?.id || '');

  if (!webhook) return null;

  return (
    <WebhookSecretModal
      isOpen={isOpen}
      onClose={onClose}
      secret={data?.secretKey || (isLoading ? 'Loading...' : 'Error fetching secret')}
      webhookName={webhook.name}
    />
  );
}
