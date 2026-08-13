'use client';

import { useParams } from 'next/navigation';
import { LocationUpdateContainer } from '@/features/locations/containers/LocationUpdateContainer';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppPermission } from '@/types';

export default function LocationEditPage() {
    const { id } = useParams();

    return (
        <ProtectedRoute requiredPermission={AppPermission.LOCATION_UPDATE}>
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4 md:p-8 max-w-5xl mx-auto"
            >
                <motion.div variants={fadeInUp}>
                    <LocationUpdateContainer locationId={id as string} />
                </motion.div>
            </motion.div>
        </ProtectedRoute>
    );
}
