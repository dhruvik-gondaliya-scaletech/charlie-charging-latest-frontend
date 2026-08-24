'use client';

import React, { useMemo } from 'react';
import { useStation } from '@/hooks/get/useStations';
import { useSetFreeCharge } from '@/hooks/post/useStationMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  ZapOff,
  Loader2,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface FreeChargeCardProps {
  stationId: string;
}

interface ManufacturerPreset {
  name: string;
  aliases: string[];
  keys: string[];
  enableValues: Record<string, string>;
  disableValues: Record<string, string>;
}

const MANUFACTURER_PRESETS: Record<string, ManufacturerPreset> = {
  autel: {
    name: 'Autel',
    aliases: ['autel', 'autel robotics', 'autel energy'],
    keys: ['FreeVendIdTag', 'CustomLocalIdTag'],
    enableValues: {
      FreeVendIdTag: 'FFFFFFFF',
      CustomLocalIdTag: '01AUTEL0000000000005',
    },
    disableValues: {
      FreeVendIdTag: '"" (empty)',
      CustomLocalIdTag: '"" (empty)',
    },
  },
  wallbox: {
    name: 'Wallbox',
    aliases: ['wallbox', 'wallbox chargers', 'wall box chargers'],
    keys: ['AuthEnabled', 'LocalPreAuthorize', 'AuthDisabledIdTag'],
    enableValues: {
      AuthEnabled: 'false',
      LocalPreAuthorize: 'false',
      AuthDisabledIdTag: 'FFFFFFFF',
    },
    disableValues: {
      AuthEnabled: 'true',
      LocalPreAuthorize: 'true',
      AuthDisabledIdTag: '"" (empty)',
    },
  },
  blueberry: {
    name: 'Blueberry',
    aliases: ['blueberry', 'blueberry charging', 'kempower blueberry', 'vatsen blueberry', 'i-charging'],
    keys: ['FreeCharging', 'FreeChargingToken'],
    enableValues: {
      FreeCharging: 'true',
      FreeChargingToken: 'FFFFFFFF',
    },
    disableValues: {
      FreeCharging: 'false',
      FreeChargingToken: '"" (empty)',
    },
  },
  lighton: {
    name: 'LightOn',
    aliases: ['lighton', 'light on', 'light-on', 'liteon'],
    keys: [
      'LocalPreAuthorize',
      'OfflinePlugAndChargeToggle',
      'LocalAuthorizeOffline',
      'PlugAndChargeId',
    ],
    enableValues: {
      LocalPreAuthorize: 'true',
      OfflinePlugAndChargeToggle: 'true',
      LocalAuthorizeOffline: 'true',
      PlugAndChargeId: 'FFFFFFFF',
    },
    disableValues: {
      LocalPreAuthorize: 'false',
      OfflinePlugAndChargeToggle: 'false',
      LocalAuthorizeOffline: 'false',
      PlugAndChargeId: '"" (empty)',
    },
  },
  monta: {
    name: 'Monta',
    aliases: ['monta', 'monta charging'],
    keys: ['FreeCharging', 'FreeChargingIdTag'],
    enableValues: {
      FreeCharging: 'true',
      FreeChargingIdTag: 'FFFFFFFF',
    },
    disableValues: {
      FreeCharging: 'false',
      FreeChargingIdTag: 'FFFFFFFF',
    },
  },
};

function getPreset(vendor?: string): ManufacturerPreset | null {
  if (!vendor) return null;
  const normalized = vendor.trim().toLowerCase();

  // First pass: exact name or alias match
  for (const preset of Object.values(MANUFACTURER_PRESETS)) {
    if (
      preset.name.toLowerCase() === normalized ||
      preset.aliases.some((alias) => alias.toLowerCase() === normalized)
    ) {
      return preset;
    }
  }

  // Second pass: partial string inclusion match
  for (const preset of Object.values(MANUFACTURER_PRESETS)) {
    if (
      normalized.includes(preset.name.toLowerCase()) ||
      preset.aliases.some((alias) => normalized.includes(alias.toLowerCase()))
    ) {
      return preset;
    }
  }

  return null;
}

export function FreeChargeCard({ stationId }: FreeChargeCardProps) {
  const { data: station, isLoading, isError } = useStation(stationId);
  const setFreeChargeMutation = useSetFreeCharge();

  const preset = useMemo(() => getPreset(station?.vendor), [station?.vendor]);

  const handleAction = (enabled: boolean) => {
    setFreeChargeMutation.mutate({ stationId, enabled });
  };

  if (isLoading) {
    return <Skeleton className="h-44 w-full rounded-2xl" />;
  }

  if (isError || !station) {
    return null;
  }

  const isUnsupported = !preset;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 sm:p-6 shadow-sm transition-all hover:shadow-md mb-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Info Section */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-xl font-bold tracking-tight text-foreground">
              Free Charge Configuration
            </h4>

            {preset ? (
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-3 py-1 font-semibold text-xs rounded-full flex items-center gap-1.5"
              >
                <Cpu className="h-3.5 w-3.5" />
                {preset.name} Detected
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 px-3 py-1 font-semibold text-xs rounded-full flex items-center gap-1.5"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Vendor: {station.vendor || 'Unknown'} (Manual)
              </Badge>
            )}

            {/* Status Flag Badge */}
            {station.isFreeCharge ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Status: Enabled
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted/40 text-muted-foreground border-border/60 px-3 py-1 font-bold text-xs rounded-full flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Status: Disabled
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground max-w-xl">
            Automatically configures manufacturer-specific OCPP keys to allow or restrict free charging on this station without manually entering configuration keys.
          </p>

          {/* Key Mappings Preview */}
          {preset && (
            <div className="mt-3 pt-3 border-t border-border/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
                <Info className="h-3.5 w-3.5 text-primary" />
                Targeted OCPP Keys for {preset.name}:
              </div>
              <div className="flex flex-wrap gap-2">
                {preset.keys.map((k) => (
                  <Badge
                    key={k}
                    variant="secondary"
                    className="font-mono text-[11px] px-2.5 py-0.5 rounded-lg border border-border/40 bg-muted/60"
                  >
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {isUnsupported && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>
                Automatic free charge mapping is not yet configured for vendor "{station.vendor}". You can still set keys manually below.
              </span>
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md hover:shadow-emerald-600/20 rounded-xl px-6 flex items-center gap-2 transition-all active:scale-95"
            onClick={() => handleAction(true)}
            disabled={setFreeChargeMutation.isPending || isUnsupported}
          >
            {setFreeChargeMutation.isPending && setFreeChargeMutation.variables?.enabled === true ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 fill-current" />
            )}
            Enable Free Charge
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 font-bold rounded-xl px-6 flex items-center gap-2 transition-all active:scale-95 bg-background"
            onClick={() => handleAction(false)}
            disabled={setFreeChargeMutation.isPending || isUnsupported}
          >
            {setFreeChargeMutation.isPending && setFreeChargeMutation.variables?.enabled === false ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ZapOff className="h-4 w-4" />
            )}
            Disable Free Charge
          </Button>
        </div>
      </div>
    </div>
  );
}
