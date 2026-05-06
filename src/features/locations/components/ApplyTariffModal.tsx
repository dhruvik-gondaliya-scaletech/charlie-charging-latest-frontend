'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTariffs } from '@/hooks/get/useBilling';
import { locationService } from '@/services/location.service';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

interface ApplyTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationId: string;
}

export function ApplyTariffModal({ isOpen, onClose, locationId }: ApplyTariffModalProps) {
  const { data: tariffs, isLoading } = useTariffs();
  const [selectedTariff, setSelectedTariff] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleApply = async () => {
    if (!selectedTariff) {
      toast.error('Please select a tariff first');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await locationService.applyTariffToLocation(locationId, selectedTariff);
      toast.success('Tariff applied successfully to all stations in this location.');
      
      // Invalidate stations query to refresh data
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      
      onClose();
      setSelectedTariff('');
    } catch (error) {
      console.error('Failed to apply tariff:', error);
      toast.error('Failed to apply tariff. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setSelectedTariff(''); } }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply Tariff to Location</DialogTitle>
          <DialogDescription>
            Select a tariff to apply to all stations within this location. This will overwrite any existing tariff assignments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Select value={selectedTariff} onValueChange={setSelectedTariff} disabled={isLoading || isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading tariffs..." : "Select a tariff"} />
              </SelectTrigger>
              <SelectContent>
                {tariffs?.map((tariff) => (
                  <SelectItem key={tariff.id} value={tariff.id}>
                    {tariff.name} {tariff.currency ? `(${tariff.currency})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!selectedTariff || isSubmitting}>
            {isSubmitting ? 'Applying...' : 'Apply Tariff'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
