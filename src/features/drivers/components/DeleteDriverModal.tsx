'use client';

import { AlertTriangle, Loader2, UserX } from 'lucide-react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Driver } from '@/types';

interface DeleteDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteDriverModal({
  isOpen,
  onClose,
  driver,
  onConfirm,
  isLoading = false,
}: DeleteDriverModalProps) {
  if (!driver) return null;

  const driverName = `${driver.firstName} ${driver.lastName}`.trim() || 'this driver';

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Driver"
      description="Are you sure you want to delete this driver?"
      size="md"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="rounded-xl font-bold">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md shadow-destructive/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Confirm Deletion
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-bold">
              Warning: This action will delete the driver and their access of id-tags
            </p>
            <p className="text-xs text-destructive/80 font-medium">
              You are about to delete <strong className="font-extrabold">{driverName}</strong> ({driver.email}).
            </p>
          </div>
        </div>

        {/* Impact List */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs font-medium text-muted-foreground">
          <p className="font-bold text-foreground text-xs uppercase tracking-wider">Deletion impacts:</p>
          <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
            <li>Unassigns and detaches any ID tags currently linked to this driver</li>
          </ul>
        </div>
      </div>
    </AnimatedModal>
  );
}
