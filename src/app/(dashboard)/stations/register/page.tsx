'use client';

import { StationWizardContainer } from '@/features/stations/containers/StationWizardContainer';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/motion';

export default function RegisterStationPage() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="p-4 md:p-8 max-w-5xl mx-auto"
        >
            <StationWizardContainer mode="create" />
        </motion.div>
    );
}
