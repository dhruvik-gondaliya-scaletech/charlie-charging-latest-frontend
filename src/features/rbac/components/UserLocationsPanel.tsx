'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, MapPin, MapPinOff } from 'lucide-react';
import { Location, UserLocationAssignment } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAssignLocationsToUser } from '@/hooks/post/useRbacMutations';
import { useRemoveLocationFromUser } from '@/hooks/delete/useRbacDelete';

interface UserLocationsPanelProps {
  userId: string;
  assignments: UserLocationAssignment[];
  availableLocations: Location[];
  isLoading?: boolean;
}

export function UserLocationsPanel({
  userId,
  assignments,
  availableLocations,
  isLoading,
}: UserLocationsPanelProps) {
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const assignMutation = useAssignLocationsToUser();
  const removeMutation = useRemoveLocationFromUser();

  const assignedIds = assignments.map((a) => a.locationId);
  const unassigned = availableLocations.filter((l) => !assignedIds.includes(l.id));

  const handleAssign = () => {
    if (!selectedLocationId) return;
    assignMutation.mutate(
      { userId, locationIds: [selectedLocationId] },
      { onSuccess: () => setSelectedLocationId('') },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading locations…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner — empty locations = unrestricted */}
      {assignments.length === 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          <strong>Unrestricted access</strong> — this user can see all locations.
          Assign specific locations to restrict their scope.
        </div>
      )}

      {/* Assign new location */}
      {unassigned.length > 0 && (
        <div className="flex gap-3">
          <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
            <SelectTrigger className="flex-1 bg-muted/20 border-border/40 text-foreground focus:ring-primary/20 rounded-xl font-bold">
              <SelectValue placeholder="Select a location to assign…" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/40 rounded-xl">
              {unassigned.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{loc.name}</span>
                    {loc.city && (
                      <span className="text-muted-foreground text-xs">— {loc.city}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAssign}
            disabled={!selectedLocationId || assignMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
          >
            {assignMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Assign
          </Button>
        </div>
      )}

      {/* Current assignments */}
      {assignments.length > 0 && (
        <ul className="space-y-2" role="list" aria-label="Assigned locations">
          {assignments.map((a) => {
            const loc = a.location;
            return (
              <li
                key={a.locationId}
                className="flex items-center justify-between rounded-lg border border-border/50 dark:border-white/10 bg-muted/40 dark:bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {loc?.name ?? a.locationId}
                    </p>
                    {loc && (
                      <p className="text-xs text-muted-foreground">
                        {[loc.city, loc.state, loc.country].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                  disabled={removeMutation.isPending}
                  onClick={() =>
                    removeMutation.mutate({ userId, locationId: a.locationId })
                  }
                  aria-label={`Remove location ${loc?.name ?? a.locationId}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      {assignments.length === 0 && unassigned.length === 0 && !isLoading && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <MapPinOff className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No locations available to assign.</p>
        </div>
      )}
    </div>
  );
}
