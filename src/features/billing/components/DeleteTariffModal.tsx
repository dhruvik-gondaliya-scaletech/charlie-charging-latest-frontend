'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Tariff } from '@/services/billing.service';

interface DeleteTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariff: Tariff | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteTariffModal({
  isOpen,
  onClose,
  tariff,
  onConfirm,
  isLoading = false,
}: DeleteTariffModalProps) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Tariff"
      description="Are you absolutely sure? This action cannot be undone."
      size="md"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Confirm Deletion'
            )}
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive">
        <AlertTriangle className="h-6 w-6 shrink-0" />
        <p className="text-sm font-medium">
          You are about to delete <strong>{tariff?.name}</strong>.
        </p>
      </div>
    </AnimatedModal>
  );
}
