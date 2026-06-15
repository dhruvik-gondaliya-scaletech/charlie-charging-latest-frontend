'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  BatteryCharging,
} from 'lucide-react';

interface LocationStationTreeProps {
  locations: any[];
  stations: any[];
  isLoadingTree: boolean;
  selectedLocationIds: Set<string>;
  selectedStationIds: Set<string>;
  expandedLocationIds: Set<string>;
  onLocationCheck: (locationId: string, checked: boolean) => void;
  onStationCheck: (stationId: string, locationId: string, checked: boolean) => void;
  onToggleExpand: (locationId: string) => void;
  accentColor?: 'primary' | 'emerald';
}

export function LocationStationTree({
  locations,
  stations,
  isLoadingTree,
  selectedLocationIds,
  selectedStationIds,
  expandedLocationIds,
  onLocationCheck,
  onStationCheck,
  onToggleExpand,
  accentColor = 'primary',
}: LocationStationTreeProps) {
  const locationsWithStations = locations.filter((loc) =>
    stations.some((s) => s.locationId === loc.id)
  );

  const spinnerColor = accentColor === 'emerald' ? 'border-emerald-500' : 'border-primary';

  if (isLoadingTree) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground text-sm space-y-2">
        <div className={`animate-spin rounded-full h-5 w-5 border-2 ${spinnerColor} border-t-transparent`} />
        <span>Loading locations...</span>
      </div>
    );
  }

  if (locationsWithStations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-8 text-muted-foreground text-sm">
        No locations found — all sessions will be included.
      </div>
    );
  }

  return (
    <>
      {locationsWithStations.map((loc) => {
        const locStations = stations.filter((s) => s.locationId === loc.id);
        const isExpanded = expandedLocationIds.has(loc.id);
        const isLocChecked = selectedLocationIds.has(loc.id);
        const isSomeChecked =
          locStations.some((s) => selectedStationIds.has(s.id)) && !isLocChecked;

        return (
          <div key={loc.id} className="space-y-1">
            <div className="flex items-center gap-1.5 py-1 px-1.5 rounded-lg hover:bg-muted/40 transition-colors">
              <button
                type="button"
                onClick={() => onToggleExpand(loc.id)}
                className="p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/85 transition-colors shrink-0 cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
              <Checkbox
                id={`loc-node-${loc.id}`}
                checked={isLocChecked ? true : isSomeChecked ? 'indeterminate' : false}
                onCheckedChange={(checked) => onLocationCheck(loc.id, !!checked)}
              />
              <Label
                htmlFor={`loc-node-${loc.id}`}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/90 cursor-pointer select-none flex-1 truncate"
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span className="truncate">{loc.name}</span>
                <span className="text-[10px] text-muted-foreground font-normal shrink-0">
                  ({locStations.length})
                </span>
              </Label>
            </div>
            {isExpanded && (
              <div className="pl-6 border-l border-border ml-3.5 space-y-1 pt-0.5 pb-1">
                {locStations.map((sta) => (
                  <div
                    key={sta.id}
                    className="flex items-center gap-2 py-0.5 px-1.5 rounded-md hover:bg-muted/30 transition-colors"
                  >
                    <Checkbox
                      id={`sta-node-${sta.id}`}
                      checked={selectedStationIds.has(sta.id)}
                      onCheckedChange={(checked) => onStationCheck(sta.id, loc.id, !!checked)}
                    />
                    <Label
                      htmlFor={`sta-node-${sta.id}`}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none flex-1 truncate"
                    >
                      <BatteryCharging className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span className="truncate">{sta.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
