'use client';

import { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Permission } from '@/types';
import { PERMISSION_MODULES, PermissionModule } from '@/lib/permissions';
import { PermissionBadge } from '@/components/shared/PermissionBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PermissionMatrixProps {
  /** All available permissions */
  allPermissions: Permission[];
  /** Currently selected permission codes */
  selected: string[];
  /** If false, renders in read-only mode (no checkboxes) */
  editable?: boolean;
  onChange?: (codes: string[]) => void;
}

const MODULE_LABEL: Record<string, string> = {
  location: 'Locations',
  station: 'Stations',
  connector: 'Connectors',
  session: 'Sessions',
  ocpp: 'OCPP Commands',
  users: 'Users',
  reports: 'Reports',
  tariff: 'Tariffs',
  billing: 'Billing',
};

export function PermissionMatrix({
  allPermissions,
  selected,
  editable = true,
  onChange,
}: PermissionMatrixProps) {
  // Group by module
  const grouped = PERMISSION_MODULES.reduce<Record<PermissionModule, Permission[]>>(
    (acc, mod) => {
      acc[mod] = allPermissions.filter((p) => p.module === mod);
      return acc;
    },
    {} as Record<PermissionModule, Permission[]>,
  );

  const toggle = (code: string) => {
    if (!editable || !onChange) return;
    onChange(
      selected.includes(code)
        ? selected.filter((c) => c !== code)
        : [...selected, code],
    );
  };

  const toggleModule = (mod: PermissionModule) => {
    if (!editable || !onChange) return;
    const modCodes = grouped[mod].map((p) => p.code);
    const allSelected = modCodes.every((c) => selected.includes(c));
    onChange(
      allSelected
        ? selected.filter((c) => !modCodes.includes(c))
        : [...new Set([...selected, ...modCodes])],
    );
  };

  return (
    <div className="space-y-6">
      {PERMISSION_MODULES.map((mod) => {
        const perms = grouped[mod];
        if (!perms.length) return null;
        const modCodes = perms.map((p) => p.code);
        const allSelected = modCodes.every((c) => selected.includes(c));
        const someSelected = modCodes.some((c) => selected.includes(c));

        return (
          <div key={mod} className="rounded-lg border border-white/10 bg-white/3 p-4">
            {/* Module header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white/80">
                {MODULE_LABEL[mod] ?? mod}
              </h4>
              {editable && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-white/50 hover:text-white"
                  onClick={() => toggleModule(mod)}
                >
                  {allSelected ? 'Deselect all' : someSelected ? 'Select all' : 'Select all'}
                </Button>
              )}
            </div>

            {/* Permissions grid */}
            <div className="flex flex-wrap gap-2">
              {perms.map((perm) => {
                const isSelected = selected.includes(perm.code);
                return (
                  <button
                    key={perm.code}
                    type="button"
                    onClick={() => toggle(perm.code)}
                    disabled={!editable}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all duration-150',
                      editable && 'cursor-pointer hover:scale-[1.02]',
                      !editable && 'cursor-default',
                      isSelected
                        ? 'bg-primary/20 border-primary/50 text-primary'
                        : 'bg-white/5 border-white/10 text-white/40',
                    )}
                    title={perm.description ?? perm.code}
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? 'Remove' : 'Add'} ${perm.code} permission`}
                  >
                    {editable && (
                      isSelected
                        ? <CheckSquare className="h-3.5 w-3.5" />
                        : <Square className="h-3.5 w-3.5" />
                    )}
                    <span className="font-mono">{perm.action}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
