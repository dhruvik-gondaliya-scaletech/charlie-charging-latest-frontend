'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTenants } from '@/hooks/get/useTenants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { TenantList } from '../components/TenantList';
import { EmptyTenants } from '../components/EmptyTenants';

export function TenantsContainer() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: tenantsResponse, isLoading } = useTenants(searchTerm);

  const tenants = tenantsResponse?.data || [];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-muted-foreground">Manage tenant organizations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : tenants.length > 0 ? (
              <TenantList tenants={tenants} />
            ) : (
              <EmptyTenants />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
