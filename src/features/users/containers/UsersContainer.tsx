'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useUsers } from '@/hooks/get/useUsers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { User } from '@/types';
import { formatDate } from '@/lib/date';

export function UsersContainer() {
  const { data: users, isLoading, error } = useUsers();

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Name',
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.getValue('role')}
          </Badge>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
            {row.getValue('isActive') ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        accessorKey: 'isEmailVerified',
        header: 'Email Verified',
        cell: ({ row }) => (
          <Badge variant={row.getValue('isEmailVerified') ? 'default' : 'destructive'}>
            {row.getValue('isEmailVerified') ? 'Verified' : 'Unverified'}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => formatDate(row.getValue('createdAt')),
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-6 rounded-lg border border-destructive bg-destructive/10">
          <p className="text-destructive font-medium">Failed to load users</p>
          <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Table<User>
          data={users || []}
          columns={columns}
          isLoading={isLoading}
          showSearch
          searchPosition="end"
          pageSize={25}
          maxHeight="600px"
        />
      </motion.div>
    </motion.div>
  );
}
