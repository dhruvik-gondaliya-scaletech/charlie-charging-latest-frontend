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
  accentColor?: 'primary' | 'emerald' | 'amber';
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
  accentColor = 'primary',
}: ColumnsSelectorProps) {
  const getIconColor = () => {
    switch (accentColor) {
      case 'emerald': return 'text-emerald-500';
      case 'amber': return 'text-amber-500';
      default: return 'text-primary';
    }
  };

  const getCheckboxColor = () => {
    switch (accentColor) {
      case 'emerald':
        return 'data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 dark:data-[state=checked]:border-emerald-500';
      case 'amber':
        return 'data-[state=checked]:bg-amber-500 dark:data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 dark:data-[state=checked]:border-amber-500';
      default:
        return 'data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:data-[state=checked]:border-primary';
    }
  };

  const getScrollbarClass = () => {
    switch (accentColor) {
      case 'emerald': return 'custom-scrollbar-emerald';
      case 'amber': return 'custom-scrollbar-amber';
      default: return 'custom-scrollbar';
    }
  };

  const getPresetBtnClass = (isActive: boolean) => {
    if (!isActive) {
      switch (accentColor) {
        case 'emerald': return 'border-emerald-500/40 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10';
        case 'amber': return 'border-amber-500/40 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10';
        default: return 'border-primary/40 text-primary bg-primary/5 hover:bg-primary/10';
      }
    }
    switch (accentColor) {
      case 'emerald': return 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600';
      case 'amber': return 'border-amber-500 bg-amber-500 text-white hover:bg-amber-600';
      default: return 'border-primary bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  const iconColor = getIconColor();
  const checkboxColor = getCheckboxColor();
  const scrollbarClass = getScrollbarClass();

  return (
    <div className="space-y-3 flex flex-col min-h-0 h-full">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
          <FileSpreadsheet className={cn("h-4 w-4", iconColor)} /> Export Fields
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
            className={checkboxColor}
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
                  getPresetBtnClass(isActive)
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}

      <div className={cn(
        "flex-1 min-h-[300px] max-h-[340px] overflow-y-auto pr-2 border border-border rounded-xl bg-muted/10 p-3 space-y-2.5",
        scrollbarClass,
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
                className={checkboxColor}
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
