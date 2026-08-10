'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { Role, UserRoleAssignment } from '@/types';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAssignRoleToUser } from '@/hooks/post/useRbacMutations';
import { useRemoveRoleFromUser } from '@/hooks/delete/useRbacDelete';

interface UserRolesPanelProps {
  userId: string;
  assignments: UserRoleAssignment[];
  availableRoles: Role[];
  isLoading?: boolean;
}

export function UserRolesPanel({
  userId,
  assignments,
  availableRoles,
  isLoading,
}: UserRolesPanelProps) {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const assignMutation = useAssignRoleToUser();
  const removeMutation = useRemoveRoleFromUser();

  const assignedIds = assignments.map((a) => a.roleId);
  const unassigned = availableRoles.filter((r) => !assignedIds.includes(r.id));

  const handleAssign = () => {
    if (!selectedRoleId) return;
    assignMutation.mutate(
      { userId, roleId: selectedRoleId },
      { onSuccess: () => setSelectedRoleId('') },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/40">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading roles…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assign new role */}
      {unassigned.length > 0 && (
        <div className="flex gap-3">
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select a role to assign…" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {unassigned.map((role) => (
                <SelectItem key={role.id} value={role.id} className="text-white">
                  <div className="flex items-center gap-2">
                    <RoleBadge role={role.name} size="sm" showDot={false} />
                    <span>{role.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAssign}
            disabled={!selectedRoleId || assignMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
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
      {assignments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <ShieldAlert className="h-10 w-10 text-white/20" />
          <p className="text-sm text-white/50">No roles assigned yet.</p>
          <p className="text-xs text-white/30">
            This user has no permissions until a role is assigned.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Assigned roles">
          {assignments.map((a) => (
            <li
              key={a.roleId}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <RoleBadge role={a.role.name} />
                {a.role.description && (
                  <span className="text-xs text-white/40">{a.role.description}</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                disabled={removeMutation.isPending}
                onClick={() =>
                  removeMutation.mutate({ userId, roleId: a.roleId })
                }
                aria-label={`Remove ${a.role.name} role`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
