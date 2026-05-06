'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Loader2, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStationChargingProfile } from '@/hooks/get/useSmartCharging';
import { useSetChargingLimit, useRemoveChargingLimit } from '@/hooks/mutate/useSmartChargingMutations';
import { cn } from '@/lib/utils';

interface StationSmartChargingProps {
  stationId: string;
}

export function StationSmartCharging({ stationId }: StationSmartChargingProps) {
  const { data: profile, isLoading, isError, refetch } = useStationChargingProfile(stationId);
  const setLimit = useSetChargingLimit();
  const removeLimit = useRemoveChargingLimit();

  const [unit, setUnit] = useState<'A' | 'W'>('A');
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setUnit(profile.chargingRateUnit);
      setValue(profile.limitValue.toString());
    }
  }, [profile]);

  const handleApply = () => {
    if (!value || isNaN(Number(value))) return;
    setLimit.mutate({ stationId, unit, value: Number(value) });
  };

  const handleRemove = () => {
    removeLimit.mutate(stationId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            Station Speed Limit
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">Configure Smart Charging parameters at the station level</p>
        </div>
        {profile && (
          <Badge 
            variant="outline" 
            className={cn(
              "px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-sm",
              profile.syncStatus === 'synced' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" :
              profile.syncStatus === 'pending' ? "bg-orange-500/10 text-orange-500 border-orange-500/30" :
              "bg-destructive/10 text-destructive border-destructive/30"
            )}
          >
            {profile.syncStatus}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Configure Limit</CardTitle>
            <CardDescription>Set the maximum charging rate for the entire station</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Unit of Measurement</Label>
              <Select value={unit} onValueChange={(val) => setUnit(val as 'A' | 'W')}>
                <SelectTrigger className="h-12 rounded-xl bg-background/50 font-bold">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 backdrop-blur-xl">
                  <SelectItem value="A" className="font-bold">Amperes (A)</SelectItem>
                  <SelectItem value="W" className="font-bold">Watts (W)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Limit Value</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={unit === 'A' ? "e.g. 32" : "e.g. 22000"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-12 rounded-xl bg-background/50 font-bold pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground/40">
                  {unit}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {unit === 'A' ? "Minimum recommended current is 6A." : "Enter power in Watts (e.g., 22000W for 22kW)."}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleApply} 
                disabled={setLimit.isPending || !value}
                className="flex-1 h-12 rounded-xl font-bold shadow-md"
              >
                {setLimit.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Apply Limit
              </Button>
              {profile && (
                <Button 
                  variant="outline" 
                  onClick={handleRemove}
                  disabled={removeLimit.isPending}
                  className="h-12 w-12 rounded-xl border-border/40 hover:bg-destructive/10 hover:text-destructive transition-colors p-0"
                >
                  {removeLimit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Status Overview</CardTitle>
            <CardDescription>Current synchronization state with the charger</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!profile ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <div className="p-3 rounded-full bg-muted/40">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">No Limit Applied</p>
                  <p className="text-xs text-muted-foreground">This station is currently operating at its default capacity.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-background/40 border border-border/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Limit</span>
                    <span className="text-lg font-black text-primary">{profile.limitValue}{profile.chargingRateUnit}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/10 pt-4">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sync Status</span>
                    <div className="flex items-center gap-2">
                      {profile.syncStatus === 'synced' ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-bold text-emerald-500">Synced</span>
                        </>
                      ) : (
                        <>
                          <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                          <span className="text-sm font-bold text-orange-500">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                  {profile.lastSyncedAt && (
                    <div className="flex justify-between items-center border-t border-border/10 pt-4">
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Last Synced</span>
                      <span className="text-sm font-bold">{new Date(profile.lastSyncedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {profile.syncStatus === 'failed' && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>Failed to sync with the charger. Ensure the charger is online and supports Smart Charging.</p>
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="w-full text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100"
                >
                  <RefreshCw className="h-3 w-3 mr-2" /> Refresh Status
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
