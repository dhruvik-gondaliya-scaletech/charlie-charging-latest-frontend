'use client';

import { LocationDetailContainer } from "@/features/locations/containers/LocationDetailContainer";
import { motion } from "framer-motion";

export default function LocationDetailPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-full"
        >
            <LocationDetailContainer />
        </motion.div>
    );
}
