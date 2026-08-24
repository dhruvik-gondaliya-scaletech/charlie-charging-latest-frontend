'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Search,
  Loader2,
  ShieldCheck,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { useLocations } from '@/hooks/get/useLocations';
import { useLocationGroups } from '@/hooks/get/useReporting';
import { useUpdateLocationGroupLocations } from '@/hooks/put/useReportingMutations';
import { useAuth } from '@/contexts/AuthContext';
import { AppPermission } from '@/types';

export function LocationGroupsTab() {
  const { hasPermission } = useAuth();
  const canUpdateReports = hasPermission(AppPermission.REPORTS_UPDATE);

  const { data: rawLocationsData, isLoading: isLocationsLoading } = useLocations();
  const rawLocations = useMemo(() => {
    if (!rawLocationsData) return [];
    return Array.isArray(rawLocationsData) ? rawLocationsData : (rawLocationsData?.items || []);
  }, [rawLocationsData]);

  const { data: locationGroups, isLoading: isGroupsLoading } = useLocationGroups();
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const updateGroup = useUpdateLocationGroupLocations();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupLocationIds, setSelectedGroupLocationIds] = useState<string[]>([]);
  const [isSavingGroup, setIsSavingGroup] = useState(false);

  // Sync selected group locations to state on group selection/update
  useEffect(() => {
    if (selectedGroup) {
      const groupName = selectedGroup.name;
      const groupFromData = locationGroups?.find((g: any) => g.name === groupName);
      if (groupFromData) {
        setSelectedGroupLocationIds(groupFromData.locations.map((loc: any) => loc.id));
      }
    } else {
      setSelectedGroupLocationIds([]);
    }
  }, [selectedGroup, locationGroups]);

  const filteredGroupLocations = useMemo(() => {
    if (!rawLocations) return [];
    return rawLocations.filter(loc =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loc.address && loc.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [rawLocations, searchTerm]);

  const handleToggleGroupLocation = (id: string) => {
    setSelectedGroupLocationIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllGroup = () => {
    if (rawLocations) {
      setSelectedGroupLocationIds(rawLocations.map(l => l.id));
    }
  };

  const handleDeselectAllGroup = () => {
    setSelectedGroupLocationIds([]);
  };

  const handleSaveChangesGroup = async () => {
    if (!selectedGroup) return;
    setIsSavingGroup(true);
    try {
      await updateGroup.mutateAsync({
        groupName: selectedGroup.name,
        locationIds: selectedGroupLocationIds
      });
      setSelectedGroup(null);
    } catch (err) {
      // Handled by hook
    } finally {
      setIsSavingGroup(false);
    }
  };

  return (
    <>
      {!selectedGroup ? (
        <Card className="bg-card/40 border-border/40 backdrop-blur-md rounded-2xl shadow-md p-4 sm:p-6">
          <div className="pb-4 border-b border-border/10 mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Location Groups</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Select a location group to configure its assigned compliance locations.</p>
          </div>

          {isGroupsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading location groups...</p>
            </div>
          ) : !locationGroups || locationGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/20 rounded-xl gap-2">
              <Info className="h-8 w-8 opacity-40" />
              <p className="text-sm font-semibold">No location groups found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {locationGroups.map((group: any) => (
                <Card
                  key={group.id || group.name}
                  onClick={() => setSelectedGroup(group)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-primary truncate">
                        {group.name.toUpperCase()} Group
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                        {group.locations?.length || 0} locations attached
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors rounded-lg border-primary/30 text-primary"
                        >
                          {canUpdateReports ? 'Manage Locations' : 'View Locations'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <Card className="bg-card/40 border-border/40 backdrop-blur-md rounded-2xl shadow-md p-4 sm:p-6">
          <div className="pb-4 border-b border-border/10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 mt-0.5 sm:mt-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">
                    {selectedGroup.name.toUpperCase()} Group Assignments
                  </h2>
                  <span className="bg-primary/15 text-primary text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-primary/20 tracking-wider">
                    {selectedGroup.name.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Check the locations whose stations should be included in {selectedGroup.name.toUpperCase()} reporting API outputs.
                </p>
              </div>
            </div>

            {canUpdateReports && (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleSelectAllGroup}
                  size="sm"
                  className="flex-1 sm:flex-initial rounded-lg text-xs font-bold"
                  disabled={isLocationsLoading}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeselectAllGroup}
                  size="sm"
                  className="flex-1 sm:flex-initial rounded-lg text-xs font-bold"
                  disabled={isLocationsLoading}
                >
                  Deselect All
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-6">

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Search locations by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-11 text-xs sm:text-sm rounded-xl bg-background/50 border-border/40 focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Locations Checklist */}
            {isLocationsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Loading locations list...</p>
              </div>
            ) : filteredGroupLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/20 rounded-xl gap-2">
                <Info className="h-8 w-8 opacity-40" />
                <p className="text-sm font-semibold">No locations found</p>
                <p className="text-xs text-muted-foreground">Try altering your search phrase.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                {filteredGroupLocations.map((loc) => {
                  const isSelected = selectedGroupLocationIds.includes(loc.id);
                  return (
                    <div
                      key={loc.id}
                      onClick={() => {
                        if (canUpdateReports) {
                          handleToggleGroupLocation(loc.id);
                        }
                      }}
                      className={cn(
                        "flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border-2 transition-all select-none",
                        canUpdateReports ? "cursor-pointer" : "cursor-default",
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
                          : 'border-border/40 bg-background/20 hover:border-border/80'
                      )}
                    >
                      <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleGroupLocation(loc.id)}
                          className="rounded-md border-2"
                          disabled={!canUpdateReports}
                        />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold truncate leading-snug">{loc.name}</p>
                        {loc.address && (
                          <p className="text-xs text-muted-foreground break-words line-clamp-2">
                            {loc.address}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[9px] font-black uppercase text-muted-foreground bg-muted/60 border px-1.5 py-0.5 rounded">
                            {loc.stationCount || 0} Stations
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{selectedGroupLocationIds.length} location(s) selected for group inclusion.</span>
              </div>
              {canUpdateReports ? (
                <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedGroup(null)}
                    disabled={isSavingGroup}
                    className="flex-1 sm:flex-none rounded-xl px-5 h-10 sm:h-11 font-bold text-xs sm:text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveChangesGroup}
                    disabled={isSavingGroup || isLocationsLoading}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 h-10 sm:h-11 rounded-xl transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    {isSavingGroup ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving Group...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setSelectedGroup(null)}
                  className="rounded-xl px-5 h-10 sm:h-11 font-bold text-xs sm:text-sm w-full sm:w-auto"
                >
                  Close
                </Button>
              )}
            </div>

          </div>
        </Card>
      )}
    </>
  );
}
