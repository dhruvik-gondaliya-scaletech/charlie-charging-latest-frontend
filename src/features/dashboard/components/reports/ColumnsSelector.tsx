'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet } from 'lucide-react';

interface ColumnItem {
  id: string;
  label: string;
}

interface ColumnsSelectorProps {
  availableColumns: ColumnItem[];
  selectedColumns: string[];
  onColumnToggle: (columnId: string, checked: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function ColumnsSelector({
  availableColumns,
  selectedColumns,
  onColumnToggle,
  onSelectAll,
  onDeselectAll,
}: ColumnsSelectorProps) {
  return (
    <div className="space-y-3 flex flex-col min-h-0 h-full">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
          <FileSpreadsheet className="h-4 w-4 text-primary" /> Export Fields
        </Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
          >
            Select All
          </button>
          <span className="text-border text-xs">|</span>
          <button
            type="button"
            onClick={onDeselectAll}
            className="text-xs text-muted-foreground hover:text-muted-foreground/80 font-medium transition-colors cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] max-h-[340px] overflow-y-auto pr-2 custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-2.5">
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
              />
              <Label
                htmlFor={`col-node-${col.id}`}
                className="text-sm text-foreground/80 font-normal cursor-pointer select-none"
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
