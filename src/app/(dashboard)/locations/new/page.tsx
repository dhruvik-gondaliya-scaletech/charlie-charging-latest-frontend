'use client';

import { LocationCreateContainer } from '@/features/locations/containers/LocationCreateContainer';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { motion } from 'framer-motion';

export default function LocationCreatePage() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="p-4 md:p-8 max-w-5xl mx-auto"
        >
            <motion.div variants={fadeInUp}>
                <LocationCreateContainer />
            </motion.div>
        </motion.div>
    );
}
