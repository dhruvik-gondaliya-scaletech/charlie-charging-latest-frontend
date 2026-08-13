'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { Role } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteRole } from '@/hooks/delete/useRbacDelete';

interface RoleDeleteDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDeleteDialog({ role, open, onOpenChange }: RoleDeleteDialogProps) {
  const deleteMutation = useDeleteRole();

  const handleConfirm = () => {
    if (!role || role.isSystem) return;
    deleteMutation.mutate(role.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/40 text-foreground sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <DialogTitle>Delete Role</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">{role?.name}</span>? This will
            remove the role from all users that have it assigned. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
