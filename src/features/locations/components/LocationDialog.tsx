import React from 'react';
import { LocationForm } from './LocationForm';
import { LocationFormData } from '@/lib/validations/location.schema';
import { Building2 } from 'lucide-react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';

interface LocationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: LocationFormData) => void;
    initialData?: Partial<LocationFormData>;
    isLoading?: boolean;
    mode?: 'create' | 'edit';
}

export function LocationDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    initialData,
    isLoading = false,
    mode = 'create',
}: LocationDialogProps) {
    const handleSuccess = (data: LocationFormData) => {
        onSubmit(data);
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={() => onOpenChange(false)}
            title={mode === 'create' ? 'Strategic Site Definition' : 'Location Configuration'}
            description={mode === 'create'
                ? 'Register a new charging destination in the ecosystem'
                : 'Update operational metrics for this charging site'}
            size="lg"
            className="overflow-hidden"
            contentClassName="p-0"
            headerClassName="pt-8 px-8 pb-6 border-none"
        >
            <div className="relative">
                {/* Decorative element */}
                <div className="absolute -top-[104px] left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-violet-500/50 to-primary/50" />

                <div className="px-8 pb-10">
                    <LocationForm
                        initialData={initialData}
                        onSubmit={handleSuccess}
                        isLoading={isLoading}
                        mode={mode}
                    />
                </div>
            </div>
        </AnimatedModal>
    );
}
