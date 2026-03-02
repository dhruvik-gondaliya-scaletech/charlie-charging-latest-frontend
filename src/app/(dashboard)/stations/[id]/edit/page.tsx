'use client';

import { useParams } from 'next/navigation';
import { StationWizardContainer } from '@/features/stations/containers/StationWizardContainer';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { motion } from 'framer-motion';

export default function StationEditPage() {
    const { id } = useParams();

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="p-4 md:p-8 max-w-5xl mx-auto"
        >
            <motion.div variants={fadeInUp}>
                <StationWizardContainer stationId={id as string} />
            </motion.div>
        </motion.div>
    );
}
