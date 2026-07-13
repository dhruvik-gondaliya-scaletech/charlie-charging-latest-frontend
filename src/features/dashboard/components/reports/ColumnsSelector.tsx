'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnItem {
  id: string;
  label: string;
}

interface ColumnPreset {
  id: string;
  label: string;
  columns: string[];
}

interface ColumnsSelectorProps {
  availableColumns: ColumnItem[];
  selectedColumns: string[];
  onColumnToggle: (columnId: string, checked: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  presets?: ColumnPreset[];
  onApplyPreset?: (columns: string[]) => void;
  disabled?: boolean;
}

export function ColumnsSelector({
  availableColumns,
  selectedColumns,
  onColumnToggle,
  onSelectAll,
  onDeselectAll,
  presets,
  onApplyPreset,
  disabled = false,
}: ColumnsSelectorProps) {
  return (
    <div className="space-y-3 flex flex-col min-h-0 h-full">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
          <FileSpreadsheet className="h-4 w-4 text-primary" /> Export Fields
        </Label>
        <div className="flex items-center space-x-2.5">
          <Checkbox
            id="col-select-all"
            checked={selectedColumns.length === availableColumns.length && availableColumns.length > 0}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectAll();
              } else {
                onDeselectAll();
              }
            }}
            disabled={disabled}
          />
          <Label
            htmlFor="col-select-all"
            className={cn(
              "text-xs font-medium select-none",
              disabled ? "cursor-not-allowed text-muted-foreground/60" : "cursor-pointer text-muted-foreground"
            )}
          >
            Select All
          </Label>
        </div>
      </div>

      {!disabled && presets && presets.length > 0 && onApplyPreset && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const isActive =
              selectedColumns.length === preset.columns.length &&
              preset.columns.every((id) => selectedColumns.includes(id));
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onApplyPreset(isActive ? [] : preset.columns)}
                className={cn(
                  'text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors cursor-pointer',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-primary/40 text-primary bg-primary/5 hover:bg-primary/10',
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}

      <div className={cn(
        "flex-1 min-h-[300px] max-h-[340px] overflow-y-auto pr-2 custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-2.5",
        disabled && "opacity-75"
      )}>
        {availableColumns.map((col) => {
          const isChecked = selectedColumns.includes(col.id);
          return (
            <div
              key={col.id}
              className="flex items-center space-x-2.5 p-1 rounded hover:bg-muted/30 transition-colors"
            >
              <Checkbox
                id={`col-node-${col.id}`}
                checked={isChecked}
                onCheckedChange={(checked) => onColumnToggle(col.id, !!checked)}
                disabled={disabled}
              />
              <Label
                htmlFor={`col-node-${col.id}`}
                className={cn(
                  "text-sm text-foreground/80 font-normal select-none",
                  disabled ? "cursor-not-allowed text-muted-foreground/60" : "cursor-pointer"
                )}
              >
                {col.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
