'use client';

import { useState } from 'react';
import { TenantMembership } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface TenantSelectorProps {
  tenants: TenantMembership[];
  onSelectTenant: (tenantId: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function TenantSelector({
  tenants,
  onSelectTenant,
  onBack,
  isLoading,
}: TenantSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = async (tenantId: string) => {
    setSelectedId(tenantId);
    try {
      await onSelectTenant(tenantId);
    } catch {
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground p-0 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Select Organization</h2>
        <p className="text-sm text-muted-foreground">
          You have access to multiple tenants. Choose one to continue.
        </p>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {tenants.map((t) => {
          const isPending = isLoading && selectedId === t.tenantId;
          return (
            <motion.div
              key={t.tenantId}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSelect(t.tenantId)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  selectedId === t.tenantId
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border/60 bg-card/50 hover:bg-accent/50 hover:border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {t.tenantName}
                      {t.isMain && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/40 text-primary">
                          Main Account
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Role: <span className="font-medium text-foreground">{t.role || 'Member'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {t.role}
                  </Badge>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isPending ? 'animate-spin' : ''}`} />
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
