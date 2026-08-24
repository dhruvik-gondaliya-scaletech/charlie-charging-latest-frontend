'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { AppPermission } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { FileText, MapPin, Terminal } from 'lucide-react';

import { ReportsDownloadTab } from '@/features/reports/components/ReportsDownloadTab';
import { LocationGroupsTab } from '@/features/reports/components/LocationGroupsTab';
import { ApiDocsTab } from '@/features/reports/components/ApiDocsTab';

export function ReportsContainer() {
  const { hasPermission } = useAuth();
  const canReadApiDocs = hasPermission(AppPermission.API_DOCS_READ);
  const canUpdateLocations = hasPermission(AppPermission.LOCATION_UPDATE);
  const colsCount = 1 + (canUpdateLocations ? 1 : 0) + (canReadApiDocs ? 1 : 0);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6 sm:space-y-8 p-3 sm:p-6 md:p-8 max-w-[1600px] mx-auto pb-16"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Reports &amp; Reporting Group Management
        </h1>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 tracking-tight">
          Manage location filters for regulatory reporting compliance and network export data.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={staggerItem}>
        <Tabs defaultValue="downloads" className="space-y-6">
          <TabsList className={cn(
            "bg-muted/40 p-1 border border-border/40 rounded-xl backdrop-blur-md w-full sm:w-auto grid sm:inline-flex h-auto gap-1 shadow-inner",
            colsCount === 3 ? "grid-cols-3" : colsCount === 2 ? "grid-cols-2" : "grid-cols-1"
          )}>
            <TabsTrigger value="downloads" className="rounded-lg font-bold px-1.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="sm:hidden">Reports</span>
              <span className="hidden sm:inline">Download Reports</span>
            </TabsTrigger>
            {canUpdateLocations && (
              <TabsTrigger value="groups" className="rounded-lg font-bold px-1.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="sm:hidden">Groups</span>
                <span className="hidden sm:inline">Location Group</span>
              </TabsTrigger>
            )}
            {canReadApiDocs && (
              <TabsTrigger value="api-docs" className="rounded-lg font-bold px-1.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
                <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>API Docs</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Downloads Tab */}
          <TabsContent value="downloads">
            <ReportsDownloadTab />
          </TabsContent>

          {/* Location Group Tab */}
          {canUpdateLocations && (
            <TabsContent value="groups">
              <LocationGroupsTab />
            </TabsContent>
          )}

          {/* API Docs Tab */}
          {canReadApiDocs && (
            <TabsContent value="api-docs">
              <ApiDocsTab />
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
