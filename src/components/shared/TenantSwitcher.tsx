'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TenantSwitcherProps {
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export function TenantSwitcher({ className, side = 'right', align = 'start' }: TenantSwitcherProps) {
  const { tenant, user, switchTenant } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [switchingId, setSwitchingId] = React.useState<string | null>(null);

  const memberships = user?.memberships || [];
  const hasMultipleTenants = memberships.length > 1;

  const handleSwitch = async (tenantId: string) => {
    if (tenantId === tenant?.id) {
      setOpen(false);
      return;
    }

    setSwitchingId(tenantId);
    try {
      await switchTenant(tenantId);
      setOpen(false);
    } catch {
      setSwitchingId(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={!hasMultipleTenants}
          className={cn(
            'flex items-center justify-between w-full p-2.5 rounded-xl border bg-muted/40 hover:bg-muted/80 transition-colors text-left select-none text-xs font-medium group',
            hasMultipleTenants ? 'cursor-pointer hover:border-primary/40' : 'cursor-default opacity-90',
            className
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                Organization
              </span>
              <span className="truncate font-semibold text-foreground text-xs mt-1">
                {tenant?.name || 'Organization'}
              </span>
            </div>
          </div>

          {hasMultipleTenants && (
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
          )}
        </button>
      </PopoverTrigger>

      {hasMultipleTenants && (
        <PopoverContent className="w-64 p-2 rounded-2xl" side={side} align={align} sideOffset={8}>
          <div className="text-[11px] font-bold text-muted-foreground uppercase px-2 py-1 tracking-wider flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Switch Organization
          </div>

          <div className="space-y-1 mt-1 max-h-[240px] overflow-y-auto">
            {memberships.map((m) => {
              const isCurrent = m.tenantId === tenant?.id;
              const isPending = switchingId === m.tenantId;

              return (
                <button
                  key={m.tenantId}
                  type="button"
                  onClick={() => handleSwitch(m.tenantId)}
                  disabled={!!switchingId}
                  className={cn(
                    'flex items-center justify-between w-full p-2 rounded-xl text-xs text-left transition-colors cursor-pointer',
                    isCurrent
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-accent text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{m.tenantName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {m.role}
                    </Badge>
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    ) : isCurrent ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
