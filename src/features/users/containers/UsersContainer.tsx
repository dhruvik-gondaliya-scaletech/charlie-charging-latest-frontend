'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useUsers } from '@/hooks/get/useUsers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users as UsersIcon,
  UserPlus,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
  Calendar,
  Activity,
  ShieldAlert,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useInviteUser } from '@/hooks/post/useAuthMutations';
import { useDeleteUser } from '@/hooks/delete/useUserMutations';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { User } from '@/types';
import { formatDate } from '@/lib/date';
import { UserInvitationModal } from '../components/UserInvitationModal';
import { StatCard } from '../../dashboard/components/StatCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { AnimatedModal } from '@/components/shared/AnimatedModal';

export function UsersContainer() {
  const { data: users, isLoading, error } = useUsers();
  const inviteUser = useInviteUser();
  const deleteUser = useDeleteUser();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const stats = useMemo(() => {
    if (!users) return { total: 0, active: 0, pending: 0 };
    return {
      total: users.length,
      active: users.filter(u => u.isActive && u.isEmailVerified).length,
      pending: users.filter(u => !u.isEmailVerified).length,
    };
  }, [users]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, {
      onSettled: () => {
        setDeleteTarget(null);
      },
    });
  };

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Enterprise Identity',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground">
                {row.original.firstName || row.original.lastName ? `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim() : 'New Operator'}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Mail className="h-2.5 w-2.5 opacity-60" />
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Security Tier',
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize font-black px-2.5 py-0.5 rounded-full border bg-muted/30 text-[10px] tracking-tight flex items-center gap-1 w-fit">
            <Shield className="h-3 w-3 opacity-60" />
            {row.getValue('role')}
          </Badge>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          const isVerified = row.original.isEmailVerified;

          if (!isActive) return (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1 w-fit">
              <XCircle className="h-3 w-3" />
              Inactive
            </Badge>
          );

          if (!isVerified) return (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1 w-fit">
              <Activity className="h-3 w-3" />
              Pending
            </Badge>
          );

          return (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1 w-fit">
              <CheckCircle2 className="h-3 w-3" />
              Active
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Onboarding Date',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80 tracking-tight">
            <Calendar className="h-3.5 w-3.5 opacity-40" />
            {formatDate(row.getValue('createdAt'))}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const user = row.original;
          const isPending = !user.isActive || !user.isEmailVerified;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!isPending || inviteUser.isPending}
                onClick={() => {
                  inviteUser.mutate({
                    email: user.email,
                    role: 'admin',
                  });
                }}
                className="h-8 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-primary/5 hover:bg-primary/10 border-primary/10 text-primary transition-all flex items-center gap-1.5"
              >
                {inviteUser.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Mail className="h-3 w-3" />
                )}
                Resend Mail
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(user)}
                className="h-8 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-destructive/5 hover:bg-destructive/10 border-destructive/10 text-destructive transition-all flex items-center gap-1.5"
              >
                <Trash2 className="h-3 w-3" />
                <span className='leading-none'>Delete</span>
              </Button>
            </div>
          );
        },
      },
    ],
    [inviteUser]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black">Authentication Registry Error</h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed uppercase tracking-wider opacity-60">Failed to establish connection with the user directory. Please secure your network and retry.</p>
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
              Personnel Registry
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Enterprise workforce &amp; access control management</p>
          </div>
        </motion.div>

        {/* Performance Stats Overlay */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Workforce"
            value={stats.total}
            icon={UsersIcon}
            color="text-primary"
            bottomRightGlobe="bg-primary"
            description="Enrolled accounts in workspace"
          />
          <StatCard
            title="Verified Access"
            value={stats.active}
            secondary={{ value: stats.total - stats.active, label: 'Unverified' }}
            icon={CheckCircle2}
            color="text-emerald-500"
            bottomRightGlobe="bg-emerald-500"
            description="Fully authenticated operators"
          />
          <StatCard
            title="Pending Onboarding"
            value={stats.pending}
            icon={Activity}
            color="text-amber-500"
            bottomRightGlobe="bg-amber-500"
            description="Users waiting for activation"
          />
        </motion.div>

        {/* Tabular Matrix */}
        <motion.div variants={staggerItem} className="relative">
          <Table<User>
            data={users || []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            appendWithSearch={
              <Button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
              >
                <UserPlus className="h-4 w-4" />
                Invite Operator
              </Button>
            }
            pageSize={DEFAULT_PAGE_SIZE}
            maxHeight="700px"
            className="border-none shadow-none"
            emptyState={
              <div className="py-24 flex flex-col items-center justify-center text-center gap-6 bg-card/10 rounded-[2.5rem] border-2 border-dashed border-border/40">
                <div className="p-6 rounded-full bg-primary/5 text-primary/40 ring-1 ring-primary/10">
                  <UsersIcon className="h-16 w-16" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-foreground">Registry Empty</h3>
                  <p className="max-w-xs text-muted-foreground font-medium text-xs leading-relaxed mx-auto uppercase tracking-wider opacity-60">
                    No personnel detected in the system. Start by inviting your first enterprise operator.
                  </p>
                </div>
                <Button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-black px-8 mt-4 uppercase tracking-widest text-[10px]"
                >
                  Onboard First User
                </Button>
              </div>
            }
          />
        </motion.div>

        <UserInvitationModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
        />

        {/* Delete Confirmation Modal */}
        <AnimatedModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete User"
          description="This action will remove the user from the system. They will no longer be able to log in."
          size="sm"
          footer={
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteUser.isPending}
                className="flex-1 sm:flex-none"
              >
                {deleteUser.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete User
              </Button>
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Trash2 className="h-10 w-10 text-destructive" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-bold text-foreground">
                {deleteTarget?.firstName || deleteTarget?.lastName
                  ? `${deleteTarget?.firstName || ''} ${deleteTarget?.lastName || ''}`.trim()
                  : deleteTarget?.email}
              </span>
              ?
            </p>
          </div>
        </AnimatedModal>
      </motion.div>
    </TooltipProvider>
  );
}
