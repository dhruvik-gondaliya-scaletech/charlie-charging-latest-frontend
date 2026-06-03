'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useTenants } from '@/hooks/get/useTenants';
import {
  useCreateTenant,
  useActivateTenant,
  useDeactivateTenant,
  useRegenerateApiSecret,
  useConnectStripe,
  useResetTenantStripe,
} from '@/hooks/post/useTenantMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/shared/Table';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { TenantListResponse, Tenant } from '@/types';
import { formatDate } from '@/lib/date';
import { staggerContainer, staggerItem } from '@/lib/motion';
import {
  Plus,
  Building2,
  Users,
  Shield,
  Key,
  Power,
  PowerOff,
  Database,
  Calendar,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  RotateCcw,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ActionIconButton } from '@/components/shared/ActionIconButton';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { TenantFormModal } from '../components/TenantFormModal';
import { TenantSecretModal } from '../components/TenantSecretModal';
import { TenantFormData } from '@/lib/validations/tenant.schema';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DEFAULT_PAGE_SIZE, FRONTEND_ROUTES } from '@/constants/constants';

export function TenantsContainer() {
  const { data: tenantsResponse, isLoading } = useTenants();
  const createTenant = useCreateTenant();
  const activateTenant = useActivateTenant();
  const deactivateTenant = useDeactivateTenant();
  const regenerateSecret = useRegenerateApiSecret();
  const connectStripe = useConnectStripe();
  const resetStripe = useResetTenantStripe();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle onboarding status from URL
  useEffect(() => {
    const onboarding = searchParams.get('onboarding');
    if (onboarding === 'complete') {
      toast.success('Stripe onboarding completed successfully!');
      // Clean up URL
      router.replace('/tenants');
    } else if (onboarding === 'failed') {
      toast.error('Stripe onboarding failed or was cancelled.');
      // Clean up URL
      router.replace('/tenants');
    }
  }, [searchParams, router]);

  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [isConfirmDeactivateOpen, setIsConfirmDeactivateOpen] = useState(false);
  const [isConfirmRegenerateOpen, setIsConfirmRegenerateOpen] = useState(false);
  const [isConfirmResetStripeOpen, setIsConfirmResetStripeOpen] = useState(false);
  const [confirmTenantNameInput, setConfirmTenantNameInput] = useState('');
  const [acknowledgeDb, setAcknowledgeDb] = useState(false);
  const [generatedSecret, setGeneratedSecret] = useState('');
  const [selectedTenantName, setSelectedTenantName] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');

  const handleOpenResetModal = useCallback((tenant: TenantListResponse) => {
    setSelectedTenantId(tenant.id);
    setSelectedTenantName(tenant.name);
    setConfirmTenantNameInput('');
    setAcknowledgeDb(false);
    setIsConfirmResetStripeOpen(true);
  }, []);

  const tenants = tenantsResponse || [];

  const handleCreate = useCallback(async (data: TenantFormData) => {
    try {
      const tenant = await createTenant.mutateAsync(data);
      if (tenant?.apiSecret) {
        setGeneratedSecret(tenant.apiSecret);
        setSelectedTenantName(tenant.name);
        setIsFormOpen(false);
        setIsSecretOpen(true);
      } else {
        setIsFormOpen(false);
      }
    } catch {
      // toast handled in hook
    }
  }, [createTenant]);

  const handleRegenerateSecret = useCallback(async (tenant: TenantListResponse) => {
    try {
      const response = await regenerateSecret.mutateAsync(tenant.id);
      if (response?.apiSecret) {
        setGeneratedSecret(response.apiSecret);
        setSelectedTenantName(tenant.name);
        setIsSecretOpen(true);
        setIsConfirmRegenerateOpen(false);
      }
    } catch {
      // toast handled in hook
    }
  }, [regenerateSecret]);

  const handleDeactivate = useCallback(async (id: string) => {
    try {
      await deactivateTenant.mutateAsync(id);
      setIsConfirmDeactivateOpen(false);
    } catch {
      // toast handled in hook
    }
  }, [deactivateTenant]);

  const handleResetStripe = useCallback(async (id: string) => {
    try {
      await resetStripe.mutateAsync(id);
      setIsConfirmResetStripeOpen(false);
    } catch {
      // toast handled in hook
    }
  }, [resetStripe]);

  const handleActivate = useCallback(async (tenant: TenantListResponse) => {
    try {
      const response = await activateTenant.mutateAsync(tenant.id);
      if (response?.apiSecret) {
        setGeneratedSecret(response.apiSecret);
        setSelectedTenantName(tenant.name);
        setIsSecretOpen(true);
      }
    } catch {
      // toast handled in hook
    }
  }, [activateTenant]);

  const columns: ColumnDef<TenantListResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Organization',
        cell: ({ row }) => {
          const name = row.getValue('name') as string;
          return (
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-bold text-foreground tracking-tight leading-none mb-1">
                  {name}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  <Database className="h-2.5 w-2.5" />
                  <span>{row.original.schemaName}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'userCount',
        header: 'Total Workforce',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-lg bg-muted/50 border border-border/50 text-xs font-bold flex items-center gap-1.5">
              <Users className="h-3 w-3 text-muted-foreground" />
              {row.getValue('userCount')}
            </div>
          </div>
        ),
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
              {isActive ? 'active' : 'deactivated'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Onboarding Date',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {formatDate(row.getValue('createdAt'))}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
              Registration Logged
            </span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            {row.original.isDefault && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Default Root Tenant</TooltipContent>
              </Tooltip>
            )}

            <ActionIconButton
              tone="warning"
              tooltip="Regenerate API Secret"
              icon={<Key className="h-4 w-4" />}
              onClick={() => {
                setSelectedTenantId(row.original.id);
                setSelectedTenantName(row.original.name);
                setIsConfirmRegenerateOpen(true);
              }}
            />

            {row.original.isActive ? (
              <>
                <ActionIconButton
                  tone="info"
                  tooltip={row.original.stripeOnboarded ? 'Manage Stripe Connect' : 'Setup Stripe Connect'}
                  icon={<CreditCard className="h-4 w-4" />}
                  onClick={() => connectStripe.mutate(row.original.id)}
                  disabled={connectStripe.isPending}
                  className={row.original.stripeOnboarded ? 'text-indigo-500' : 'text-slate-400'}
                />

                {row.original.stripeAccountId && (
                  <ActionIconButton
                    tone="destructive"
                    tooltip="Reset Stripe Settings"
                    icon={<RotateCcw className="h-4 w-4" />}
                    onClick={() => handleOpenResetModal(row.original)}
                    disabled={resetStripe.isPending}
                  />
                )}

                <ActionIconButton
                  tone="destructive"
                  tooltip="Deactivate Tenant"
                  icon={<PowerOff className="h-4 w-4" />}
                  onClick={() => {
                    setSelectedTenantId(row.original.id);
                    setSelectedTenantName(row.original.name);
                    setIsConfirmDeactivateOpen(true);
                  }}
                  disabled={row.original.isDefault || deactivateTenant.isPending}
                />
              </>
            ) : (
              <ActionIconButton
                tone="success"
                tooltip="Activate Tenant"
                icon={<Power className="h-4 w-4" />}
                onClick={() => handleActivate(row.original)}
                disabled={activateTenant.isPending}
              />
            )}
          </div>
        ),
        meta: { headerAlign: 'center' }
      },
    ],
    [handleRegenerateSecret, handleActivate, deactivateTenant, activateTenant.isPending, connectStripe.isPending, connectStripe.mutate, resetStripe.isPending, handleOpenResetModal]
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
              Tenant Management
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Enterprise workspace orchestration and organizational identity control.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Tenants"
            value={tenants.length}
            icon={Building2}
            color="text-primary"
            bottomRightGlobe="bg-primary"
            description="Active organizational clusters"
          />
          <StatCard
            title="Active Clusters"
            value={tenants.filter(t => t.isActive).length}
            icon={CheckCircle}
            color="text-emerald-500"
            bottomRightGlobe="bg-emerald-500"
            description="Live operating environments"
          />
          <StatCard
            title="Global Workforce"
            value={tenants.reduce((acc, t) => acc + t.userCount, 0)}
            icon={Users}
            color="text-blue-500"
            bottomRightGlobe="bg-blue-500"
            description="Total enrolled operators"
          />
        </motion.div>

        {/* Table Section */}
        <motion.div variants={staggerItem}>
          <Table<TenantListResponse>
            data={tenants}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            appendWithSearch={
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            }
            pageSize={DEFAULT_PAGE_SIZE}
            maxHeight="700px"
            className="border-none shadow-none"
          />
        </motion.div>

        {/* Modals */}
        <TenantFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreate}
          isLoading={createTenant.isPending}
        />

        <TenantSecretModal
          isOpen={isSecretOpen}
          onClose={() => setIsSecretOpen(false)}
          secret={generatedSecret}
          tenantName={selectedTenantName}
        />

        {/* Confirmation Modals */}
        <AnimatedModal
          isOpen={isConfirmDeactivateOpen}
          onClose={() => setIsConfirmDeactivateOpen(false)}
          title="Deactivate Tenant?"
          description={`Are you sure you want to deactivate "${selectedTenantName}"? This organization and all its users will lose access immediately.`}
          className="max-w-md"
        >
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="flex gap-3 w-full mt-4">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDeactivateOpen(false)}
                className="flex-1 h-12 rounded-xl font-bold"
                disabled={deactivateTenant.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeactivate(selectedTenantId)}
                className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-destructive/20"
                disabled={deactivateTenant.isPending}
              >
                {deactivateTenant.isPending ? "Deactivating..." : "Yes, Deactivate"}
              </Button>
            </div>
          </div>
        </AnimatedModal>

        <AnimatedModal
          isOpen={isConfirmRegenerateOpen}
          onClose={() => setIsConfirmRegenerateOpen(false)}
          title="Regenerate API Secret?"
          description={`This will invalidate the existing secret for "${selectedTenantName}". Any systems using the old secret will stop working immediately.`}
          className="max-w-md"
        >
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
              <Key className="h-8 w-8 text-amber-500" />
            </div>
            <div className="flex gap-3 w-full mt-4">
              <Button
                variant="outline"
                onClick={() => setIsConfirmRegenerateOpen(false)}
                className="flex-1 h-12 rounded-xl font-bold"
                disabled={regenerateSecret.isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 border-none"
                onClick={() => handleRegenerateSecret({ id: selectedTenantId, name: selectedTenantName } as any)}
                disabled={regenerateSecret.isPending}
              >
                {regenerateSecret.isPending ? "Regenerating..." : "Yes, Regenerate"}
              </Button>
            </div>
          </div>
        </AnimatedModal>

        <AnimatedModal
          isOpen={isConfirmResetStripeOpen}
          onClose={() => setIsConfirmResetStripeOpen(false)}
          title="Reset Stripe Settings"
          description=""
          className="max-w-2xl"
        >
          <div className="flex flex-col gap-6 py-4 text-left">
            {/* Alert Header */}
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-4 items-start">
              <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-destructive tracking-tight">Warning: Destructive Operation</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  You are about to reset the Stripe integration for <strong>{selectedTenantName}</strong>. This action will break any active payment flows.
                </p>
              </div>
            </div>

            {/* Structured Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Database Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  1. Automatic Database Reset
                </h4>
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-xs space-y-2">
                  <p className="text-muted-foreground font-medium">The following database changes will occur:</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground font-medium">
                    <li><code className="text-destructive font-bold">stripe_account_id</code> is set to <code className="text-primary font-bold">NULL</code> on the tenant record.</li>
                    <li>Stripe onboarding flags are set to <code className="text-destructive font-bold">false</code>.</li>
                    <li>All <code className="text-destructive font-bold">stripe_customer_id</code> values for drivers of this tenant schema will be set to <code className="text-primary font-bold">NULL</code>.</li>
                  </ul>
                </div>
              </div>

              {/* Stripe Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-indigo-500" />
                  2. Manual Actions Required on Stripe
                </h4>
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-xs space-y-2">
                  <p className="text-muted-foreground font-medium">You must perform the following manually in your Stripe Dashboard:</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground font-medium">
                    <li>Log in to your <strong>Stripe Dashboard</strong>.</li>
                    <li>Deactivate or delete the Connected Account ID associated with this tenant if it is no longer needed.</li>
                    <li>Clean up any customer objects under that account to avoid dangling resources.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acknowledgeDb}
                  onChange={(e) => setAcknowledgeDb(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary bg-background"
                />
                <span className="text-xs text-muted-foreground font-medium">
                  I acknowledge that all local database Stripe references and onboarding status flags will be permanently reset to NULL/false.
                </span>
              </label>
            </div>

            {/* Name input confirmation */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
                Type the tenant name <span className="text-foreground font-extrabold">{selectedTenantName}</span> to confirm:
              </label>
              <input
                type="text"
                placeholder={selectedTenantName}
                value={confirmTenantNameInput}
                onChange={(e) => setConfirmTenantNameInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background/50 focus:outline-hidden focus:border-primary text-sm font-semibold"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full mt-4">
              <Button
                variant="outline"
                onClick={() => setIsConfirmResetStripeOpen(false)}
                className="flex-1 h-12 rounded-xl font-bold"
                disabled={resetStripe.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleResetStripe(selectedTenantId)}
                className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-destructive/20 flex items-center justify-center gap-2"
                disabled={
                  resetStripe.isPending ||
                  !acknowledgeDb ||
                  confirmTenantNameInput !== selectedTenantName
                }
              >
                {resetStripe.isPending ? (
                  "Resetting..."
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    Reset Stripe Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </AnimatedModal>
      </motion.div>
    </TooltipProvider>
  );
}
