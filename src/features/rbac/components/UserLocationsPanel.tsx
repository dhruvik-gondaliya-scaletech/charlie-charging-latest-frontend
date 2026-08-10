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
      <div className="flex items-center justify-center py-12 text-white/40">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading locations…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner — empty locations = unrestricted */}
      {assignments.length === 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          <strong>Unrestricted access</strong> — this user can see all locations.
          Assign specific locations to restrict their scope.
        </div>
      )}

      {/* Assign new location */}
      {unassigned.length > 0 && (
        <div className="flex gap-3">
          <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select a location to assign…" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {unassigned.map((loc) => (
                <SelectItem key={loc.id} value={loc.id} className="text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-blue-400" />
                    <span>{loc.name}</span>
                    {loc.city && (
                      <span className="text-white/40 text-xs">— {loc.city}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAssign}
            disabled={!selectedLocationId || assignMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
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
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <MapPin className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {loc?.name ?? a.locationId}
                    </p>
                    {loc && (
                      <p className="text-xs text-white/40">
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
          <MapPinOff className="h-10 w-10 text-white/20" />
          <p className="text-sm text-white/50">No locations available to assign.</p>
        </div>
      )}
    </div>
  );
}
